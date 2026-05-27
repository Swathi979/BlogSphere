const Post    = require('../models/Post');
const Comment = require('../models/Comment');

// GET /api/posts  — list all posts (supports ?search=&category=&page=&limit=)
exports.getAllPosts = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (search)   filter.$text = { $search: search };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Post.countDocuments(filter);

    const posts = await Post.find(filter)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Attach comment count to each post
    const postIds = posts.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { postId: { $in: postIds } } },
      { $group: { _id: '$postId', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    commentCounts.forEach((c) => { countMap[c._id.toString()] = c.count; });

    const result = posts.map((p) => ({
      ...p,
      commentCount: countMap[p._id.toString()] || 0,
      likeCount:    p.likes ? p.likes.length : 0,
    }));

    res.json({ success: true, total, page: Number(page), limit: Number(limit), posts: result });
  } catch (err) {
    next(err);
  }
};

// GET /api/posts/:id
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username avatar bio');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const commentCount = await Comment.countDocuments({ postId: post._id });
    res.json({ success: true, post: { ...post.toObject(), commentCount } });
  } catch (err) {
    next(err);
  }
};

// POST /api/posts  (protected)
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, category, tags, coverImage, excerpt } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const post = await Post.create({
      title,
      content,
      excerpt,
      category: category || 'General',
      tags:     tags || [],
      coverImage,
      author:   req.user._id,
    });

    await post.populate('author', 'username avatar');
    res.status(201).json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

// PUT /api/posts/:id  (protected — author only)
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised to edit this post' });
    }

    const { title, content, category, tags, coverImage, excerpt } = req.body;
    Object.assign(post, { title, content, category, tags, coverImage, excerpt });
    await post.save();
    await post.populate('author', 'username avatar');

    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/posts/:id  (protected — author only)
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised to delete this post' });
    }

    await post.deleteOne();
    // Also delete all comments on this post
    await Comment.deleteMany({ postId: req.params.id });

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// POST /api/posts/:id/like  (protected — toggle like)
exports.toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const userId   = req.user._id.toString();
    const likeIdx  = post.likes.map((l) => l.toString()).indexOf(userId);
    const liked    = likeIdx === -1;

    if (liked) post.likes.push(req.user._id);
    else        post.likes.splice(likeIdx, 1);

    await post.save();
    res.json({ success: true, liked, likeCount: post.likes.length });
  } catch (err) {
    next(err);
  }
};
