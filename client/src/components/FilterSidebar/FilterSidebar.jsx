import { useState } from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ onFilterChange, onSortChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sort, setSort] = useState('');

  const categories = [
    'Digital Art',
    'Paintings',
    'Photography',
    'Sculptures',
    'Prints',
    'Other'
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }
      return [...prev, category];
    });
    onFilterChange({ selectedCategories: selectedCategories.includes(category) ? selectedCategories.filter(c => c !== category) : [...selectedCategories, category] });
  };

  const handleRemoveFilters = () => {
    setSelectedCategories([]);
    onFilterChange({ selectedCategories: [] });
    setSort('');
    onSortChange('');
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    onSortChange(e.target.value);
  };

  return (
    <aside className="filter-sidebar">
      <div className="filter-section">
        <h3>Filters</h3>
        <div className="sort-dropdown">
          <label htmlFor="sort">Sort by:</label>
          <select id="sort" value={sort} onChange={handleSortChange} className="sort-select">
            <option value="">Default</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
        <div className="categories">
          <h4>Categories</h4>
          {categories.map(category => (
            <label key={category} className="category-checkbox">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              {category}
            </label>
          ))}
        </div>
        <button className="remove-filters" onClick={handleRemoveFilters} style={{ marginTop: '0.5rem', background: '#eee', color: '#333' }}>
          Remove Filters
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
