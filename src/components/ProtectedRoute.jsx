// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, redirectTo = "/login" }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to={redirectTo} replace />;
}
