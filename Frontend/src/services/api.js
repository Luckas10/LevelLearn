import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// derruba no 401/403
api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            localStorage.removeItem("token");
            // não temos navigate aqui; redireciono "bruto"
            if (window.location.pathname !== "/login") {
                window.location.replace("/login");
            }
        }
        return Promise.reject(error);
    }
);

export default api;