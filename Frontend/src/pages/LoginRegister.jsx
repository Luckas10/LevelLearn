import { useState, useEffect } from "react";
import Background from "../components/LoginAndRegister/Background";
import LoginRegisterContainer from "../components/LoginAndRegister/LoginRegisterContainer";
import "../style.css";

export function LoginRegister() {
    const [isNight, setIsNight] = useState(false);
    const toggleTheme = () => setIsNight(v => !v);

    useEffect(() => {
        // aplica o atributo para o CSS enxergar
        document.documentElement.setAttribute("data-theme", isNight ? "dark" : "light");
    }, [isNight]);

    const videoSrc = isNight
        ? "/videos/background-night.mp4"
        : "/videos/background-dayy.mp4";

    return (
        <Background
            as="main"
            src={videoSrc}
            blur={2}
            dark={isNight ? 0.15 : 0}   // escurece um pouco só no modo noite
        >
            <LoginRegisterContainer
                isNight={isNight}
                onToggleTheme={toggleTheme}
            />
        </Background>
    );
}
