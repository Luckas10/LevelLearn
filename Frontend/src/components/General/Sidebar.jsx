import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
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
                    <NavLink to="/profile">
                        <FontAwesomeIcon size="lg" icon={fas.faUser} />
                        <span>MEU PERFIL</span>
                    </NavLink>
                </li>
            </ul>
            <ul className="logout">
                <li>
                    <NavLink to="/logout">
                        <FontAwesomeIcon size="lg" icon={fas.faRightFromBracket} />
                        <span>SAIR</span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}
