import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, LogOut, LayoutDashboard, Home } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLinkStyle = (path) => ({
    textDecoration: 'none',
    color: pathname === path ? 'var(--primary-purple)' : 'var(--text-muted)',
    fontWeight: 600,
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.75rem',
    borderRadius: '8px',
    background: pathname === path ? 'rgba(139,92,246,0.08)' : 'transparent',
    transition: 'all 0.2s'
  });

  return (
    <nav className="navbar">
      {/* Brand */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{ position: 'relative', display: 'flex' }}>
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <MapPin size={28} color="var(--secondary-orange)" fill="rgba(249,115,22,0.15)" />
          </motion.div>
          <span style={{
            position: 'absolute', top: 0, left: 0, width: '28px', height: '28px',
            borderRadius: '50%',
            background: 'rgba(249,115,22,0.25)',
            animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite'
          }} />
        </div>
        <span style={{
          fontSize: '1.4rem', fontWeight: '800',
          background: 'linear-gradient(135deg, var(--primary-purple), var(--secondary-orange))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
        }}>
          LocaMinder
        </span>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link to="/" style={navLinkStyle('/')}>
          <Home size={16} /> Home
        </Link>

        {user ? (
          <>
            <Link to="/dashboard" style={navLinkStyle('/dashboard')}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleLogout}
              className="btn"
              style={{
                background: 'rgba(239,68,68,0.08)',
                color: '#EF4444',
                padding: '0.45rem 1rem',
                fontSize: '0.9rem',
                display: 'flex', gap: '0.4rem',
                marginLeft: '0.25rem',
                border: '1px solid rgba(239,68,68,0.2)'
              }}
            >
              <LogOut size={16} /> Logout
            </motion.button>
          </>
        ) : (
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/login"
              className="btn btn-primary"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', display: 'flex', gap: '0.4rem' }}
            >
              Sign In
            </Link>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
