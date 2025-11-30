import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import UserIcon from "../assets/Animals/Raposa.png";
import TrophyIcon from "../assets/Trophy.png";
import ClockIcon from "../assets/Clock.png";
import DecksIcon from "../assets/Decks.png";
import ProgressBar from "../components/Profile/ProgressBar";
import "./Profile.css";

import { getUserByID } from "../services/profile";
import { getAchievementsByUserID } from "../services/achievements";
import { getFriendsOfUser } from "../services/friends";

import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

import Raposa from "../assets/Animals/Raposa.png";
import Math from "../assets/Achievements/Math.png";

export function ProfileID() {
  const { id } = useParams();

  const [error, setError] = useState(null);

  const [userName, setUserName] = useState("USERNAME");
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(0);
  const [userCoins, setUserCoins] = useState(0);
  const [userCombo, setUserCombo] = useState(0);

  const [friendCount, setFriendCount] = useState(0);
  const [friends, setFriends] = useState([]);

  const [achievements, setAchievements] = useState([]);

  const getFontSize = (name) => {
    const length = name.length;
    if (length <= 8) return "clamp(16pt, 4vw, 50pt)";
    if (length <= 12) return "clamp(14pt, 3vw, 40pt)";
    if (length <= 18) return "clamp(12pt, 2.5vw, 32pt)";
    if (length <= 24) return "clamp(10pt, 2vw, 26pt)";
    return "clamp(8pt, 1.5vw, 22pt)";
  };

  // Handle horizontal scrolling
  useEffect(() => {
    const handleWheel = (e) => {
      const el = e.currentTarget;
      const isHorizontal = el.scrollWidth > el.clientWidth;
      const isVertical = el.scrollHeight > el.clientHeight;

      if (isHorizontal && !isVertical) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    const scrollables = document.querySelectorAll(
      ".friend-list, .achievements-list"
    );
    scrollables.forEach((el) => {
      el.addEventListener("wheel", handleWheel, { passive: false });
    });

    return () => {
      scrollables.forEach((el) => {
        el.removeEventListener("wheel", handleWheel);
      });
    };
  }, []);

  // Load user, friends and achievements
  useEffect(() => {
    if (!id) return;

    async function loadProfileData() {
      try {
        // Carregar usuário
        const user = await getUserByID(id);

        if (!user) {
          setError("Usuário não encontrado.");
          return;
        }

        setUserName(user.username);
        setUserLevel(user.level);
        setUserXP(user.xp);
        setUserCoins(user.coins);
        setUserCombo(user.combo);
        setError(null); // reseta erro caso existisse

        // Carregar amigos
        try {
          const friendsResponse = await getFriendsOfUser(id);
          setFriends(friendsResponse);
          setFriendCount(friendsResponse.length);
        } catch {
          setFriends([]);
          setFriendCount(0);
        }

        // Carregar conquistas
        try {
          const achievementsResponse = await getAchievementsByUserID(id);
          setAchievements(achievementsResponse);
        } catch {
          setAchievements([]);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Usuário não encontrado.");
        } else {
          setError("Ocorreu um erro ao carregar o usuário.");
        }
      }
    }

    loadProfileData();
  }, [id]);

  if (error) {
    return (
      <div className="profile-page">
        <Sidebar />
        <section className="profile">
          <Navbar />
          <div className="error-container">
            <div className="error-box">
              <h1 className="error-title">404</h1>
              <p className="error-message">{error}</p>
              <NavLink to="/" className="error-btn">
                Voltar para a Página Inicial
              </NavLink>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Sidebar />
      <section className="profile">
        <Navbar />
        <div className="profile-container">
          {/* Seção superior do perfil */}
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
              <div className="badgeProfile">
                <img src={TrophyIcon} alt="Trophy Icon" className="trophy-icon" />
                <p>CONQUISTAS: XX</p>
              </div>
              <div className="badgeProfile">
                <img src={DecksIcon} alt="Decks Icon" className="decks-icon" />
                <p>DECKS: XX</p>
              </div>
              <div className="badgeProfile">
                <img src={ClockIcon} alt="Clock Icon" className="clock-icon" />
                <p>HORAS DE ESTUDO: XX</p>
              </div>
            </div>
          </div>
          <hr />

          {/* Seção inferior: amigos e conquistas */}
          <div className="achievements-friends">
            <div className="friends-container">
              <h1>Amigos ({friendCount})</h1>
              {friends.length > 0 ? "" : <p>Ainda não tem amigos</p>}
              <div className="friend-list">
                {friends.map((friend) => (
                  <NavLink
                    to={`/profile/${friend.id}`}
                    key={friend.id}
                    className="friend"
                  >
                    <img src={friend.avatar || Raposa} alt="Friend img" />
                    <span>{friend.username}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="achievements">
              <h1>Conquistas</h1>
              <div className="achievements-list">
                {achievements.length > 0 ? (
                  achievements.map((achievement) => (
                    <div className="achievement" key={achievement.id}>
                      <img
                        src={achievement.image_path || Math}
                        alt={achievement.name}
                        className="achievement-picture"
                      />
                      <div className="achievement-info">
                        <p className="achievement-title">{achievement.name}</p>
                        <p>{achievement.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-achievements">Ainda não possui conquistas.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
