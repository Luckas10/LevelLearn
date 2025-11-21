import api from "./api";

export async function createCollection(data) {
  try {
    const response = await api.post("/decks", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar coleção:", error);
    throw error;
  }
}

export async function getCollections() {
  try {
    const response = await api.get("/decks");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar coleções:", error);
    throw error;
  }
}