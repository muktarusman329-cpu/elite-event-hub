import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

function ProtectedRoute({ children, role }) {
  const { user, authChecked } = useAuthStore();
  const location = useLocation();

  // wait for initial auth check to complete
  if (!authChecked) return null;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role === 'admin' && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (role === 'user' && user.role === 'admin') {
    return <Navigate   to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;
