import api from "./api";

export async function createCollection(data) {
    const { data: responseData } = await api.post("/decks", data);
    return responseData; 
}

export async function getCollections() {
    const { data } = await api.get("/decks");
    return data;
}

export async function getCollectionById(id) {
    const { data } = await api.get(`/decks/${id}`);
    return data;
}