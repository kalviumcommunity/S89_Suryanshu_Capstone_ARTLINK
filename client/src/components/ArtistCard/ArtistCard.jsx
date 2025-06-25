import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useArtistContext } from '../../context/ArtistContext';
import './ArtistCard.css';

const ArtistCard = ({ artist }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toggleFollow } = useArtistContext();

  const handleFollow = () => {
    if (!user) {
      alert('Please log in first');
      navigate('/login');
      return;
    }
    toggleFollow(artist.id, artist.isFollowing);
  };

  return (
    <div className="artist-card">
      <div className="artist-image">
        <img src={artist.profileImage || '/default-profile.jpg'} alt={artist.name} />
      </div>
      <div className="artist-info">
        <h3>{artist.name}</h3>
        <p className="artist-category">{artist.category}</p>
        <p className="artist-stats">
          <span>{artist.followers} followers</span>
          <span>•</span>
          <span>{artist.artworks} artworks</span>
        </p>
        <button 
          className={`follow-button ${artist.isFollowing ? 'following' : ''}`}
          onClick={handleFollow}
        >
          {artist.isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  );
};

export default ArtistCard;
