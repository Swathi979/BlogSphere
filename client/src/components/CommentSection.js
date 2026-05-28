import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function CommentSection({ postId }) {
  const { user }                    = useAuth();
  const [comments,  setComments]    = useState([]);
  const [text,      setText]        = useState('');
  const [loading,   setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,     setError]       = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      // FIXED: Removed destructuring
      const responseData = await api.get(`/comments/${postId}`);
      setComments(responseData.comments || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load comments.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setSubmitting(true);
    setError('');
    try {
      // FIXED: Removed destructuring
      const responseData = await api.post(`/comments/${postId}`, { text });
      
      setComments((prev) => [...prev, responseData.comment]);
      setText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      alert('Failed to delete comment.');
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <section className="comments-section">
      <h3 className="comments-heading">💬 Comments ({comments.length})</h3>

      {loading && <p className="loading-text">Loading comments…</p>}
      {error   && <p className="error-text">{error}</p>}

      {/* Comment list */}
      <div className="comment-list">
        {!loading && comments.length === 0 && (
          <p className="no-comments">No comments yet. Be the first!</p>
        )}
        {comments.map((comment) => {
          const initials = comment.userId?.username
            ? comment.userId.username.slice(0, 2).toUpperCase()
            : '??';
          const isOwner = user && user._id === comment.userId?._id;

          return (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <div className="comment-author">
                  <div className="comment-avatar">{initials}</div>
                  <div>
                    <span className="comment-username">{comment.userId?.username || 'Unknown'}</span>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                  </div>
                </div>
                {isOwner && (
                  <button
                    className="btn-delete-comment"
                    onClick={() => handleDelete(comment._id)}
                    title="Delete comment"
                  >
                    🗑
                  </button>
                )}
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          );
        })}
      </div>

      {/* Add comment form */}
      {user ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <h4>Add a comment</h4>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts…"
            rows={3}
            maxLength={500}
          />
          <div className="comment-form-footer">
            <span className="char-count">{text.length}/500</span>
            <button type="submit" className="btn btn-primary" disabled={submitting || !text.trim()}>
              {submitting ? 'Posting…' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="comment-login-prompt">
          <Link to="/login">Login</Link> to leave a comment.
        </div>
      )}
    </section>
  );
}
