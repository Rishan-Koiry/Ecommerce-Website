import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import './Admin.css';

const Admin = () => {
  const { user, isAdmin, getAllUsers, updateUser, makeAdmin, removeAdmin } = useAuth();
  const { products, categories, brands, addProduct, updateProduct, deleteProduct } = useProducts();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    originalPrice: '',
    description: '',
    shortDescription: '',
    images: '',
    inStock: true
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    setUsers(getAllUsers());
  }, [isAdmin, navigate, getAllUsers]);

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleSaveUser = () => {
    if (editingUser) {
      updateUser(editingUser.id, {
        name: editingUser.name,
        email: editingUser.email,
        profilePicture: editingUser.profilePicture
      });
      setUsers(getAllUsers());
      setEditingUser(null);
    }
  };

  const handleToggleAdmin = (userId, currentRole) => {
    if (currentRole === 'admin') {
      removeAdmin(userId);
    } else {
      makeAdmin(userId);
    }
    setUsers(getAllUsers());
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
    setProductForm({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice || '',
      description: product.description,
      shortDescription: product.shortDescription,
      images: product.images.join('\n'),
      inStock: product.inStock
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  const handleProductFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: '',
      brand: '',
      price: '',
      originalPrice: '',
      description: '',
      shortDescription: '',
      images: '',
      inStock: true
    });
    setShowProductForm(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const images = productForm.images.split('\n').filter(url => url.trim());
    
    const productData = {
      name: productForm.name,
      category: productForm.category,
      brand: productForm.brand,
      price: parseFloat(productForm.price),
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
      description: productForm.description,
      shortDescription: productForm.shortDescription,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800'],
      inStock: productForm.inStock
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    
    setShowProductForm(false);
    setEditingProduct(null);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        
        <div className="admin-tabs">
          <button 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Users ({users.length})
          </button>
          <button 
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            Products ({products.length})
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="admin-section">
            <h2>User Management</h2>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>
                        <img 
                          src={u.profilePicture} 
                          alt={u.name}
                          className="user-avatar"
                        />
                      </td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role}`}>
                          {u.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleEditUser(u)}
                            className="btn-edit"
                          >
                            Edit
                          </button>
                          {u.email !== 'koiryrishan1@gmail.com' && (
                            <button
                              onClick={() => handleToggleAdmin(u.id, u.role)}
                              className={u.role === 'admin' ? 'btn-remove-admin' : 'btn-make-admin'}
                            >
                              {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {editingUser && (
              <div className="edit-user-modal">
                <div className="modal-content">
                  <h3>Edit User</h3>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Profile Picture URL</label>
                    <input
                      type="url"
                      value={editingUser.profilePicture}
                      onChange={(e) => setEditingUser({ ...editingUser, profilePicture: e.target.value })}
                    />
                  </div>
                  <div className="modal-actions">
                    <button onClick={handleSaveUser} className="btn-save">Save</button>
                    <button onClick={() => setEditingUser(null)} className="btn-cancel">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Product Management</h2>
              <button onClick={handleAddProduct} className="btn-add">Add Product</button>
            </div>

            {showProductForm && (
              <div className="product-form-modal">
                <div className="modal-content">
                  <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                  <form onSubmit={handleSaveProduct}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Product Name</label>
                        <input
                          type="text"
                          name="name"
                          value={productForm.name}
                          onChange={handleProductFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <select
                          name="category"
                          value={productForm.category}
                          onChange={handleProductFormChange}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Brand</label>
                        <input
                          type="text"
                          name="brand"
                          value={productForm.brand}
                          onChange={handleProductFormChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Price ($)</label>
                        <input
                          type="number"
                          name="price"
                          value={productForm.price}
                          onChange={handleProductFormChange}
                          step="0.01"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Original Price ($)</label>
                        <input
                          type="number"
                          name="originalPrice"
                          value={productForm.originalPrice}
                          onChange={handleProductFormChange}
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Short Description</label>
                      <input
                        type="text"
                        name="shortDescription"
                        value={productForm.shortDescription}
                        onChange={handleProductFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={productForm.description}
                        onChange={handleProductFormChange}
                        rows="4"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Image URLs (one per line)</label>
                      <textarea
                        name="images"
                        value={productForm.images}
                        onChange={handleProductFormChange}
                        rows="3"
                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          name="inStock"
                          checked={productForm.inStock}
                          onChange={handleProductFormChange}
                        />
                        In Stock
                      </label>
                    </div>
                    <div className="modal-actions">
                      <button type="submit" className="btn-save">Save</button>
                      <button 
                        type="button"
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingProduct(null);
                        }} 
                        className="btn-cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="product-thumb"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td>${product.price}</td>
                      <td>
                        <span className={product.inStock ? 'in-stock' : 'out-of-stock'}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="btn-edit"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="btn-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
