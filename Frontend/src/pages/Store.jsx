// src/pages/Store.jsx
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import StoreHeader from "../components/Store/Header";
import StoreGrid from "../components/Store/Grid";
import StoreModal from "../components/Store/Modal";
import Swal from "sweetalert2";

import "./Store.css";

import { listShopItems, buyShopItem } from "../services/shop";

export function Store() {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);

    const [items, setItems] = useState([]);
    const [ownedIds, setOwnedIds] = useState([]); // ids que o usuário já possui
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ===== CARREGAR ITENS DA API =====
    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);

                const apiItems = await listShopItems();

                // adapta o formato para o StoreGrid/Modal
                const mapped = apiItems.map((item) => {
                    // paths já vêm começando com "/", mas garantimos
                    const imgFront = item.image_front_path?.startsWith("/")
                        ? item.image_front_path
                        : `/${item.image_front_path || ""}`;

                    const imgBack = item.image_back_path?.startsWith("/")
                        ? item.image_back_path
                        : `/${item.image_back_path || ""}`;

                    return {
                        ...item,
                        id: item.id,
                        title: item.name,
                        description: item.description,
                        price: item.price,
                        currency: "coin",

                        imgFront,
                        imgBack,
                        battleImg: item.battle_back_path ?? null,

                        owned: item.owned ?? false,
                        data: { raridade: "Avatar", categoria: "Avatar" }, // placeholder
                    };
                });

                setItems(mapped);

                // já guarda os ids dos itens que o usuário possui
                const ownedFromApi = mapped
                    .filter((i) => i.owned)
                    .map((i) => i.id);
                setOwnedIds(ownedFromApi);
            } catch (err) {
                console.error("Erro ao carregar itens da loja:", err);
                setError("Não foi possível carregar os itens da loja.");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    // ===== FILTRO PELO TÍTULO (e opcionalmente esconder comprados) =====
    const filtered = useMemo(
        () =>
            items
                .filter((i) =>
                    i.title.toLowerCase().includes(query.toLowerCase())
                )
                // se quiser que itens comprados sumam da vitrine:
                .filter((i) => !i.owned),
        [items, query]
    );

    function openBuy(item) {
        setSelected(item);
    }

    function closeModal() {
        setSelected(null);
    }

    // ===== CONFIRMAR COMPRA (chama /shop/buy/{id}) =====
    async function confirmBuy(item) {
        const result = await Swal.fire({
            icon: "warning",
            title: "Confirmar compra?",
            html: `
                Você deseja comprar <b>${item.title}</b> por 
                <span style="font-weight:800;color:#ffd43b">${item.price} moedas</span>?
            `,
            showCancelButton: true,
            confirmButtonText: "Sim, comprar",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
            customClass: {
                popup: "comment-alert",
            },
        });

        if (!result.isConfirmed) return;

        try {
            // chama a API de compra
            const userItems = await buyShopItem(item.id);

            // userItems é a lista de itens do usuário => extrai os ids
            const ids = (userItems || []).map((it) => it.id);
            setOwnedIds(ids);

            // marca o item como "owned" localmente para sumir da lista
            setItems((prev) =>
                prev.map((p) =>
                    p.id === item.id ? { ...p, owned: true } : p
                )
            );

            await Swal.fire({
                icon: "success",
                title: "Compra realizada!",
                text: `Você adquiriu o item "${item.title}".`,
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error("Erro ao comprar item:", err);

            const detail =
                err?.response?.data?.detail ||
                "Não foi possível realizar a compra.";

            await Swal.fire({
                icon: "error",
                title: "Erro na compra",
                text: detail,
            });
        } finally {
            closeModal();
        }
    }

    return (
        <div className="store-page">
            <Sidebar />
            <section className="store-section">
                <Navbar />

                <div className="store">
                    <StoreHeader
                        value={query}
                        onChange={setQuery}
                        placeholder="INSIRA O NOME DO ASSUNTO"
                        buttonText="BUSCAR"
                    />

                    {loading && (
                        <p style={{ color: "#fff", marginTop: "2rem" }}>
                            Carregando itens da loja...
                        </p>
                    )}

                    {error && !loading && (
                        <p style={{ color: "#f87171", marginTop: "2rem" }}>
                            {error}
                        </p>
                    )}

                    {!loading && !error && (
                        <StoreGrid
                            items={filtered}
                            onBuy={openBuy}
                            ownedIds={ownedIds}
                            emptyText={
                                query
                                    ? "Nenhum item encontrado para sua busca."
                                    : "A loja está vazia por enquanto."
                            }
                        />
                    )}

                    <StoreModal
                        open={!!selected}
                        item={selected}
                        onClose={closeModal}
                        onConfirm={confirmBuy}
                    />
                </div>
            </section>
        </div>
    );
}

export default Store;
