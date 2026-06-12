import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="container" style={{ padding: '4rem 0' }}>
      <section className="card" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ marginTop: 0, fontSize: '2.4rem' }}>Sheets Manager</h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Upload and manage Google Sheets data securely. Admins control uploads and editing.
          Users get read-only access to view the latest sheet data.
        </p>

        {user ? (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to={user.role === 'admin' ? '/admin' : '/user'}
              className="btn btn-primary"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <Link to="/admin/login" className="btn btn-admin" style={{ display: 'block' }}>
              Admin Login
            </Link>
            <Link to="/user/login" className="btn btn-user" style={{ display: 'block' }}>
              User Login
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
