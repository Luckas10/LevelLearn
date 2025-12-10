import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import UserIcon from "../assets/Animals/Raposa.png"; // pode trocar depois por um ícone genérico
import TrophyIcon from "../assets/Trophy.png";
import LightTrophyIcon from "../assets/LightTrophy.png";
import ClockIcon from "../assets/Clock.png";
import LightClockIcon from "../assets/LightClock.png";
import DecksIcon from "../assets/Decks.png";
import LightDecksIcon from "../assets/LightDecks.png";
import ProgressBar from "../components/Profile/ProgressBar";
import { getDeckCountByUserId } from "../services/deck";
import "./Profile.css";

import { getUserByID } from "../services/profile";
import { getAchievementsByUserID } from "../services/achievements";
import { getFriendsOfUser } from "../services/friends";

import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

import ButtonDarkMode from "../components/General/ButtonDarkMode";

// helper pras imagens de conquistas
const getAchievementImageUrl = (imagePath) => {
  if (!imagePath) {
    return "/achievements/default.png";
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  if (imagePath.startsWith("/achievements")) {
    return imagePath;
  }

  return `/achievements/${imagePath}`;
};

export function ProfileID() {
  const { id } = useParams();

  const [error, setError] = useState(null);

  const [userName, setUserName] = useState("USERNAME");
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(0);
  const [userXPRequired, setUserXPRequired] = useState(0);
  const [userCoins, setUserCoins] = useState(0);
  const [userCombo, setUserCombo] = useState(0);
  const [userDecksCount, setUserDecksCount] = useState(0);
  const [userStudyTime, setUserStudyTime] = useState(0); // minutos acumulados
  const [userAvatarPath, setUserAvatarPath] = useState("/StoreItems/Gato.png");

  const [friendCount, setFriendCount] = useState(0);
  const [friends, setFriends] = useState([]);

  const [achievements, setAchievements] = useState([]);

  const [isNight, setIsNight] = useState(() => {
    if (typeof window === "undefined") return false;

    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      document.documentElement.setAttribute("data-theme", saved);
      return saved === "dark";
    }

    const current = document.documentElement.getAttribute("data-theme");
    return current === "dark";
  });

  useEffect(() => {
    const theme = isNight ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isNight]);

  const toggleTheme = () => setIsNight((v) => !v);

  const getFontSize = (name) => {
    const length = name.length;
    if (length <= 8) return "clamp(16pt, 4vw, 50pt)";
    if (length <= 12) return "clamp(14pt, 3vw, 40pt)";
    if (length <= 18) return "clamp(12pt, 2.5vw, 32pt)";
    if (length <= 24) return "clamp(10pt, 2vw, 26pt)";
    return "clamp(8pt, 1.5vw, 22pt)";
  };

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

  useEffect(() => {
    if (!id) return;

    async function loadProfileData() {
      try {
        const user = await getUserByID(id);

        if (!user) {
          setError("Usuário não encontrado.");
          return;
        }

        // CORRETO
        const decksCountResp = await getDeckCountByUserId(id);
        setUserDecksCount(decksCountResp.total);

        setUserName(user.username);
        setUserLevel(user.level);
        setUserXP(user.xp);
        setUserXPRequired(user.xp_required ?? 0);
        setUserCoins(user.coins);
        setUserCombo(user.combo);
        setUserStudyTime(user.study_time ?? 0);

        setUserAvatarPath(
          user.current_avatar_front_path || "/StoreItems/Gato.png"
        );

        setError(null);

        const friendsResponse = await getFriendsOfUser(id);
        setFriends(friendsResponse);
        setFriendCount(friendsResponse.length);

        const achievementsResponse = await getAchievementsByUserID(id);
        setAchievements(achievementsResponse);

      } catch (err) {
        setError("Ocorreu um erro ao carregar o usuário.");
      }
    }

    loadProfileData();
  }, [id]);


  // progresso de XP (mesma lógica do Navbar/Home)
  const levelProgress = (() => {
    const xp = userXP || 0;
    const required = userXPRequired || 0;

    if (xp <= 0 && required <= 0) return 0;
    if (required <= 0) return 1;

    const progress = xp / (xp + required);
    return Math.min(Math.max(progress, 0), 1);
  })();

  // horas de estudo: minutos acumulados -> horas com 1 casa decimal
  const studyHoursDecimal = (userStudyTime || 0) / 60;
  const studyHoursLabel = studyHoursDecimal.toFixed(1); // ex: "3.5"

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
          <div className="profile-status">
            <div className="user-container">
              <div className="user-avatar-block">
                <img
                  src={userAvatarPath || UserIcon}
                  alt="User Image"
                  className="user-picture"
                />
              </div>

              <div className="name-level">
                <h1
                  className="user-name"
                  style={{ fontSize: getFontSize(userName) }}
                >
                  {userName}
                </h1>
                <h1 className="user-status">
                  <span className="user-level">
                    LVL: {userLevel}
                  </span>{" "}
                  |{" "}
                  <span className="user-xp">
                    XP: {userXP}
                  </span>
                </h1>
                <div className="progress">
                  <ProgressBar
                    value={levelProgress * 100}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="user-badges">
              <div className="badgeProfile">
                <img
                  src={isNight ? TrophyIcon : LightTrophyIcon}
                  alt="Trophy Icon"
                  className="trophy-icon"
                />
                <p>
                  CONQUISTAS:{" "}
                  {achievements ? achievements.length : 0}
                </p>
              </div>
              <div className="badgeProfile">
                <img
                  src={isNight ? DecksIcon : LightDecksIcon}
                  alt="Decks Icon"
                  className="decks-icon"
                />
                <p>DECKS: {userDecksCount}</p>
              </div>
              <div className="badgeProfile">
                <img
                  src={isNight ? ClockIcon : LightClockIcon}
                  alt="Clock Icon"
                  className="clock-icon"
                />
                <p>HORAS DE ESTUDO: {studyHoursLabel}h</p>
              </div>
              <div className="profile-theme-toggle">
                <ButtonDarkMode
                  checked={isNight}
                  onChange={toggleTheme}
                  size={8}
                />
                <p>TEMA: {isNight ? "ESCURO" : "CLARO"}</p>
              </div>
            </div>
          </div>

          <hr />

          <div className="achievements-friends">
            <div className="friends-container">
              <h1>Amigos ({friendCount})</h1>
              {friends.length === 0 && (
                <p className="no-friends">
                  Ainda não tem amigos.
                </p>
              )}
              <div className="friend-list">
                {friends.map((friend) => (
                  <NavLink
                    to={`/profile/${friend.id}`}
                    key={friend.id}
                    className="friend"
                  >
                    <img
                      src={friend.current_avatar_front_path || "/StoreItems/Gato.png"}
                      alt="Friend img"
                    />

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
                    <div
                      className="achievement"
                      key={achievement.id}
                    >
                      <img
                        src={getAchievementImageUrl(
                          achievement.image_path
                        )}
                        alt={achievement.name}
                        className="achievement-picture"
                      />
                      <div className="achievement-info">
                        <p className="achievement-title">
                          {achievement.name}
                        </p>
                        <p>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-achievements">
                    Ainda não possui conquistas.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProfileID;
