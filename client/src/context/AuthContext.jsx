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
    let didCancel = false;
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/auth/me');
        if (!didCancel) {
          setUser(res.data.user);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        if (!didCancel) {
          setUser(null);
          setLoading(false);
          // Only clear token if error is 401 (unauthorized)
          if (err.response && err.response.status === 401) {
            setToken(null);
          }
        }
      }
    };
    loadUser();
    return () => { didCancel = true; };
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
  const handleGoogleSuccess = (tokenFromUrl) => {
    setToken(tokenFromUrl);
    // Do NOT call setUser here; let the effect fetch the user from the backend
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
