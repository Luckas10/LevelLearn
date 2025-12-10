// deck.js
import api from "./api";

export async function getDeckById(id) {
    const { data } = await api.get(`/decks/${id}`);
    return data; // { id, name, description, cover_name, owner_id }
}

export async function getDeckCountByUserId(userId) {
    const { data } = await api.get(`/decks/owner/${userId}/count`);
    return data; // { total: X }
}
