import api from "./api";

export async function getUserByID(id) {
    const { data } = await api.get(`/users/${id}`);
    return data;
}