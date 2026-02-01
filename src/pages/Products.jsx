import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import './Products.css';

const Products = () => {
  const { products, categories, brands } = useProducts();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    if (category) setSelectedCategory(category);
    if (search) setSearchQuery(search);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== 'All') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Price range filter
    filtered = filtered.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [selectedCategory, selectedBrand, priceRange, sortBy, searchQuery]);

  const maxPrice = Math.max(...products.map(p => p.price));

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="products-page">
      <div className="products-container">
        <aside className="filters-sidebar">
          <h2>Filters</h2>

          <div className="filter-section">
            <h3>Category</h3>
            <div className="filter-options">
              <label>
                <input
                  type="radio"
                  name="category"
                  value="All"
                  checked={selectedCategory === 'All'}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
                All Categories
              </label>
              {categories.map(category => (
                <label key={category}>
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Brand</h3>
            <div className="filter-options">
              <label>
                <input
                  type="radio"
                  name="brand"
                  value="All"
                  checked={selectedBrand === 'All'}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                />
                All Brands
              </label>
              {brands.map(brand => (
                <label key={brand}>
                  <input
                    type="radio"
                    name="brand"
                    value={brand}
                    checked={selectedBrand === brand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-range">
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="price-slider"
              />
              <div className="price-values">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          <button
            className="clear-filters"
            onClick={() => {
              setSelectedCategory('All');
              setSelectedBrand('All');
              setPriceRange([0, maxPrice]);
              setSortBy('default');
              setSearchQuery('');
            }}
          >
            Clear All Filters
          </button>
        </aside>

        <main className="products-main">
          <div className="products-header">
            <h1>
              {selectedCategory !== 'All' ? selectedCategory : 'All Products'}
              {searchQuery && ` - Search: "${searchQuery}"`}
            </h1>
            <div className="products-controls">
              <span>{filteredProducts.length} products found</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
