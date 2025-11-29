import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Sidebar.css";

import { useState, useEffect } from "react";
import { getDataUser } from "../../services/auth";

export default function Sidebar() {
    const navigate = useNavigate();

    const [userID, setUserID] = useState(0)

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

    const handleLogout = async () => {
        const confirm = await Swal.fire({
            title: "Deseja sair?",
            text: "Você será desconectado da sua conta.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
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

    return (
        <nav className="sidebar">
            <div className="sidebarLogo">
                <img src="/img/LogoSVG.svg" alt="Logo" />
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
            </ul>

            <ul className="">
                <li>
                    <a onClick={handleLogout} className="logoutButton">
                        <FontAwesomeIcon size="lg" icon={fas.faRightFromBracket} />
                        <span>SAIR</span>
                    </a>
                </li>
            </ul>

        </nav >
    );
}
