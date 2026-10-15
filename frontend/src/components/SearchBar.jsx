import React from 'react';

const SearchBar = ({ search, setSearch, category, setCategory, sort, setSort }) => {
  return (
    <div style={styles.container}>
      {/* Search Text Input */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
      />

      {/* Category Filter Dropdown */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={styles.selectInput}
      >
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
        <option value="Books">Books</option>
        <option value="Home">Home</option>
        <option value="Sports">Sports</option>
      </select>

      {/* Sort Dropdown (Bonus Challenge) */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        style={styles.selectInput}
      >
        <option value="">Sort by</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: '1',
    minWidth: '240px',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #03152b',
    fontSize: '0.95rem',
    outline: 'none',
  },
  selectInput: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem',
    backgroundColor: '#ffe6e600',
    outline: 'none',
    cursor: 'pointer',
  },
};

export default SearchBar;