import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CATEGORIES = ['Technology', 'Writing', 'Travel', 'Health', 'Business', 'Art', 'Science', 'General'];

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', content: '', category: 'General', tags: '', excerpt: '',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.content.trim()) {
      return setError('Title and content are required.');
    }

    setLoading(true);
    try {
      const tagsArray = form.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const data = await api.post('/posts', {
        title:    form.title.trim(),
        content:  form.content.trim(),
        category: form.category,
        excerpt:  form.excerpt.trim() || undefined,
        tags:     tagsArray,
      });

      navigate(`/post/${data.post._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="create-post-page">
      <div className="create-post-header">
        <h1>Write a new post</h1>
        <p>Share your ideas with the BlogSphere community</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="An interesting title…"
            maxLength={150}
            required
            autoFocus
          />
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
            <input
              id="tags"
              name="tags"
              type="text"
              value={form.tags}
              onChange={handleChange}
              placeholder="react, nodejs, javascript"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Short excerpt <span className="label-hint">(optional — auto-generated if left blank)</span></label>
          <input
            id="excerpt"
            name="excerpt"
            type="text"
            value={form.excerpt}
            onChange={handleChange}
            placeholder="A brief description of your post…"
            maxLength={300}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Write your post here… Use blank lines to create paragraphs."
            rows={18}
            required
          />
          <span className="word-count">{wordCount} words</span>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Publishing…' : '🚀 Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
