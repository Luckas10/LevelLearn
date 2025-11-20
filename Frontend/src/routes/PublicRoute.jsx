import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute({ redirectTo = "/" }) {
    const token = localStorage.getItem("token");

    return token ? <Navigate to={redirectTo} replace /> : <Outlet />;
}
