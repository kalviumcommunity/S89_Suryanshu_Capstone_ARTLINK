import { useState } from 'react';
import { useCart } from '../context/CartContext';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import { allArtworks } from '../data/artworks';
import '../styles/HomePage.css';

const MarketplacePage = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sort, setSort] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
  const { addToCart } = useCart();

  const handleFilterChange = ({ selectedCategories }) => {
    setSelectedCategories(selectedCategories || []);
  };

  const handleSortChange = (sortType) => {
    setSort(sortType);
  };

  // Apply both filter and sort every render
  const getFilteredAndSortedArtworks = () => {
    let filtered = allArtworks.filter(art =>
      selectedCategories.length === 0 || selectedCategories.includes(art.category)
    );
    if (sort === 'low-high') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sort === 'high-low') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  };

  const filteredArtworks = getFilteredAndSortedArtworks();

  const handleAddToCart = (art) => {
    addToCart(art);
    setPopupProduct(art);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500);
  };

  return (
    <div className="container" style={{ display: 'flex', gap: '2rem', padding: '2rem 0' }}>
      <FilterSidebar onFilterChange={handleFilterChange} onSortChange={handleSortChange} />
      <div style={{ flex: 1 }}>
        <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Trending in the Marketplace</h1>
        <div className="trending-grid">
          {filteredArtworks.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888' }}>No products found.</div>
          ) : (
            filteredArtworks.map((art, idx) => (
              <div key={art.id} className="artwork-card">
                <div className="artwork-image" style={{ height: 180, borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
                  <img src={art.image} alt={art.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3>{art.title}</h3>
                <p>by {art.artist}</p>
                <span className="price">${art.price}</span>
                <span className="category-label">{art.category}</span>
                <button className="follow-button" style={{ marginTop: 10 }} onClick={() => handleAddToCart(art)}>
                  Add to Cart
                </button>
              </div>
            ))
          )}
        </div>
        {showPopup && popupProduct && (
          <div className="cart-popup">
            <span>"{popupProduct.title}" added to cart!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
