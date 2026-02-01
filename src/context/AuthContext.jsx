import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    const existingUsers = saved ? JSON.parse(saved) : [];
    
    // Initialize admin user if not exists
    const adminEmail = 'koiryrishan1@gmail.com';
    const adminExists = existingUsers.find(u => u.email === adminEmail);
    
    if (!adminExists) {
      const adminUser = {
        id: 1,
        email: adminEmail,
        password: 'rk2025',
        name: 'Admin',
        role: 'admin',
        profilePicture: 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff',
        createdAt: new Date().toISOString()
      };
      return [adminUser, ...existingUsers];
    }
    
    // Ensure admin user has admin role
    return existingUsers.map(u => 
      u.email === adminEmail ? { ...u, role: 'admin' } : u
    );
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const login = async (email, password) => {
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    
    if (!existingUser) {
      throw new Error('User not found. Please sign up first.');
    }

    // Simple password check (in real app, use hashing)
    if (existingUser.password !== password) {
      throw new Error('Invalid password');
    }

    const loggedInUser = {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      role: existingUser.role || 'user',
      profilePicture: existingUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(existingUser.name)}&background=6366f1&color=fff`,
      token: 'token-' + Date.now()
    };
    
    setUser(loggedInUser);
    return Promise.resolve(loggedInUser);
  };

  const signup = async (email, password, name) => {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      email,
      password, // In real app, hash this
      name,
      role: 'user',
      profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    
    const loggedInUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      profilePicture: newUser.profilePicture,
      token: 'token-' + Date.now()
    };
    
    setUser(loggedInUser);
    return Promise.resolve(loggedInUser);
  };

  const logout = () => {
    setUser(null);
  };

  const getAllUsers = () => {
    return users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role || 'user',
      profilePicture: u.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=6366f1&color=fff`,
      createdAt: u.createdAt
    }));
  };

  const updateUser = (userId, updates) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, ...updates } : u
    ));
    
    // Update current user if it's the logged in user
    if (user && user.id === userId) {
      setUser(prev => ({ ...prev, ...updates }));
    }
  };

  const makeAdmin = (userId) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: 'admin' } : u
    ));
    
    // Update current user if it's the logged in user
    if (user && user.id === userId) {
      setUser(prev => ({ ...prev, role: 'admin' }));
    }
  };

  const removeAdmin = (userId) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: 'user' } : u
    ));
    
    // Update current user if it's the logged in user
    if (user && user.id === userId) {
      setUser(prev => ({ ...prev, role: 'user' }));
    }
  };

  const value = {
    user,
    users,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    getAllUsers,
    updateUser,
    makeAdmin,
    removeAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
