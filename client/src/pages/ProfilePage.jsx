import { useAuth } from '../context/AuthContext';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page-center">
      <div className="profile-box">
        <h1 className="profile-title">My Profile</h1>
        <div className="profile-info">
          <h2>{user?.name || 'User Name'}</h2>
          <p>Email: {user?.email || 'user@example.com'}</p>
          {/* Add more profile details and edit options here */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
