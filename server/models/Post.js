const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [20, 'Content must be at least 20 characters'],
    },
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    category: {
      type: String,
      enum: ['Technology', 'Writing', 'Travel', 'Health', 'Business', 'Art', 'Science', 'General'],
      default: 'General',
    },
    tags: [{ type: String, trim: true }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    coverImage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Auto-generate excerpt from content if not provided
postSchema.pre('save', function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 200).trim() + '...';
  }
  next();
});

// Virtual: comment count (populated separately via Comment model)
postSchema.virtual('likeCount').get(function () {
  return this.likes ? this.likes.length : 0;
});

// Index for search
postSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Post', postSchema);
