// PublicRoute.jsx
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children, redirectTo = "/dashboard" }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to={redirectTo} replace /> : children;
}


// import { Navigate } from "react-router-dom";

// export default function PublicRoute({ children }) {
//   const token = localStorage.getItem("token");
//   return token ? <Navigate to="/" /> : children;
// }