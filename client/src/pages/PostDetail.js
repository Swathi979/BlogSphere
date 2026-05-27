import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import api from '../api';

export default function PostDetail() {
  const { id }             = useParams();
  const { user }           = useAuth();
  const navigate           = useNavigate();
  const [post,     setPost]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [liked,    setLiked]    = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking,   setLiking]   = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data.post);
        setLikeCount(data.post.likes?.length || 0);
        if (user) setLiked(data.post.likes?.includes(user._id));
      } catch (err) {
        setError(err.response?.status === 404 ? 'Post not found.' : 'Failed to load post.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user]);

  const handleLike = async () => {
    if (!user)  { navigate('/login'); return; }
    if (liking) return;
    setLiking(true);
    try {
      const { data } = await api.post(`/posts/${id}/like`);
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch {
      alert('Failed to like post.');
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch {
      alert('Failed to delete post.');
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) return <div className="loading-screen">Loading post…</div>;
  if (error)   return <div className="error-page"><h2>{error}</h2><Link to="/">← Go Home</Link></div>;
  if (!post)   return null;

  const isOwner   = user && user._id === post.author?._id;
  const initials  = post.author?.username?.slice(0, 2).toUpperCase() || '??';

  return (
    <div className="post-detail-page">
      {/* Back button */}
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      {/* Post header */}
      <article className="post-full">
        <div className="post-full-meta">
          <span className="category-badge">{post.category}</span>
          <span className="post-date">{formatDate(post.createdAt)}</span>
        </div>

        <h1 className="post-full-title">{post.title}</h1>

        {/* Author row */}
        <div className="post-author-row">
          <div className="author-avatar large">{initials}</div>
          <div>
            <div className="post-author-name">{post.author?.username || 'Unknown'}</div>
            {post.author?.bio && <div className="post-author-bio">{post.author.bio}</div>}
          </div>
          {isOwner && (
            <div className="post-owner-actions">
              <Link to={`/edit/${post._id}`} className="btn btn-outline-sm">✏️ Edit</Link>
              <button onClick={handleDelete} className="btn btn-danger-sm">🗑 Delete</button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="post-full-content">
          {post.content.split('\n').map((para, i) =>
            para.trim() ? <p key={i}>{para}</p> : <br key={i} />
          )}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag) => <span key={tag} className="tag-pill">#{tag}</span>)}
          </div>
        )}

        {/* Like button */}
        <div className="post-actions">
          <button
            className={`like-btn ${liked ? 'liked' : ''}`}
            onClick={handleLike}
            disabled={liking}
            title={user ? (liked ? 'Unlike' : 'Like this post') : 'Login to like'}
          >
            {liked ? '❤️' : '🤍'} {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
          </button>
          <span className="share-hint">Share this post with someone 💌</span>
        </div>
      </article>

      {/* Comments */}
      <CommentSection postId={id} />
    </div>
  );
}
