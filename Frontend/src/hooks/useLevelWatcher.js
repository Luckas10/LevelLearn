// src/hooks/useLevelWatcher.js
import { useEffect, useRef } from "react";
import api from "../services/api";
import { showLevelUpToast } from "../services/notifications";

export function useLevelWatcher() {
    const previousLevel = useRef(null);
    const isChecking = useRef(false);

    useEffect(() => {
        async function checkLevel() {
            if (isChecking.current) return;
            isChecking.current = true;

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    previousLevel.current = null;
                    isChecking.current = false;
                    return;
                }

                const { data } = await api.get("/users/me"); // ajuste se sua rota for outra
                const currentLevel = data.level;

                // primeira vez: só registra
                if (previousLevel.current == null) {
                    previousLevel.current = currentLevel;
                    isChecking.current = false;
                    return;
                }

                // se o nível aumentou
                if (currentLevel > previousLevel.current) {
                    showLevelUpToast(currentLevel); // 👈 toast no canto superior direito
                }

                previousLevel.current = currentLevel;
            } catch (err) {
                console.error("[LevelWatcher] Erro ao verificar nível:", err);
            } finally {
                isChecking.current = false;
            }
        }

        const interval = setInterval(checkLevel, 5000);
        return () => clearInterval(interval);
    }, []);
}
