import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';
import { useState, useEffect, useRef } from 'react';
import './Header.css';

const Header = () => {
  const { getCartItemsCount } = useCart();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { wishlistCount } = useWishlist();
  const { products } = useProducts();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    // Special handling for /products to not match /product/:id
    if (path === '/products') {
      return location.pathname === '/products' || location.pathname.startsWith('/products?');
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = products
        .filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      setSearchSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product.id}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>RK</h1>
        </Link>

        <div className="search-wrapper" ref={searchRef}>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </form>

          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="search-suggestions" ref={suggestionsRef}>
              {searchSuggestions.map(product => (
                <div
                  key={product.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(product)}
                >
                  <img src={product.images[0]} alt={product.name} />
                  <div className="suggestion-info">
                    <h4>{product.name}</h4>
                    <p>{product.brand} • ${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <nav className="nav">
          <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>Products</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
              {isAdmin && (
                <Link to="/admin" className={`nav-link admin-link ${isActive('/admin') ? 'active' : ''}`}>Admin</Link>
              )}
              <Link to="/wishlist" className={`nav-link wishlist-link ${isActive('/wishlist') ? 'active' : ''}`}>
                Wishlist
                {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
              </Link>
              <Link to="/cart" className={`nav-link cart-link ${isActive('/cart') ? 'active' : ''}`}>
                Cart
                {getCartItemsCount() > 0 && <span className="badge">{getCartItemsCount()}</span>}
              </Link>
              <div className="user-menu">
                <Link to="/dashboard" className="user-info">
                  <img 
                    src={user?.profilePicture} 
                    alt={user?.name}
                    className="user-avatar-small"
                  />
                  <span className="user-name">{user?.name}</span>
                  <span className={`user-role-badge ${isAdmin ? 'admin' : 'user'}`}>
                    {isAdmin ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    )}
                  </span>
                </Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>Login</Link>
              <Link to="/signup" className={`nav-link ${isActive('/signup') ? 'active' : ''}`}>Sign Up</Link>
              <Link to="/cart" className={`nav-link cart-link ${isActive('/cart') ? 'active' : ''}`}>
                Cart
                {getCartItemsCount() > 0 && <span className="badge">{getCartItemsCount()}</span>}
              </Link>
            </>
          )}
        </nav>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link 
            to="/products" 
            className={isActive('/products') ? 'active' : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Products
          </Link>
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className={isActive('/dashboard') ? 'active' : ''}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className={isActive('/admin') ? 'active' : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <Link 
                to="/wishlist" 
                className={isActive('/wishlist') ? 'active' : ''}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
              <Link 
                to="/cart" 
                className={isActive('/cart') ? 'active' : ''}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cart {getCartItemsCount() > 0 && `(${getCartItemsCount()})`}
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={isActive('/login') ? 'active' : ''}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className={isActive('/signup') ? 'active' : ''}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
