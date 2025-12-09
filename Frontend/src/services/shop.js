// src/services/shop.js
import api from "./api";

// GET /shop – lista todos os itens disponíveis
export async function listShopItems() {
    const { data } = await api.get("/shop");
    // data: [{ id, name, description, price, image_path }, ...]
    return data;
}

// POST /shop/buy/{item_id} – compra item
export async function buyShopItem(itemId) {
    const { data } = await api.post(`/shop/buy/${itemId}`);
    // data: lista de itens do usuário
    return data;
}
