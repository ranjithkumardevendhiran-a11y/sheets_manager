import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AppHeader from './components/AppHeader.jsx';
import Home from './pages/Home.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import UserLogin from './pages/UserLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserDashboard from './pages/UserDashboard.jsx';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container" style={{ padding: '3rem 0' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/user/login'} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />;
  }

  return children;
}

export default function App() {
  return (
    <>
      <AppHeader />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
