import { useEffect, useRef } from "react";
import api from "../services/api";
import { showAchievementToast } from "../services/notifications";

export function useAchievementWatcher() {
    const previousAchievements = useRef(null);
    const isChecking = useRef(false); // evita rodar 2 checks ao mesmo tempo

    useEffect(() => {
        async function checkAchievements() {
            // evita múltiplas execuções concorrentes se a API demorar
            if (isChecking.current) return;
            isChecking.current = true;

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    // se o usuário deslogar, limpamos tudo
                    previousAchievements.current = null;
                    isChecking.current = false;
                    return;
                }

                const { data } = await api.get("/achievements/me");

                // Primeira execução: apenas registrar lista
                if (!previousAchievements.current) {
                    previousAchievements.current = data;
                    isChecking.current = false;
                    return;
                }

                // Achievements antigos
                const oldIds = new Set(previousAchievements.current.map(a => a.id));

                // Achievements novos
                const newOnes = data.filter(a => !oldIds.has(a.id));

                // Exibir toast somente dos novos
                for (const ach of newOnes) {
                    showAchievementToast(ach.name);
                }

                // Atualizar cache local
                previousAchievements.current = data;

            } catch (err) {
                console.error("[AchievementWatcher] Erro ao verificar conquistas:", err);
            } finally {
                isChecking.current = false;
            }
        }

        // checar a cada 5s
        const interval = setInterval(checkAchievements, 5000);

        return () => clearInterval(interval);
    }, []);
}
