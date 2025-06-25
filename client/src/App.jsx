import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ArtistProvider } from './context/ArtistContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthSuccess from './pages/AuthSuccess';
import Cart from './pages/Cart';
import AiAssistant from './components/AiAssistant/AiAssistant';
import ArtistsPage from './pages/ArtistsPage';
import MarketplacePage from './pages/MarketplacePage';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer/Footer';
import ForgotPassword from './pages/ForgotPassword';
import './App.css';
import './pages/ForgotPassword.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/success" element={<AuthSuccess />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/artists" element={<ArtistsPage />} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/ai-assistant" element={<ProtectedRoute><AiAssistant /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ArtistProvider>
          <CartProvider>
            <div className="app">
              <Navbar />
              <main className="main-content">
                <AppRoutes />
              </main>
              <Footer />
            </div>
          </CartProvider>
        </ArtistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
