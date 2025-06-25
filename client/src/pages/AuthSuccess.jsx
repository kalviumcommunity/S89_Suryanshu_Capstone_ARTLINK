import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const { handleGoogleSuccess, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      handleGoogleSuccess(token);
    } else {
      navigate('/login');
    }
    if (!loading && token) {
      navigate('/');
    }
  }, [searchParams, handleGoogleSuccess, navigate, loading]);

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
