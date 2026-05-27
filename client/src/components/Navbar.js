import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const initial = user && user.username ? user.username[0].toUpperCase() : '?';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">Blog<span>Sphere</span></Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          {user && <Link to="/create" className="nav-link">+ Write</Link>}
          {user ? (
            <>
              <Link to="/profile" className="nav-link">
                <span className="avatar-chip">{initial}</span>
                {user.username}
              </Link>
              <button className="btn btn-outline-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-outline-sm">Login</Link>
              <Link to="/register" className="btn btn-primary-sm">Register</Link>
            </>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <Link to="/" className="mobile-link">🏠 Home</Link>
          {user && <Link to="/create"  className="mobile-link">✏️ Write Post</Link>}
          {user && <Link to="/profile" className="mobile-link">👤 Profile</Link>}
          {user
            ? <button className="mobile-link" onClick={handleLogout}>🚪 Logout</button>
            : <>
                <Link to="/login"    className="mobile-link">🔑 Login</Link>
                <Link to="/register" className="mobile-link">📝 Register</Link>
              </>
          }
        </div>
      )}
    </nav>
  );
}
