import api from "./api";
import { getDataUser } from "./auth";

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

export async function getCollectionByOwnerId() {
    const dataCollecntions = await getCollections();
    const dataUser = await getDataUser();
    const filteredData = dataCollecntions.filter((collection) => collection.owner_id === dataUser.id);
    return filteredData;
}