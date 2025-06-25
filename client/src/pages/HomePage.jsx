import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useArtistContext } from '../context/ArtistContext';
import Navbar from '../components/Navbar/Navbar';
import { allArtworks } from '../data/artworks';
import '../styles/HomePage.css';
import '../styles/AiAssistantHomeArt.css';

const initialArtists = [
  { id: 1, name: 'Kate David', category: 'Digital Artist', followers: 1200, artworks: 34, profileImage: 'https://i.pravatar.cc/150?img=47', isFollowing: false },
  { id: 2, name: 'James Wise', category: 'Painter', followers: 980, artworks: 21, profileImage: 'https://i.pravatar.cc/150?img=12', isFollowing: false },
  { id: 3, name: 'Maria Rodriguez', category: 'Sculptor', followers: 800, artworks: 15, profileImage: 'https://i.pravatar.cc/150?img=65', isFollowing: false },
  { id: 4, name: 'Adam Johnson', category: 'Photographer', followers: 1500, artworks: 40, profileImage: 'https://i.pravatar.cc/150?img=33', isFollowing: false },
];

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { artists, initializeArtists, toggleFollow } = useArtistContext();

  useEffect(() => {
    if (artists.length === 0) {
      initializeArtists(initialArtists);
    }
  }, [artists, initializeArtists]);

  const handleFollow = (artist) => {
    if (!user) {
      alert('Please log in first');
      navigate('/login');
      return;
    }
    toggleFollow(artist.id, artist.isFollowing);
  };

  return (
    <div className="homepage">
      <Navbar />
      {/* Hero Section */}
      <section className="hero-section hero-art-section">
        <div className="hero-content">
          <h1>Discover, Connect & Create<br />with Fellow Artists</h1>
          <p className="hero-sub">Join the growing community of artists, sell your work, find collaborators, and take your career to next level</p>
          <div className="hero-btn-row">
            {!user && (
              <>
                <Link to="/register" className="hero-welcome-btn hero-get-started">Get Started Free</Link>
                <Link to="/marketplace" className="hero-welcome-btn hero-marketplace">Explore Art Marketplace</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-art-images">
          <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" alt="Paint Brushes" className="hero-art-img" />
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Wood Carving" className="hero-art-img" />
          <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80" alt="Singing" className="hero-art-img" />
          <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80" alt="Guitar" className="hero-art-img" />
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="featured-artists">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Featured Artists</h2>
          <Link to="/artists" className="see-artists-btn">See Artists</Link>
        </div>
        <div className="artists-grid">
          {artists.slice(0, 4).map((artist) => (
            <div key={artist.id} className="artist-card">
              <div className="artist-avatar">
                <img src={artist.profileImage || '/default-profile.jpg'} alt={artist.name} />
              </div>
              <h3>{artist.name}</h3>
              <p>{artist.category}</p>
              <p className="artist-stats">
                <span>{artist.followers} followers</span>
                <span>•</span>
                <span>{artist.artworks} artworks</span>
              </p>
              <button className={`follow-button${artist.isFollowing ? ' following' : ''}`} onClick={() => handleFollow(artist)}>
                {artist.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="trending">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Trending in the Marketplace</h2>
          <Link to="/marketplace" className="visit-marketplace-btn">Visit Marketplace</Link>
        </div>
        <div className="trending-grid">
          {allArtworks.slice(0, 4).map((art) => (
            <div key={art.id} className="artwork-card">
              <div className="artwork-image" style={{ height: 180, borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
                <img src={art.image} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3>{art.title}</h3>
              <p>by {art.artist}</p>
              <span className="price">${art.price}</span>
            </div>
          ))}
        </div>
      </section>

      {/* AI Artlink Bot Section */}
      <section className="ai-assistant-art">
        <div className="ai-art-illustration">
          {/* Artistic AI/Art SVG illustration */}
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#a18fff" fillOpacity="0.18"/>
            <ellipse cx="32" cy="32" rx="20" ry="18" fill="#fff" fillOpacity="0.8"/>
            <path d="M24 36c0-4 4-8 8-8s8 4 8 8" stroke="#4f3ce7" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="26.5" cy="30.5" r="2.5" fill="#4f3ce7"/>
            <circle cx="37.5" cy="30.5" r="2.5" fill="#4f3ce7"/>
            <ellipse cx="32" cy="41" rx="5" ry="2" fill="#a18fff" fillOpacity="0.5"/>
          </svg>
        </div>
        <h2>Meet Your Artlink Bot</h2>
        <p>Let your creativity flow! Get instant art advice, creative prompts, and AI-powered inspiration. Your personal art assistant is here to help you brainstorm, learn, and create like never before.</p>
        <Link to="/ai-assistant" className="try-assistant-button">Try Artlink Bot</Link>
      </section>

      {/* Join Community Section */}
      <section className="join-community">
        <h2>Ready to Join the Art Community?</h2>
        <div className="cta-buttons" style={{ justifyContent: user ? 'center' : 'center' }}>
          {!user && (
            <Link to="/register" className="cta-button primary">Create Account</Link>
          )}
          <Link to="/about" className="cta-button secondary" style={user ? {margin: '0 auto'} : {}}>Learn More</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
