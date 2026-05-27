import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const CATEGORIES = ['Technology', 'Writing', 'Travel', 'Health', 'Business', 'Art', 'Science', 'General'];

export default function EditPost() {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', content: '', category: 'General', tags: '', excerpt: '' });
  const [loadingPost, setLoadingPost] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        const post = data.post;

        // Only the author can edit
        if (user._id !== post.author?._id) {
          navigate(`/post/${id}`);
          return;
        }

        setForm({
          title:    post.title,
          content:  post.content,
          category: post.category,
          tags:     post.tags?.join(', ') || '',
          excerpt:  post.excerpt || '',
        });
      } catch {
        setError('Failed to load post.');
      } finally {
        setLoadingPost(false);
      }
    };
    fetchPost();
  }, [id, user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.content.trim()) return setError('Title and content are required.');

    setSaving(true);
    try {
      const tagsArray = form.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
      await api.put(`/posts/${id}`, {
        title:    form.title.trim(),
        content:  form.content.trim(),
        category: form.category,
        excerpt:  form.excerpt.trim() || undefined,
        tags:     tagsArray,
      });
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingPost) return <div className="loading-screen">Loading post…</div>;

  return (
    <div className="create-post-page">
      <div className="create-post-header">
        <h1>Edit post</h1>
        <p>Update your post and republish</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input id="title" name="title" type="text" value={form.title} onChange={handleChange} maxLength={150} required />
          <span className="char-count">{form.title.length}/150</span>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="tags">Tags <span className="label-hint">(comma-separated)</span></label>
            <input id="tags" name="tags" type="text" value={form.tags} onChange={handleChange} placeholder="react, nodejs" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Short excerpt</label>
          <input id="excerpt" name="excerpt" type="text" value={form.excerpt} onChange={handleChange} maxLength={300} />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea id="content" name="content" value={form.content} onChange={handleChange} rows={18} required />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate(`/post/${id}`)}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : '💾 Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
