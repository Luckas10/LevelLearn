import FireIcon from "../assets/Fire.png";
import CoinIcon from "../assets/Coin.png";
import UserIcon from "../assets/User.png";
import "./Navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="offensive">
                <img src={FireIcon} alt="Fire Icon" />
                <span>XX</span>
            </div>

            <div className="coins">
                <img src={CoinIcon} alt="Coin Icon" />
                <span>XX</span>
            </div>

            <div className="level">
                <span>LVL XX</span>
                <div className="level-bar">
                    <div className="level-bar-fill"></div>
                </div>
            </div>

            <div className="profile">
                <img src={UserIcon} alt="User Icon" />
            </div>
        </nav>
    );
}
