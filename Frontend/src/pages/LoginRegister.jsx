import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    showWelcomeToast,
    showErrorModal,
} from "../services/notifications";
import Background from "../components/LoginAndRegister/Background";
import LoginRegisterContainer from "../components/LoginAndRegister/Container";
import { loginWithPassword, registerUser } from "../services/auth";
import "../style.css";

export function LoginRegister() {
    const [isNight, setIsNight] = useState(false);
    const toggleTheme = () => setIsNight((v) => !v);
    const navigate = useNavigate();

    const [loginPrefill, setLoginPrefill] = useState({ email: "", password: "" });
    const [forceLoginModeKey, setForceLoginModeKey] = useState(0);

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            isNight ? "dark" : "light"
        );
    }, [isNight]);

    const videoSrc = isNight
        ? "/videos/background-night.mp4"
        : "/videos/background-dayy.mp4";

    const handleLogin = async ({ email, password }) => {
        try {
            const { access_token, user } = await loginWithPassword({ email, password });
            localStorage.setItem("token", access_token);

            navigate("/");

            // Toast de boas-vindas reaproveitável
            showWelcomeToast(user?.username);
        } catch (err) {
            const msg =
                err?.response?.data?.detail ||
                "Não foi possível fazer login. Verifique suas credenciais.";

            await showErrorModal(
                "Falha no login",
                Array.isArray(msg) ? msg.join("\n") : msg
            );
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        try {
            await registerUser({ username, email, password });

            await Swal.fire({
                icon: "success",
                title: "Conta criada!",
                text: "Seus dados já estão preenchidos, é só entrar!",
                confirmButtonText: "Ir para o login",
            });

            setLoginPrefill({ email, password });
            setForceLoginModeKey((k) => k + 1);
        } catch (err) {
            const msg =
                err?.response?.data?.detail ||
                "Não foi possível criar a conta. Tente novamente.";

            await showErrorModal(
                "Erro ao registrar",
                Array.isArray(msg) ? msg.join("\n") : msg
            );
        }
    };

    return (
        <Background
            as="main"
            src={videoSrc}
            blur={2}
            dark={isNight ? 0.15 : 0}
        >
            <LoginRegisterContainer
                isNight={isNight}
                onToggleTheme={toggleTheme}
                onLogin={handleLogin}
                onRegister={handleRegister}
                loginPrefill={loginPrefill}
                forceLoginModeKey={forceLoginModeKey}
            />
        </Background>
    );
}
