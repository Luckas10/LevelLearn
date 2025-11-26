import api from "./api";

export async function sendFriendRequest(friendId) {
    try {
        const res = await api.post(`/friends/request/${friendId}`);
        return res.data;
    } catch (error) {
        console.error("Erro ao enviar solicitação de amizade:", error);
        throw error;
    }
}

export async function acceptFriendRequest(requestId) {
    try {
        const res = await api.post(`/friends/accept/${requestId}`);
        return res.data;
    } catch (error) {
        console.error("Erro ao aceitar solicitação:", error);
        throw error;
    }
}

export async function rejectFriendRequest(requestId) {
    try {
        const res = await api.delete(`/friends/reject/${requestId}`);
        return res.data;
    } catch (error) {
        console.error("Erro ao recusar solicitação:", error);
        throw error;
    }
}

export async function getReceivedRequests() {
    try {
        const res = await api.get("/friends/requests/received");
        return res.data;
    } catch (error) {
        console.error("Erro ao carregar solicitações recebidas:", error);
        throw error;
    }
}

export async function getSentRequests() {
    try {
        const res = await api.get("/friends/requests/sent");
        return res.data;
    } catch (error) {
        console.error("Erro ao carregar solicitações enviadas:", error);
        throw error;
    }
}

export async function getMyFriends() {
    try {
        const res = await api.get("/friends/my_friends");
        return res.data;
    } catch (error) {
        console.error("Erro ao carregar lista de amigos:", error);
        throw error;
    }
}

export async function removeFriend(friendId) {
    try {
        const res = await api.delete(`/friends/remove/${friendId}`);
        return res.data;
    } catch (error) {
        console.error("Erro ao remover amigo:", error);
        throw error;
    }
}

/**
 * 🚫 IDs que NÃO podem aparecer na aba de adicionar amigos:
 * - Você mesmo
 * - Quem você já é amigo
 * - Quem você já mandou solicitação
 * - Quem te mandou solicitação
 */
export async function getUnavailableFriendIds() {
    try {
        const res = await api.get("/friends/unavailable_ids");
        return res.data; // array de IDs bloqueados
    } catch (error) {
        console.error("Erro ao buscar usuários indisponíveis:", error);
        throw error;
    }
}
