import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import InfoPanelAnother from "../components/Study/FlashCards/Library/InfoPanelAnother";
import GridCard from "../components/Study/FlashCards/Library/GridCard";
import { getCollectionById } from "../services/collection";
import "./AnotherCollectionSelected.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export function AnotherCollectionSelected() {
    const { id } = useParams();
    const [collection, setCollection] = useState(null);
    
    useEffect(() => {
        async function load() {
            const data = await getCollectionById(id);
            setCollection(data);
        }
        load();
    }, [id]);

    if (!collection) {
        return <div className="collectionSelected-page">Carregando...</div>
    }

    return (
        <div className="collectionSelected-page">
            <Sidebar />
            <section className="collectionSelected">
                <Navbar />

                {/* TOPO: capa, nome, descrição, botão jogar */}
                <div className="collectionSelected-top">
                    <InfoPanelAnother 
                        name={collection.name} 
                        description={collection.description} 
                        cover={collection.cover_name} 
                    />
                </div>

                {/* PARTE DE BAIXO: grid de flashcards */}
                <div className="collectionSelected-bottom">
                    <GridCard />
                </div>
            </section>
        </div>
    );
}
