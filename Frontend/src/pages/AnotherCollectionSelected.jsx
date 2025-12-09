// AnotherCollectionSelected.jsx
import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import InfoPanelAnother from "../components/Study/FlashCards/Library/InfoPanelAnother";
import GridCard from "../components/Study/FlashCards/Library/GridCard";
import { getCollectionById } from "../services/collection";
import { getDataUser } from "../services/auth";
import "./AnotherCollectionSelected.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function AnotherCollectionSelected() {
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

                // se o deck for MEU, manda pra tela de dono
                if (deck.owner_id === user.id) {
                    navigate(`/study/flashcards/selected/${id}`, {
                        replace: true,
                    });
                    return;
                }

                setCollection(deck);
            } catch (err) {
                console.error(err);
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
                    <InfoPanelAnother
                        name={collection.name}
                        description={collection.description}
                        cover={collection.cover_name}
                        collection={collection}
                    />
                </div>

                <div className="collectionSelected-bottom">
                    <GridCard />
                </div>
            </section>
        </div>
    );
}
