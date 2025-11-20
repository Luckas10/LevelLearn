// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ redirectTo = "/login" }) {
    const token = localStorage.getItem("token");

    return token ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
