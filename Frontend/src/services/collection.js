import api from "./api";
import { getDataUser } from "./auth";
import { getMyFriends } from "./friends";

export async function createCollection(data) {
    const { data: responseData } = await api.post("/decks", data);
    return responseData;
}

export async function getCollections() {
    const { data } = await api.get("/decks");
    return data; // <-- data é um array de decks
}

export async function getCollectionsWithoutMe() {
    const collections = await getCollections();
    const dataUser = await getDataUser();

    // retorna somente coleções cujo owner_id é diferente do usuário logado
    const filtered = collections.filter(
        (collection) => collection.owner_id !== dataUser.id
    );

    return filtered;
}

export async function getCollectionById(id) {
    const { data } = await api.get(`/decks/${id}`);
    return data;
}

export async function getCollectionByOwnerId() {
    const collections = await getCollections();
    const dataUser = await getDataUser();

    const filteredData = collections.filter(
        (collection) => collection.owner_id === dataUser.id
    );

    return filteredData;
}

export async function deleteCollection(id) {
    const { data } = await api.delete(`/decks/${id}`)
    return data;
}

export async function updateCollection(id, data) {
    const { data: responseData } = await api.put(`/decks/${id}`, data);
    return responseData;
}
// ==> NOVA VERSÃO CORRETA
export async function getCollectionsByFriends() {
    // busca decks e amigos em paralelo
    const [collections, friends] = await Promise.all([
        getCollections(),
        getMyFriends(),
    ]);

    // friends vem como array de usuários:
    // [{ id, username, email, ... }, ...]
    const friendIds = friends.map((friend) => friend.id);

    // pega apenas os decks cujo owner_id é um dos ids dos amigos
    const data = collections.filter((collection) =>
        friendIds.includes(collection.owner_id)
    );

    return data;
}
