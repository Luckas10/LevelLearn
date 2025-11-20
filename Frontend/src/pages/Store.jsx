import { useMemo, useState } from "react";
import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import StoreHeader from "../components/Store/Header";
import StoreGrid from "../components/Store/Grid";
import StoreModal from "../components/Store/Modal";

// 👇 Importando as imagens (Vite recomenda importar)
import Cobra from "../assets/Animals/Cobra.png";
import Dragao from "../assets/Animals/Dragao.png";
import Fenix from "../assets/Animals/Fenix.png";
import Gato from "../assets/Animals/Gato.png";
import Ourico from "../assets/Animals/Ourico.png";
import Raposa from "../assets/Animals/Raposa.png";
import "./Store.css";

export function Store() {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null); // item selecionado para modal

    // EXEMPLO: se ainda não tiver costas, use a mesma imagem nas duas props
    const items = useMemo(
        () => [
            {
                id: 1,
                title: "Cobra — Guardiã da Biblioteca",
                price: 250,
                currency: "coin",
                imgFront: Cobra,
                imgBack: Cobra,
                tag: "Novo",
                data: { raridade: "Raro", categoria: "Avatar" },
                description:
                    "Avatar temático da Cobra estudiosa. Aumenta seu estilo em 100%.",
            },
            {
                id: 2,
                title: "Dragão — Mestre dos Estudos",
                price: 450,
                currency: "coin",
                imgFront: Dragao,
                imgBack: Dragao,
                tag: "Lendário",
                data: { raridade: "Lendário", categoria: "Avatar" },
                description:
                    "Imponente, motiva focos épicos de estudo. Ideal para maratonas.",
            },
            {
                id: 3,
                title: "Fênix — Renascimento do Conhecimento",
                price: 380,
                currency: "coin",
                imgFront: Fenix,
                imgBack: Fenix,
                data: { raridade: "Épico", categoria: "Avatar" },
                description: "Para quem sempre volta mais forte após cada prova.",
            },
            {
                id: 4,
                title: "Gato — Curioso por Natureza",
                price: 120,
                currency: "coin",
                imgFront: Gato,
                imgBack: Gato,
                data: { raridade: "Comum", categoria: "Avatar" },
                description: "Fofo e focado. Perfeito pra sessões de leitura.",
            },
            {
                id: 5,
                title: "Ouriço — Blindado contra Procrastinação",
                price: 190,
                currency: "coin",
                imgFront: Ourico,
                imgBack: Ourico,
                data: { raridade: "Incomum", categoria: "Avatar" },
                description: "Espeta a preguiça e te mantém no trilho.",
            },
            {
                id: 6,
                title: "Raposa — Estratégia e Astúcia",
                price: 220,
                currency: "coin",
                imgFront: Raposa,
                imgBack: Raposa,
                data: { raridade: "Raro", categoria: "Avatar" },
                description: "Escolhas inteligentes em cada estudo.",
            },
        ],
        []
    );

    const filtered = items.filter((i) =>
        i.title.toLowerCase().includes(query.toLowerCase())
    );

    function openBuy(item) {
        setSelected(item);
    }
    function closeModal() {
        setSelected(null);
    }
    function confirmBuy(item) {
        // aqui você chama sua API de compra
        alert(`Comprado: ${item.title} por ${item.price} moedas (sem reembolso).`);
        closeModal();
    }

    return (
        <div className="store-page">
            <Sidebar />
            <section className="store-section page-full-content">
                <Navbar />

                <div className="store">
                    <StoreHeader
                        value={query}
                        onChange={setQuery}
                        placeholder="INSIRA O NOME DO ASSUNTO"
                        buttonText="BUSCAR"
                    />
                    <StoreGrid
                        items={filtered}
                        onBuy={openBuy}
                        emptyText={
                            query
                                ? "Nenhum item encontrado para sua busca."
                                : "A loja está vazia por enquanto."
                        }
                    />
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
