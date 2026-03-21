import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !userInfo.isAdmin) {
    return <Navigate to="/events" replace />;
  }

  return children;
}

export default ProtectedRoute;