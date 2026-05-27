const express = require('express');
const router  = express.Router();
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

// GET  /api/posts          — list (public)
// POST /api/posts          — create (auth required)
router.route('/')
  .get(getAllPosts)
  .post(protect, createPost);

// GET    /api/posts/:id    — single post (public)
// PUT    /api/posts/:id    — update (auth + owner)
// DELETE /api/posts/:id    — delete (auth + owner)
router.route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

// POST /api/posts/:id/like — toggle like (auth)
router.post('/:id/like', protect, toggleLike);

module.exports = router;
