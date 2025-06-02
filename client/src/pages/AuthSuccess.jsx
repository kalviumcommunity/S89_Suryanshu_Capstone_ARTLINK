import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const { handleGoogleSuccess } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (token && userId) {
      handleGoogleSuccess(token, userId);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [searchParams, handleGoogleSuccess, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-form text-center">
        <h2 className="auth-title">Authentication Successful</h2>
        <p className="text-gray-600">Redirecting you to the homepage...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
