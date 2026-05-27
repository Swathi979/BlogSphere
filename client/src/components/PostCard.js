import React from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const { _id, title, excerpt, author, category, likes, commentCount, createdAt } = post;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const initials = author?.username
    ? author.username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <article className="post-card">
      {/* Category badge */}
      <div className="post-card-meta">
        <span className="category-badge">{category}</span>
        <span className="post-date">{formattedDate}</span>
      </div>

      {/* Title */}
      <h2 className="post-card-title">
        <Link to={`/post/${_id}`}>{title}</Link>
      </h2>

      {/* Excerpt */}
      <p className="post-card-excerpt">{excerpt}</p>

      {/* Footer */}
      <div className="post-card-footer">
        <div className="author-info">
          <div className="author-avatar">{initials}</div>
          <span className="author-name">{author?.username || 'Unknown'}</span>
        </div>
        <div className="post-stats">
          <span title="Likes">❤️ {likes?.length || 0}</span>
          <span title="Comments">💬 {commentCount || 0}</span>
        </div>
      </div>
    </article>
  );
}
