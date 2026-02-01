import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated, isAdmin, updateUser } = useAuth();
  const { getCartItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editProfilePicture, setEditProfilePicture] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditProfilePicture(user.profilePicture || '');
      setImagePreview(user.profilePicture || '');
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditName(user.name);
    setEditProfilePicture(user.profilePicture);
    setImagePreview(user.profilePicture);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName(user.name);
    setEditProfilePicture(user.profilePicture);
    setImagePreview(user.profilePicture);
  };

  const handleSaveProfile = () => {
    updateUser(user.id, {
      name: editName,
      profilePicture: editProfilePicture || imagePreview
    });
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setEditProfilePicture(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setEditProfilePicture(url);
    if (url) {
      setImagePreview(url);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="profile-section">
            <div className="profile-picture-wrapper">
              <img 
                src={imagePreview || user.profilePicture} 
                alt={user.name}
                className="profile-picture"
              />
              {isEditing && (
              <label className="upload-overlay">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Upload
              </label>
              )}
            </div>
            <div className="profile-info">
              {isEditing ? (
                <div className="edit-profile-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="edit-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Profile Picture URL</label>
                    <input
                      type="url"
                      value={editProfilePicture}
                      onChange={handleUrlChange}
                      placeholder="Or upload image above"
                      className="edit-input"
                    />
                  </div>
                  <div className="edit-actions">
                    <button onClick={handleSaveProfile} className="btn-save-profile">
                      Save Changes
                    </button>
                    <button onClick={handleCancelEdit} className="btn-cancel-profile">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1>Welcome, {user.name}!</h1>
                  <p className="user-email">{user.email}</p>
                  <div className="badge-container">
                    <span className={`user-badge ${isAdmin ? 'admin' : 'user'}`}>
                      {isAdmin ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                          </svg>
                          Admin
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          User
                        </>
                      )}
                    </span>
                  </div>
                  <button onClick={handleEditClick} className="btn-edit-profile">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <div className="stat-info">
              <h3>Cart Items</h3>
              <p className="stat-value">{getCartItemsCount()}</p>
            </div>
            <Link to="/cart" className="stat-link">View Cart →</Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <div className="stat-info">
              <h3>Wishlist</h3>
              <p className="stat-value">{wishlistCount}</p>
            </div>
            <Link to="/wishlist" className="stat-link">View Wishlist →</Link>
          </div>

          {isAdmin && (
            <div className="stat-card admin-card">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
                </svg>
              </div>
              <div className="stat-info">
                <h3>Admin Panel</h3>
                <p className="stat-value">Manage</p>
              </div>
              <Link to="/admin" className="stat-link">Go to Admin →</Link>
            </div>
          )}
        </div>

        <div className="dashboard-actions">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <Link to="/products" className="action-card">
              <div className="action-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <h3>Browse Products</h3>
              <p>Explore our collection</p>
            </Link>

            <Link to="/cart" className="action-card">
              <div className="action-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h3>My Cart</h3>
              <p>View your cart items</p>
            </Link>

            <Link to="/wishlist" className="action-card">
              <div className="action-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3>My Wishlist</h3>
              <p>Your saved items</p>
            </Link>

            {isAdmin && (
              <Link to="/admin" className="action-card admin-action">
                <div className="action-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h3>Admin Panel</h3>
                <p>Manage users & products</p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
