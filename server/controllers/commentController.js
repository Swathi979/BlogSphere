const Comment = require('../models/Comment');
const Post    = require('../models/Post');

// GET /api/comments/:postId
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('userId', 'username avatar')
      .sort({ createdAt: 1 });

    res.json({ success: true, count: comments.length, comments });
  } catch (err) {
    next(err);
  }
};

// POST /api/comments/:postId  (protected)
exports.addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    // Verify post exists
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const comment = await Comment.create({
      postId: req.params.postId,
      userId: req.user._id,
      text:   text.trim(),
    });

    await comment.populate('userId', 'username avatar');
    res.status(201).json({ success: true, comment });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/comments/:id  (protected — own comment only)
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorised to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};
