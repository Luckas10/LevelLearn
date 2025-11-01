import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UserIcon from "../assets/Animals/Raposa.png";
import TrophyIcon from "../assets/Trophy.png";
import ClockIcon from "../assets/Clock.png";
import DecksIcon from "../assets/Decks.png";
import ProgressBar from "../components/ProgressBar";
import "./Profile.css";

export function Profile() {
    return (
        <div className="profile-page">
            <Sidebar />
            <section className="profile">
                <Navbar />
                <div className="profile-container">
                    <div className="profile-status">
                        <div className="user-container">
                            <img src={UserIcon} alt="User Image" className="user-picture"/>
                            <div className="name-level">
                                <h1 className="user-name">USERNAME</h1>
                                <h1 className="user-status"><span className="user-level">LVL: XX</span> | <span className="user-xp">XP: XXXX</span></h1>

                                <div className="progress">
                                    <ProgressBar value={75} size="sm"/>
                                </div>
                                
                            </div>
                        </div>

                        <div className="user-badges">
                            <div className="badge">
                                <img src={TrophyIcon} alt="Trophy Icon" className="trophy-icon"/>
                                <p>CONQUISTAS: XX</p>
                            </div>
                            <div className="badge">
                                <img src={DecksIcon} alt="Decks Icon" className="decks-icon"/>
                                <p>DECKS: XX</p>
                            </div>
                            <div className="badge">
                                <img src={ClockIcon} alt="Clock Icon" className="clock-icon"/>
                                <p>HORAS DE ESTUDO: XX</p>
                            </div>
                        </div> 
                    </div>
                    <hr />
                </div>

                
             
            </section>
        </div>
    );
}