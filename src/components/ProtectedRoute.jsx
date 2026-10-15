import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand-surface flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-forest/20 border-t-gold rounded-full animate-spin"></div>
        <span className="text-xs font-mono font-semibold tracking-widest uppercase text-forest">
          Authenticating Green Gate Admin...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
