import api from "./api";

export async function createCards(data) {
    const { data: responseData } = await api.post("/cards", data);
    return responseData; 
}

export async function getCards() {
    const { data } = await api.get("/cards");
    return data;
}

export async function deleteCards(id) {
    const { data } = await api.delete(`/cards/${id}`);
    return data;
}

export async function getCardsByDeckId(deckId) {
    const { data } = await api.get(`/cards/${deckId}`);
    return data;
}