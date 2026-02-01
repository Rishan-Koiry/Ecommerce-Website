import { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts, categories, brands } from '../data/products';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If saved products are less than initial products, use initial products
        if (parsed.length < initialProducts.length) {
          return initialProducts;
        }
        return parsed;
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      ...productData,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      rating: productData.rating || 4.5,
      reviews: productData.reviews || 0
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (productId, updates) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, ...updates } : p
    ));
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const getProductById = (id) => {
    return products.find(p => p.id === parseInt(id));
  };

  const getCategories = () => {
    return [...new Set(products.map(p => p.category))];
  };

  const getBrands = () => {
    return [...new Set(products.map(p => p.brand))];
  };

  const value = {
    products,
    categories: getCategories(),
    brands: getBrands(),
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
