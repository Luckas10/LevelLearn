import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom"; // ⬅️ troque Link por NavLink
import "./Navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbarLogo"><img src="./img/LogoSVG.svg" alt="" />LevelLearn</div>
            <ul className="navbarLinks">
                <li>
                    <NavLink to="/" end>
                        <FontAwesomeIcon size="lg" icon={fas.faHouse}/> PÁGINA INICIAL
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/study">
                        <FontAwesomeIcon size="lg" icon={fas.faBook}/> ESTUDAR
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/friends">
                        <FontAwesomeIcon size="lg" icon={fas.faUserGroup}/> AMIGOS
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/store">
                        <FontAwesomeIcon size="lg" icon={fas.faStore}/> LOJA
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/profile">
                        <FontAwesomeIcon size="lg" icon={fas.faUser}/> MEU PERFIL
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}
