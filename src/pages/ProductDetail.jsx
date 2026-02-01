import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Loading from '../components/Loading';
import './ProductDetail.css';

const ProductDetail = () => {
  const { getProductById } = useProducts();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const foundProduct = getProductById(id);
    if (foundProduct) {
      setProduct(foundProduct);
      setIsLoading(false);
    } else {
      navigate('/products');
    }
  }, [id, navigate, getProductById]);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (isLoading || !product) {
    return <Loading />;
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <div className="product-images">
          <div className="main-image">
            <img src={product.images[selectedImage]} alt={product.name} />
            {discount > 0 && (
              <span className="discount-badge">-{discount}%</span>
            )}
          </div>
          <div className="thumbnail-images">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`${product.name} view ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info-detail">
          <div className="product-header">
            <span className="product-brand">{product.brand}</span>
            <button
              className={`wishlist-btn-detail ${isInWishlist(product.id) ? 'active' : ''}`}
              onClick={handleWishlistToggle}
              aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          <h1>{product.name}</h1>

          <div className="product-rating-detail">
            <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
            <span className="rating-text">({product.rating})</span>
            <span className="reviews">({product.reviews} reviews)</span>
          </div>

          <div className="product-price-detail">
            <span className="current-price">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">${product.originalPrice}</span>
            )}
          </div>

          <p className="product-description-full">{product.description}</p>

          <div className="product-actions">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            <button
              className={`add-to-cart-btn-detail ${isAdding ? 'adding' : ''}`}
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {isAdding ? 'Added to Cart!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <strong>Category:</strong> {product.category}
            </div>
            <div className="meta-item">
              <strong>Brand:</strong> {product.brand}
            </div>
            <div className="meta-item">
              <strong>Availability:</strong>{' '}
              <span className={product.inStock ? 'in-stock' : 'out-of-stock'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
