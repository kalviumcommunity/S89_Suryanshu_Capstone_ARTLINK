import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up axios defaults
  axios.defaults.baseURL = 'http://localhost:5000';

  // Set token in axios headers when it changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // You would typically have an endpoint to get user data using the token
        // For now, we'll just decode the token to get the user ID
        const userId = JSON.parse(atob(token.split('.')[1])).id;

        // In a real app, you would fetch user data from an endpoint
        setUser({ id: userId });
        setLoading(false);
      } catch (err) {
        console.error('Error loading user:', err);
        setToken(null);
        setUser(null);
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post('/api/auth/register', userData);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  // Login with email and password or Google token
  const login = async (email, password, token = null, userData = null) => {
    setLoading(true);
    setError(null);

    try {
      // If token and userData are provided, it's a Google login
      if (token && userData) {
        setToken(token);
        setUser(userData);
        setLoading(false);
        return { token, user: userData };
      }

      // Otherwise, it's a regular email/password login
      const res = await axios.post('/api/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  // Handle Google OAuth success
  const handleGoogleSuccess = (tokenFromUrl, userId) => {
    setToken(tokenFromUrl);
    setUser({ id: userId });
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    handleGoogleSuccess
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
