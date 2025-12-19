import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { contentAPI } from '../api';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [siteTitle, setSiteTitle] = useState('E-Content');
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await contentAPI.get();
        if (res.success && res.data?.branding?.title) {
          setSiteTitle(res.data.branding.title);
        }
      } catch (e) {
        console.error('Branding fetch error:', e);
      }
    };
    fetchBranding();
  }, []);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
      closeMenu();
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/videos', label: 'Videos' },
    { path: '/materials', label: 'Materials' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container container">
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <span className="logo-icon">🎓</span>
            <span className="logo-text">{siteTitle}</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search videos, materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Desktop Menu */}
          <ul className="navbar-menu desktop-menu">
            {navLinks.map((link) => (
              <li key={link.path} className="navbar-item">
                <NavLink
                  to={link.path}
                  className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="navbar-item navbar-item-cta">
              <Link to="/admin" className="btn btn-accent">
                Admin
              </Link>
            </li>
          </ul>

          <div className="navbar-actions">
            {/* Search Toggle - Mobile */}
            <button
              className="navbar-action-btn search-toggle"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Toggle search"
            >
              🔍
            </button>

            {/* Theme Toggle */}
            <button
              className="navbar-action-btn theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className={`navbar-toggle ${isOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle navigation"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          {/* Mobile Search */}
          {showSearch && (
            <form className="navbar-search-mobile" onSubmit={handleSearch}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="button" className="close-search" onClick={() => setShowSearch(false)}>✕</button>
            </form>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay - Rendered outside navbar */}
      {isOpen && (
        <div
          className="mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            paddingTop: '70px',
          }}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeMenu}
              style={{
                display: 'block',
                padding: '18px 24px',
                fontSize: '1.2rem',
                fontWeight: '500',
                color: isDark ? '#ffffff' : '#1a1a1a',
                textDecoration: 'none',
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                textAlign: 'center',
              }}
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/admin"
            onClick={closeMenu}
            style={{
              display: 'block',
              padding: '18px 24px',
              margin: '16px 20px',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#1a1a1a',
              textDecoration: 'none',
              textAlign: 'center',
              backgroundColor: '#c9a962',
              borderRadius: '8px',
            }}
          >
            Admin
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
