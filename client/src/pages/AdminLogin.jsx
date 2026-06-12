import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogoBadge } from '../components/AppHeader.jsx';

const DEFAULT_ADMIN_EMAIL = 'ranjith.kumardevendhiran@tvs.in';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, 'admin');
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ padding: '4rem 0' }}>
      <section className="card" style={{ maxWidth: 460, margin: '0 auto' }}>
        <LogoBadge small />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <h1 style={{ margin: 0 }}>Admin Login</h1>
          <span className="badge badge-admin">Admin</span>
        </div>
        <p style={{ color: 'var(--muted)' }}>
          Sign in to upload Google Sheets and manage editable data.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="btn btn-admin" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing in...' : 'Sign in as Admin'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
          Default admin: <strong>{DEFAULT_ADMIN_EMAIL}</strong>
        </p>
        <p style={{ marginTop: '1rem' }}>
          <Link to="/">Back to home</Link> · <Link to="/user/login">User login</Link>
        </p>
      </section>
    </main>
  );
}
