const express = require('express');
const router  = express.Router();
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// GET  /api/comments/:postId — get all comments for a post (public)
// POST /api/comments/:postId — add comment (auth)
router.route('/:postId')
  .get(getComments)
  .post(protect, addComment);

// DELETE /api/comments/:id  — delete own comment (auth)
router.delete('/:id', protect, deleteComment);

module.exports = router;
