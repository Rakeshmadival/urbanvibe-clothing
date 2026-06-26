import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from '../../context/AdminAuthContext.jsx';

function Guard() {
  const { isAuthenticated, checking } = useAdminAuth();
  const location = useLocation();

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default function AdminProtectedRoute() {
  return (
    <AdminAuthProvider>
      <Guard />
    </AdminAuthProvider>
  );
}
