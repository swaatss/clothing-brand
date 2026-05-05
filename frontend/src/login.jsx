import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./loginpage.css";

const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    const endpoint = isRegister
      ? 'clothing-brand-production-ff3f.up.railway.app'
      : 'clothing-brand-production-ff3f.up.railway.app';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      if (isRegister) {
        // After register, switch to login
        setIsRegister(false);
        setError('');
        setEmail('');
        setPassword('');
        setLoading(false);
        return;
      }

      // Save token and redirect
      localStorage.setItem('token', data.token);
      onLogin(data.token);
      navigate('/');
    } catch (err) {
      setError('Could not connect to server');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand" onClick={() => navigate('/')}>
          NO NAME CLOTHING BRAND
        </div>
        <p className="login-tagline">Wear nothing. Wear everything.</p>
      </div>

      <div className="login-right">
        <div className="login-box">
          <div className="login-tabs">
            <button
              className={`login-tab ${!isRegister ? 'active' : ''}`}
              onClick={() => { setIsRegister(false); setError(''); }}
            >
              SIGN IN
            </button>
            <button
              className={`login-tab ${isRegister ? 'active' : ''}`}
              onClick={() => { setIsRegister(true); setError(''); }}
            >
              CREATE ACCOUNT
            </button>
          </div>

          <div className="login-fields">
            <div className="login-field">
              <label>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            <div className="login-field">
              <label>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button
              className="login-submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '...' : isRegister ? 'CREATE ACCOUNT' : 'SIGN IN'}
            </button>

            <p className="login-back" onClick={() => navigate('/')}>
              ← Continue without account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
