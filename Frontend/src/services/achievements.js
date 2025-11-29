import api from "./api";

export async function getAchievementsUser() {
    const { data } = await api.get("/achievements/me");
    return data; // ex.: [{ id, name, description, image_path }, ...]
}

export async function getAchievementsByUserID(user_id) {
    const { data } = await api.get(`/achievements/user/${user_id}`);
    return data; // ex.: [{ id, name, description, image_path }, ...]
}
