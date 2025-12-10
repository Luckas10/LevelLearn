import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Sidebar.css";

import { useState, useEffect } from "react";
import { getDataUser } from "../../services/auth";

export default function Sidebar() {
    const navigate = useNavigate();

    const [userID, setUserID] = useState(0);
    const [theme, setTheme] = useState(
        typeof document !== "undefined"
            ? document.documentElement.getAttribute("data-theme") || "dark"
            : "dark"
    );

    // Carrega ID do usuário
    useEffect(() => {
        async function loadUser() {
            try {
                const user = await getDataUser();
                setUserID(user.id);
            } catch (err) {
                console.error("Erro ao carregar ID:", err);
            }
        }

        loadUser();
    }, []);

    // Observa mudança de tema via data-theme no <html>
    useEffect(() => {
        if (typeof document === "undefined") return;

        const root = document.documentElement;

        const updateTheme = () => {
            const current = root.getAttribute("data-theme") || "dark";
            setTheme(current);
        };

        // Primeiro set imediato
        updateTheme();

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === "data-theme") {
                    updateTheme();
                }
            }
        });

        observer.observe(root, { attributes: true });

        return () => observer.disconnect();
    }, []);

    const handleLogout = async () => {
        const confirm = await Swal.fire({
            title: "Deseja sair?",
            text: "Você será desconectado da sua conta.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, sair",
            cancelButtonText: "Cancelar",
        });

        if (confirm.isConfirmed) {
            localStorage.removeItem("token");

            await Swal.fire({
                icon: "success",
                title: "Sessão encerrada",
                text: "Você saiu da conta com sucesso.",
                timer: 1800,
                showConfirmButton: false,
            });

            navigate("/login");
        }
    };

    // Decide qual logo usar com base no tema
    const logoSrc =
        theme === "light" ? "/img/LogoSVGLight.svg" : "/img/LogoSVG.svg";

    return (
        <nav className="sidebar">
            <div className="sidebarLogo">
                <img src={logoSrc} alt="Logo" />
                <span>LevelLearn</span>
            </div>

            <ul className="sidebarLinks">
                <li>
                    <NavLink to="/" end>
                        <FontAwesomeIcon size="lg" icon={fas.faHouse} />
                        <span>PÁGINA INICIAL</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/study">
                        <FontAwesomeIcon size="lg" icon={fas.faBook} />
                        <span>ESTUDAR</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/friends">
                        <FontAwesomeIcon size="lg" icon={fas.faUserGroup} />
                        <span>AMIGOS</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/store">
                        <FontAwesomeIcon size="lg" icon={fas.faStore} />
                        <span>LOJA</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={`/profile/${userID}`}>
                        <FontAwesomeIcon size="lg" icon={fas.faUser} />
                        <span>MEU PERFIL</span>
                    </NavLink>
                </li>

                <li>
                    <a
                        type="button"
                        onClick={handleLogout}
                        className="logoutButton"
                    >
                        <FontAwesomeIcon
                            size="lg"
                            icon={fas.faRightFromBracket}
                        />
                        <span>SAIR</span>
                    </a>
                </li>
            </ul>
        </nav>
    );
}
