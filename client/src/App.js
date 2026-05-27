import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar       from './components/Navbar';
import HomePage     from './pages/HomePage';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePost   from './pages/CreatePost';
import EditPost     from './pages/EditPost';
import PostDetail   from './pages/PostDetail';
import ProfilePage  from './pages/ProfilePage';
import NotFound     from './pages/NotFound';

// Redirect to login if not authenticated
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
};

// Redirect to home if already authenticated
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading…</div>;
  return user ? <Navigate to="/" replace /> : children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main className="main-container">
        <Routes>
          <Route path="/"         element={<HomePage />} />
          <Route path="/post/:id" element={<PostDetail />} />

          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          <Route path="/create"      element={<PrivateRoute><CreatePost /></PrivateRoute>} />
          <Route path="/edit/:id"    element={<PrivateRoute><EditPost /></PrivateRoute>} />
          <Route path="/profile"     element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
