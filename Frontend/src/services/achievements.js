import api from "./api";

export async function getAchievementsUser() {
    const { data } = await api.get("/achievements/me");
    return data; // ex.: [{ id, name, description, image_path }, ...]
}
