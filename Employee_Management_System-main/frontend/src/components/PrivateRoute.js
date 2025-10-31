import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user has the required role if specified
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />; // Or to an unauthorized page
  }

  return children;
};

export default PrivateRoute;
