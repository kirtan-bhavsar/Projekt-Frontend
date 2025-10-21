import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login", { replace: true });
      }

      else if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        navigate(`/${user.role}/dashboard`, { replace: true });
      }
    }
  }, [user, loading, allowedRoles, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg font-medium">Checking session...</p>
      </div>
    );
  }

  if (user && (allowedRoles.length === 0 || allowedRoles.includes(user.role))) {
    return children;
  }

  return null;
};

export default ProtectedRoute;
