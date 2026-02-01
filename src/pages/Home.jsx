import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const { products, categories } = useProducts();
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to RK</h1>
          <p>Discover amazing products at unbeatable prices</p>
          <Link to="/products" className="cta-button">Shop Now</Link>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className="category-card"
              >
                <div className="category-icon">
                  {category === 'Mobile' && (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                      <line x1="12" y1="18" x2="12.01" y2="18"></line>
                    </svg>
                  )}
                  {category === 'Dresses' && (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M12 2l-4 4M12 2l4 4M12 22l-4-4M12 22l4-4"></path>
                    </svg>
                  )}
                  {category === 'Men' && (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                  {category === 'Women' && (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                  {category === 'Laptops' && (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="12" rx="2" ry="2"></rect>
                      <line x1="2" y1="16" x2="22" y2="16"></line>
                      <line x1="6" y1="20" x2="18" y2="20"></line>
                    </svg>
                  )}
                </div>
                <h3>{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="view-all">
            <Link to="/products" className="view-all-button">View All Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
