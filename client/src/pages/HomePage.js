import React, { useState, useEffect, useCallback } from 'react';
import PostCard from '../components/PostCard';
import api from '../api';

const CATEGORIES = ['All', 'Technology', 'Writing', 'Travel', 'Health', 'Business', 'Art', 'Science', 'General'];

export default function HomePage() {
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
      const params = { page, limit: LIMIT };
      if (search)              params.search   = search;
      if (category !== 'All') params.category = category;

      // FIXED: Removed { data } destructuring
      const responseData = await api.get('/posts', { params });
      
      setPosts(responseData.posts || []);
      setTotal(responseData.total || 0);
    } catch (err) {
      console.error(err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => { 
    fetchPosts(); 
  }, [fetchPosts]);

  // Reset to page 1 on filter change
  const handleSearch   = (e) => { setSearch(e.target.value); setPage(1); };
  const handleCategory = (cat) => { setCategory(cat); setPage(1); };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section">
        <h1>Ideas worth <em>sharing</em></h1>
        <p>A platform for writers, thinkers, and creators.</p>

        {/* Search bar */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search posts…"
            value={search}
            onChange={handleSearch}
          />
          {search && <button className="search-clear" onClick={() => { setSearch(''); setPage(1); }}>✕</button>}
        </div>
      </section>

      {/* Category filter */}
      <div className="category-filter">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${category === cat ? 'active' : ''}`}
            onClick={() => handleCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results summary */}
      <div className="results-meta">
        {!loading && <span>{total} post{total !== 1 ? 's' : ''}{search ? ` for "${search}"` : ''}</span>}
      </div>

      {/* Posts grid */}
      {loading && <div className="loading-spinner">Loading posts…</div>}
      {error   && <div className="error-box">{error}</div>}

      {!loading && !error && posts.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No posts found</h3>
          <p>Try a different search or category.</p>
        </div>
      )}

      <div className="posts-grid">
        {posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>

      {/* Pagination */}
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
