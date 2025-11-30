import api from "./api";

export async function sendFriendRequest(friendId) {
    try {
        const res = await api.post(`/friends/request/${friendId}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export async function acceptFriendRequest(requestId) {
    try {
        const res = await api.post(`/friends/accept/${requestId}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export async function rejectFriendRequest(requestId) {
    try {
        const res = await api.delete(`/friends/reject/${requestId}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export async function getReceivedRequests() {
    try {
        const res = await api.get("/friends/requests/received");
        return res.data;
    } catch (error) {
        throw error;
    }
}

export async function getSentRequests() {
    try {
        const res = await api.get("/friends/requests/sent");
        return res.data;
    } catch (error) {
        throw error;
    }
}

export async function getMyFriends() {
    try {
        const res = await api.get("/friends/my_friends");
        return res.data;
    } catch (error) {
        throw error;
    }
}

export async function getFriendsOfUser(user_id) {
    try {
        const res = await api.get(`/friends/user/${user_id}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

export async function removeFriend(friendId) {
    try {
        const res = await api.delete(`/friends/remove/${friendId}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

// IDS para não aparecer nas abas da página de adicionar amigos
// O proprio usuario, usuarios já adicionados, usuários a quem enviou/recebeu solicitação
export async function getUnavailableFriendIds() {
    try {
        const res = await api.get("/friends/unavailable_ids");
        return res.data; // array de IDs bloqueados
    } catch (error) {
        throw error;
    }
}
