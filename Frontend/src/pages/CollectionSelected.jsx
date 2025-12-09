// CollectionSelected.jsx
import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import InfoPanel from "../components/Study/FlashCards/Collection/InfoPanel";
import CreateCard from "../components/Study/FlashCards/Collection/CreateCard";
import { getCollectionById } from "../services/collection";
import { getDataUser } from "../services/auth";
import "./CollectionSelected.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function CollectionSelected() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [deck, user] = await Promise.all([
                    getCollectionById(id),
                    getDataUser(),
                ]);

                // 🔒 se o deck NÃO é do usuário logado, não pode abrir essa tela
                if (deck.owner_id !== user.id) {
                    navigate(`/study/flashcards/anotherselected/${id}`, {
                        replace: true,
                    });
                    return;
                }

                setCollection(deck);
            } catch (err) {
                console.error(err);
                // se der erro (404, etc.) volta pra lista
                navigate("/study/flashcards", { replace: true });
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id, navigate]);

    if (loading) {
        return <div className="collectionSelected-page">Carregando...</div>;
    }

    if (!collection) {
        return null;
    }

    return (
        <div className="collectionSelected-page">
            <Sidebar />
            <section className="collectionSelected">
                <Navbar />

                <div className="collectionSelected-top">
                    <InfoPanel
                        name={collection.name}
                        description={collection.description}
                        cover={collection.cover_name}
                    />
                </div>

                <div className="collectionSelected-bottom">
                    <CreateCard />
                </div>
            </section>
        </div>
    );
}
