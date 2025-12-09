import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./style.css";
import "./Swal.css";
import "./LightMode.css";

const savedTheme =
  typeof window !== "undefined" ? localStorage.getItem("theme") : null;

if (savedTheme === "dark" || savedTheme === "light") {
  document.documentElement.setAttribute("data-theme", savedTheme);
} else {
  document.documentElement.setAttribute("data-theme", "dark");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
