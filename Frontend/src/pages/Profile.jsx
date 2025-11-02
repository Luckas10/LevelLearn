import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UserIcon from "../assets/Animals/Raposa.png";
import TrophyIcon from "../assets/Trophy.png";
import ClockIcon from "../assets/Clock.png";
import DecksIcon from "../assets/Decks.png";
import ProgressBar from "../components/Profile/ProgressBar";
import "./Profile.css";

import Cobra from "../assets/Animals/Cobra.png";
import Dragao from "../assets/Animals/Dragao.png";
import Fenix from "../assets/Animals/Fenix.png";
import Gato from "../assets/Animals/Gato.png";
import Ourico from "../assets/Animals/Ourico.png";
import Raposa from "../assets/Animals/Raposa.png";

import Math from "../assets/Achievements/Math.png";

import { useState } from "react";
import { NavLink } from "react-router-dom";

export function Profile() {
    const [userName, setUserName] = useState("USERNAME");
    const [userLevel, setUserLevel] = useState(25);
    const [userXP, setUserXP] = useState(1500);
    const [friendCount, setFriendCount] = useState(5);

    // Calcula o tamanho da fonte conforme o número de caracteres
    const getFontSize = (name) => {
        const length = name.length;
        if (length <= 8) return "clamp(16pt, 4vw, 50pt)";
        if (length <= 12) return "clamp(14pt, 3vw, 40pt)";
        if (length <= 18) return "clamp(12pt, 2.5vw, 32pt)";
        if (length <= 24) return "clamp(10pt, 2vw, 26pt)";
        return "clamp(8pt, 1.5vw, 22pt)";
    };

    return (
        <div className="profile-page">
            <Sidebar />
            <section className="profile">
                <Navbar />
                <div className="profile-container">

                    {/* Seção de cima do perfil do usuário (Foto de perfil, nome, nível, etc.) */}
                    <div className="profile-status">
                        <div className="user-container">
                            <img src={UserIcon} alt="User Image" className="user-picture" />
                            <div className="name-level">
                                <h1 className="user-name" style={{ fontSize: getFontSize(userName) }}>
                                    {userName}
                                </h1>

                                <h1 className="user-status">
                                    <span className="user-level">LVL: {userLevel}</span> |{" "}
                                    <span className="user-xp">XP: {userXP}</span>
                                </h1>

                                <div className="progress">
                                    <ProgressBar value={75} size="sm" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="user-badges">
                            <div className="badge">
                                <img src={TrophyIcon} alt="Trophy Icon" className="trophy-icon" />
                                <p>CONQUISTAS: XX</p>
                            </div>
                            <div className="badge">
                                <img src={DecksIcon} alt="Decks Icon" className="decks-icon" />
                                <p>DECKS: XX</p>
                            </div>
                            <div className="badge">
                                <img src={ClockIcon} alt="Clock Icon" className="clock-icon" />
                                <p>HORAS DE ESTUDO: XX</p>
                            </div>
                        </div>
                    </div>
                    <hr />

                    {/* Seção inferior (Lista de amigos, lista de conquistas)*/}
                    <div className="achievements-friends">
                        <div className="friends-container">
                            <h1>Amigos ({friendCount})</h1>

                            <div className="friend-list">
                                <NavLink className="friend">
                                    <img src={Gato} alt="Friend img" />
                                    <span>Amigo1</span>
                                </NavLink>

                                <NavLink className="friend">
                                    <img src={Dragao} alt="Friend img" />
                                    <span>Amigo2</span>
                                </NavLink>

                                <NavLink className="friend">
                                    <img src={Fenix} alt="Friend img" />
                                    <span>Amigo3</span>
                                </NavLink>

                                <NavLink className="friend">
                                    <img src={Ourico} alt="Friend img" />
                                    <span>Amigo4</span>
                                </NavLink>

                                <NavLink className="friend">
                                    <img src={Cobra} alt="Friend img" />
                                    <span>Amigo5</span>
                                </NavLink>

                                <NavLink className="friend">
                                    <img src={Cobra} alt="Friend img" />
                                    <span>Amigo6</span>
                                </NavLink>
                                
                                <NavLink className="friend">
                                    <img src={Cobra} alt="Friend img" />
                                    <span>Amigo6</span>
                                </NavLink>
                                <NavLink className="friend">
                                    <img src={Cobra} alt="Friend img" />
                                    <span>Amigo6</span>
                                </NavLink>
                                <NavLink className="friend">
                                    <img src={Cobra} alt="Friend img" />
                                    <span>Amigo6</span>
                                </NavLink>
                                <NavLink className="friend">
                                    <img src={Cobra} alt="Friend img" />
                                    <span>Amigo6</span>
                                </NavLink>
                                <NavLink className="friend">
                                    <img src={Cobra} alt="Friend img" />
                                    <span>Amigo6</span>
                                </NavLink>
                                <NavLink className="friend">
                                    <img src={Cobra} alt="Friend img" />
                                    <span>Amigo6</span>
                                </NavLink>
                                <NavLink className="friend">
                                    <img src={Cobra} alt="Friend img" />
                                    <span>Amigo6</span>
                                </NavLink>
                                <NavLink className="friend">
                                    <img src={Cobra} alt="Friend img" />
                                    <span>Amigo6</span>
                                </NavLink>

                            </div>
                        </div>

                        <div className="achievements">
                            <h1>Conquistas</h1>

                            <div className="achievements-list">
                                <div className="achievement">

                                    <img src={Math} alt="" className="achievement-picture"/>

                                    <div className="achievement-info">
                                        <p className="achievement-title">
                                            Iniciante
                                        </p>

                                        <p>Você criou seu primeiro conjunto de flashcards.</p>
                                    </div>

                                </div>

                                <div className="achievement">

                                    <img src={Math} alt="" className="achievement-picture"/>

                                    <div className="achievement-info">
                                        <p className="achievement-title">
                                            Iniciante
                                        </p>

                                        <p>Você criou seu primeiro conjunto de flashcards.</p>
                                    </div>

                                </div>

                                <div className="achievement">

                                    <img src={Math} alt="" className="achievement-picture"/>

                                    <div className="achievement-info">
                                        <p className="achievement-title">
                                            Iniciante
                                        </p>

                                        <p>Você criou seu primeiro conjunto de flashcards.</p>
                                    </div>

                                </div>

                                <div className="achievement">

                                    <img src={Math} alt="" className="achievement-picture"/>

                                    <div className="achievement-info">
                                        <p className="achievement-title">
                                            Iniciante
                                        </p>

                                        <p>Você criou seu primeiro conjunto de flashcards.</p>
                                    </div>
                                </div>

                                <div className="achievement">

                                    <img src={Math} alt="" className="achievement-picture"/>

                                    <div className="achievement-info">
                                        <p className="achievement-title">
                                            Iniciante
                                        </p>

                                        <p>Você criou seu primeiro conjunto de flashcards.</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
