import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaUser, FaSearch, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { allArtworks } from '../../data/artworks';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = allArtworks.filter(
      (art) =>
        art.title.toLowerCase().includes(query) ||
        art.artist.toLowerCase().includes(query) ||
        art.category.toLowerCase().includes(query)
    );
    setSearchResults(results);
    setShowResults(true);
  };

  const handleResultClick = (id) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(`/artwork/${id}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          <span className="logo-text">Art<span className="logo-highlight">Link</span></span>
        </Link>
      </div>

      <div className="navbar-center">
        <form className="search-form classy-search-form" onSubmit={handleSearch} autoComplete="off">
          <div className="search-container classy-search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search artists, artworks, categories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value) handleClearSearch();
              }}
              className="search-input classy-search-input"
            />
            {searchQuery && (
              <button type="button" className="clear-search-btn" onClick={handleClearSearch}>
                <FaTimes />
              </button>
            )}
            {showResults && searchResults.length > 0 && (
              <div className="search-results-dropdown">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="search-result-item"
                    onClick={() => handleResultClick(result.id)}
                  >
                    <img src={result.image} alt={result.title} className="search-result-thumb" />
                    <div>
                      <div className="search-result-title">{result.title}</div>
                      <div className="search-result-artist">by {result.artist}</div>
                      <div className="search-result-category">{result.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="navbar-right">
        <div className="nav-icons">
          <Link to="/" className="nav-icon">
            <FaHome />
          </Link>
          <Link to="/profile" className="nav-icon">
            <FaUser />
          </Link>
          <Link to="/cart" className="nav-icon">
            <FaShoppingCart />
          </Link>
          <Link to="/ai-assistant" className="nav-icon artlink-bot-btn">
            🤖 Artlink Bot
          </Link>
        </div>
        <div className="auth-buttons">
          {user ? (
            <div className="profile-inline">
              <span className="profile-name">{user.name || user.email || 'Profile'}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="login-btn">Log in</Link>
              <Link to="/signup" className="signup-btn">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
