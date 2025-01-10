import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = (children) => {
  const { user, loading } = useAuthContext();

  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
