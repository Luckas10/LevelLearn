// src/services/notifications.js
import Swal from "sweetalert2";

// Base de toast do LevelLearn
const baseToast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3200,
    timerProgressBar: true,

    // PERMITE VÁRIOS TOASTS SIMULTÂNEOS
    allowDuplicates: true,

    showClass: {
        popup: "swal2-animate-toast-in",
    },
    hideClass: {
        popup: "swal2-animate-toast-out",
    },
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

// === FUNÇÕES GENÉRICAS ===
export function showSuccessToast(title, options = {}) {
    return baseToast.fire({
        icon: "success",
        title,
        ...options,
    });
}

export function showErrorToast(title, options = {}) {
    return baseToast.fire({
        icon: "error",
        title,
        ...options,
    });
}

export function showInfoToast(title, options = {}) {
    return baseToast.fire({
        icon: "info",
        title,
        ...options,
    });
}

// === FUNÇÕES ESPECÍFICAS DO JOGO ===
export function showWelcomeToast(username) {
    return showSuccessToast(
        username ? `Bem-vindo, ${username} 👋` : "Bem-vindo 👋"
    );
}

export function showLevelUpToast(newLevel) {
    return showSuccessToast("Level up! 🎉", {
        text: `Você alcançou o nível ${newLevel}!`,
    });
}

export function showAchievementToast(achievementName) {
    return showSuccessToast("Conquista desbloqueada! 🏅", {
        text: achievementName,
    });
}

// ✅ Modal de sucesso ao registrar
export function showRegisterSuccessModal() {
    return Swal.fire({
        icon: "success",
        title: "Conta criada!",
        text: "Seus dados já estão preenchidos, é só entrar!",
        confirmButtonText: "Ir para o login",
    });
}

// Para erros “sérios” que precisam de modal central (não toast)
export function showErrorModal(title, message) {
    return Swal.fire({
        icon: "error",
        title,
        text: message,
    });
}
