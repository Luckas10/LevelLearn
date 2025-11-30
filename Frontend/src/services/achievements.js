import api from "./api";

export async function getAchievementsUser() {
    try {
        const { data } = await api.get("/achievements/me");
        return data;
    } catch {
        return undefined;
    }
}

export async function getAchievementsByUserID(user_id) {
    try {
        const { data } = await api.get(`/achievements/user/${user_id}`);
        return data;
    } catch {
        return undefined;
    }
}
