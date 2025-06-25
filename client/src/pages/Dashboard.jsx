import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container" style={{ padding: '2rem 0', maxWidth: 600 }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Welcome, {user?.name || user?.email || 'User'}!</h1>
      <div style={{ background: 'white', borderRadius: 12, padding: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Profile</h2>
        <p>Email: {user?.email}</p>
        {/* Add more profile details here if needed */}
        <button onClick={handleLogout} style={{ marginTop: '2rem', padding: '0.8rem 1.5rem', borderRadius: 8, background: '#4f3ce7', color: 'white', border: 'none', cursor: 'pointer' }}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
