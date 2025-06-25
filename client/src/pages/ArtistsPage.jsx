import React, { useEffect } from 'react';
import ArtistCard from '../components/ArtistCard/ArtistCard';
import { useArtistContext } from '../context/ArtistContext';
import '../styles/HomePage.css';

const initialArtists = [
  { id: 1, name: 'Kate David', category: 'Digital Artist', followers: 1200, artworks: 34, profileImage: 'https://i.pravatar.cc/150?img=47', isFollowing: false },
  { id: 2, name: 'James Wise', category: 'Painter', followers: 980, artworks: 21, profileImage: 'https://i.pravatar.cc/150?img=12', isFollowing: false },
  { id: 3, name: 'Maria Rodriguez', category: 'Sculptor', followers: 800, artworks: 15, profileImage: 'https://i.pravatar.cc/150?img=65', isFollowing: false },
  { id: 4, name: 'Adam Johnson', category: 'Photographer', followers: 1500, artworks: 40, profileImage: 'https://i.pravatar.cc/150?img=33', isFollowing: false },
  { id: 5, name: 'Alice Rivera', category: 'Illustrator', followers: 1100, artworks: 28, profileImage: 'https://i.pravatar.cc/150?img=49', isFollowing: false },
  { id: 6, name: 'Sana Chow', category: 'Painter', followers: 900, artworks: 19, profileImage: 'https://i.pravatar.cc/150?img=21', isFollowing: false },
  { id: 7, name: 'Julie Bryant', category: 'Digital Artist', followers: 1300, artworks: 36, profileImage: 'https://i.pravatar.cc/150?img=38', isFollowing: false },
  { id: 8, name: 'Marcus Green', category: 'Sculptor', followers: 700, artworks: 12, profileImage: 'https://i.pravatar.cc/150?img=55', isFollowing: false },
];

const ArtistsPage = () => {
  const { artists, initializeArtists } = useArtistContext();

  useEffect(() => {
    if (artists.length === 0) {
      initializeArtists(initialArtists);
    }
  }, [artists, initializeArtists]);

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>All Artists</h1>
      <div className="artists-grid">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
};

export default ArtistsPage;
