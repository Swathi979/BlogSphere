import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import api from '../api';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [bio,     setBio]     = useState(user?.bio || '');
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const { data } = await api.get('/posts', { params: { limit: 50 } });
        // Filter to only this user's posts (server doesn't have a /posts?author= endpoint yet — easy to add)
        setPosts(data.posts.filter((p) => p.author?._id === user._id || p.author === user._id));
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, [user._id]);

  const handleSaveBio = async () => {
    setSaving(true);
    setMsg('');
    try {
      await updateProfile(bio, user.avatar);
      setEditing(false);
      setMsg('Profile updated!');
    } catch {
      setMsg('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <div className="profile-page">
      {/* Profile card */}
      <div className="profile-card">
        <div className="profile-avatar-large">{initials}</div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p className="profile-email">{user.email}</p>
          <p className="profile-joined">Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>

          {editing ? (
            <div className="bio-edit">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself…"
                maxLength={200}
                rows={3}
              />
              <span className="char-count">{bio.length}/200</span>
              <div className="bio-edit-actions">
                <button className="btn btn-primary btn-sm" onClick={handleSaveBio} disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => { setEditing(false); setBio(user.bio || ''); }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bio-display">
              <p>{user.bio || <em style={{color:'#888'}}>No bio yet.</em>}</p>
              <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>✏️ Edit bio</button>
            </div>
          )}

          {msg && <p className="profile-msg">{msg}</p>}
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-number">{posts.length}</div>
          <div className="stat-label">Posts Written</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0)}</div>
          <div className="stat-label">Total Likes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{posts.reduce((sum, p) => sum + (p.commentCount || 0), 0)}</div>
          <div className="stat-label">Comments Received</div>
        </div>
      </div>

      {/* My posts */}
      <div className="profile-posts">
        <div className="profile-posts-header">
          <h2>Your Posts</h2>
          <Link to="/create" className="btn btn-primary btn-sm">+ New Post</Link>
        </div>

        {loading && <p className="loading-text">Loading your posts…</p>}

        {!loading && posts.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">✍️</div>
            <h3>No posts yet</h3>
            <p>Write your first post and share it with the world!</p>
            <Link to="/create" className="btn btn-primary">Start Writing</Link>
          </div>
        )}

        <div className="posts-grid">
          {posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </div>
  );
}
