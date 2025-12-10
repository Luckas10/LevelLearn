// src/services/flashcards.js
import api from "./api";

export async function sendSessionResult(body) {
    // body = { deck_id, correct, total, elapsed_minutes }
    const { data } = await api.post("/flashcards/session-result", body);
    return data;
}
