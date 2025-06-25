import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: request OTP, 2: verify OTP
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('OTP sent to your email.');
        setStep(2);
      } else {
        setError(data.message || data.error || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Password changed successfully! You can now log in.');
        setStep(1);
        setEmail('');
        setOtp('');
        setNewPassword('');
      } else {
        setError(data.message || data.error || 'Failed to change password.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="forgot-password-form">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Enter your registered email"
          />
          <button type="submit" disabled={loading}>{loading ? 'Sending OTP...' : 'Request OTP'}</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="forgot-password-form">
          <label htmlFor="otp">OTP</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
            placeholder="Enter the OTP sent to your email"
          />
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            placeholder="Enter your new password"
          />
          <button type="submit" disabled={loading}>{loading ? 'Changing...' : 'Change Password'}</button>
          <button type="button" onClick={() => { setStep(1); setError(''); setMessage(''); }} style={{marginTop:8}}>Back</button>
        </form>
      )}
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="back-to-login">
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
