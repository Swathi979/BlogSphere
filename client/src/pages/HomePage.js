import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const CATS = ['All','Technology','Writing','Travel','Health','Business','Art','Science','General'];

export default function HomePage() {
  const { user } = useAuth();
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);
  const LIMIT = 9;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let url = `/posts?page=${page}&limit=${LIMIT}`;
      if (search)             url += `&search=${encodeURIComponent(search)}`;
      if (category !== 'All') url += `&category=${encodeURIComponent(category)}`;

      const data = await api.get(url);
      setPosts(data.posts || []);
      setTotal(data.total || 0);
    } catch {
      setError('Failed to load posts. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1>Ideas worth <em>sharing</em></h1>
        <p>A platform for writers, thinkers, and creators.</p>
        {!user && (
          <div className="hero-btns">
            <Link to="/register" className="btn btn-primary">Start Writing</Link>
            <Link to="/login"    className="btn btn-outline">Sign In</Link>
          </div>
        )}
        <div className="search-bar">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          {search && <button onClick={() => { setSearch(''); setPage(1); }}>✕</button>}
        </div>
      </section>

      <div className="category-filter">
        {CATS.map(c => (
          <button
            key={c}
            className={`category-btn${category === c ? ' active' : ''}`}
            onClick={() => { setCategory(c); setPage(1); }}
          >{c}</button>
        ))}
      </div>

      <div className="results-meta">
        {!loading && <span>{total} post{total !== 1 ? 's' : ''}{search ? ` for "${search}"` : ''}</span>}
      </div>

      {loading && <div className="loading-spinner">Loading posts...</div>}
      {error   && <div className="error-box">{error}</div>}

      {!loading && !error && posts.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No posts found</h3>
          <p>Try a different search or be the first to write!</p>
          {user && <Link to="/create" className="btn btn-primary">Write First Post</Link>}
        </div>
      )}

      <div className="posts-grid">
        {posts.map(post => <PostCard key={post._id} post={post} />)}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1}          onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages}  onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
