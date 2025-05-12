import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthSuccess from './pages/AuthSuccess';
import './App.css';

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

// Home component (protected)
const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="home-container">
      <h1>Welcome to ArtLink 🎨</h1>
      <p className="text-xl mb-8">The platform for artists to connect, create, and sell.</p>

      {user && (
        <div className="profile-card">
          <h2>User Profile</h2>
          <p className="mb-2"><strong>User ID:</strong> {user.id}</p>
          <button
            onClick={logout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
