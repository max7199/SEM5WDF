import React, { useState } from 'react';
import { login, register } from '../api';

/**
 * Authentication Component for Practical 7
 * Provides Login and Registration forms with validation, loading states, and error alerts.
 * Student: Max Patel (24IT070) - CHARUSAT - ITUE301
 */
function AuthCard({ onAuthSuccess, addToast }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
  };

  const switchTab = (toLogin) => {
    setIsLoginTab(toLogin);
    setError(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Client-side validation
    if (!email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!isLoginTab && password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    setLoading(true);

    try {
      if (isLoginTab) {
        // Handle Login
        const data = await login(email.trim(), password);
        if (addToast) {
          addToast(`Welcome back, ${data.user?.email || email}!`, 'success');
        }
        if (onAuthSuccess) {
          onAuthSuccess(data.user);
        }
      } else {
        // Handle Registration
        await register(email.trim(), password);
        setSuccessMsg('Registration successful! Logging you in...');
        if (addToast) {
          addToast('Account registered successfully in MongoDB!', 'success');
        }

        // Auto-login upon successful registration for smooth student UX
        const loginData = await login(email.trim(), password);
        if (onAuthSuccess) {
          onAuthSuccess(loginData.user);
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication request failed. Please check your credentials.');
      if (addToast) {
        addToast(err.message || 'Authentication error', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card-container">
      <div className="auth-card">
        {/* Header Banner */}
        <div className="auth-header">
          <div className="auth-badge">Practical 7 &bull; Authentication & Middleware</div>
          <h2 className="auth-title">
            {isLoginTab ? 'Sign In to Your Account' : 'Create a New Account'}
          </h2>
          <p className="auth-subtitle">
            Secure authentication pipeline using JWT tokens and Bcrypt password hashing.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tab-bar" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={isLoginTab}
            className={`auth-tab-btn ${isLoginTab ? 'active' : ''}`}
            onClick={() => switchTab(true)}
          >
            🔑 Log In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isLoginTab}
            className={`auth-tab-btn ${!isLoginTab ? 'active' : ''}`}
            onClick={() => switchTab(false)}
          >
            📝 Register
          </button>
        </div>

        {/* Form Alert Banners */}
        {error && (
          <div className="auth-alert auth-alert-error" role="alert">
            <span className="auth-alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-alert auth-alert-success" role="alert">
            <span className="auth-alert-icon">✅</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="auth-email" className="form-label">
              Email Address <span className="required-star">*</span>
            </label>
            <input
              id="auth-email"
              type="email"
              className="form-input"
              placeholder="e.g. 24it070@charusat.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password" className="form-label">
              Password <span className="required-star">*</span>
            </label>
            <input
              id="auth-password"
              type="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isLoginTab ? 'current-password' : 'new-password'}
              disabled={loading}
            />
          </div>

          {!isLoginTab && (
            <div className="form-group">
              <label htmlFor="auth-confirm-password" className="form-label">
                Confirm Password <span className="required-star">*</span>
              </label>
              <input
                id="auth-confirm-password"
                type="password"
                className="form-input"
                placeholder="Re-type your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading-wrapper">
                <span className="spinner-mini"></span>
                <span>{isLoginTab ? 'Authenticating...' : 'Registering User...'}</span>
              </span>
            ) : isLoginTab ? (
              'Log In with JWT'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* College Project Architecture Footnote */}
        <div className="auth-footer-features">
          <div className="auth-feature-pill">🛡️ Bcrypt (10 rounds)</div>
          <div className="auth-feature-pill">🎟️ JWT (1 hr expiry)</div>
          <div className="auth-feature-pill">🔒 Bearer Header</div>
          <div className="auth-feature-pill">👤 User Isolation</div>
        </div>
      </div>
    </div>
  );
}

export default AuthCard;
