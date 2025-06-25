import React, { createContext, useContext, useState, useEffect } from 'react';

const ArtistContext = createContext();

export const useArtistContext = () => useContext(ArtistContext);

const defaultArtists = [
  {
    id: 1,
    name: 'Kate David',
    category: 'Digital Artist',
    followers: 1200,
    artworks: 34,
    profileImage: 'https://i.pravatar.cc/150?img=47',
    isFollowing: false,
  },
  {
    id: 2,
    name: 'James Wise',
    category: 'Painter',
    followers: 980,
    artworks: 21,
    profileImage: 'https://i.pravatar.cc/150?img=12',
    isFollowing: false,
  },
  {
    id: 3,
    name: 'Maria Rodriguez',
    category: 'Sculptor',
    followers: 800,
    artworks: 15,
    profileImage: 'https://i.pravatar.cc/150?img=65',
    isFollowing: false,
  },
  {
    id: 4,
    name: 'Adam Johnson',
    category: 'Photographer',
    followers: 1500,
    artworks: 40,
    profileImage: 'https://i.pravatar.cc/150?img=33',
    isFollowing: false,
  },
  {
    id: 5,
    name: 'Alice Rivera',
    category: 'Illustrator',
    followers: 1100,
    artworks: 28,
    profileImage: 'https://i.pravatar.cc/150?img=49',
    isFollowing: false,
  },
  {
    id: 6,
    name: 'Sana Chow',
    category: 'Painter',
    followers: 900,
    artworks: 19,
    profileImage: 'https://i.pravatar.cc/150?img=21',
    isFollowing: false,
  },
  {
    id: 7,
    name: 'Julie Bryant',
    category: 'Digital Artist',
    followers: 1300,
    artworks: 36,
    profileImage: 'https://i.pravatar.cc/150?img=38',
    isFollowing: false,
  },
  {
    id: 8,
    name: 'Marcus Green',
    category: 'Sculptor',
    followers: 700,
    artworks: 12,
    profileImage: 'https://i.pravatar.cc/150?img=55',
    isFollowing: false,
  },
];

export const ArtistProvider = ({ children }) => {
  const [artists, setArtists] = useState(() => {
    const stored = localStorage.getItem('artists');
    if (stored) {
      // If any artist is missing a profileImage, reset all to default
      try {
        const parsed = JSON.parse(stored);
        if (
          Array.isArray(parsed) &&
          parsed.every((a) => a.profileImage)
        ) {
          return parsed;
        }
      } catch (e) {}
    }
    localStorage.setItem('artists', JSON.stringify(defaultArtists));
    return defaultArtists;
  });

  useEffect(() => {
    localStorage.setItem('artists', JSON.stringify(artists));
  }, [artists]);

  const initializeArtists = (artistList) => {
    setArtists(artistList);
  };

  const toggleFollow = (artistId, isFollowing) => {
    setArtists((prevArtists) =>
      prevArtists.map((artist) =>
        artist.id === artistId
          ? {
              ...artist,
              followers: isFollowing
                ? artist.followers - 1
                : artist.followers + 1,
              isFollowing: !isFollowing,
            }
          : artist
      )
    );
  };

  return (
    <ArtistContext.Provider value={{ artists, initializeArtists, toggleFollow }}>
      {children}
    </ArtistContext.Provider>
  );
};
