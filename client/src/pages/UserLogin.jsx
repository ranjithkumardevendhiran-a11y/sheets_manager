import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import { LogoBadge } from '../components/AppHeader.jsx';

export default function UserLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await login(email, password, 'user');
      navigate('/user');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/register-user', { name, email, password });
      setSuccess('Account created. You can sign in now.');
      setMode('login');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ padding: '4rem 0' }}>
      <section className="card" style={{ maxWidth: 460, margin: '0 auto' }}>
        <LogoBadge small />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <h1 style={{ margin: 0 }}>User Login</h1>
          <span className="badge badge-user">User</span>
        </div>
        <p style={{ color: 'var(--muted)' }}>
          Sign in to view sheet data in read-only mode.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            type="button"
            className={`btn ${mode === 'login' ? 'btn-user' : 'btn-secondary'}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`btn ${mode === 'register' ? 'btn-user' : 'btn-secondary'}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
          {mode === 'register' && (
            <div className="field">
              <label htmlFor="user-name">Full name</label>
              <input
                id="user-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="user-email">Email</label>
            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="user-password">Password</label>
            <input
              id="user-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button className="btn btn-user" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in as User' : 'Create User Account'}
          </button>
        </form>

        <p style={{ marginTop: '1rem' }}>
          <Link to="/">Back to home</Link> · <Link to="/admin/login">Admin login</Link>
        </p>
      </section>
    </main>
  );
}
