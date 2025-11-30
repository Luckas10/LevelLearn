import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import InfoPanel from "../components/Study/FlashCards/Collection/InfoPanel";
import CreateCard from "../components/Study/FlashCards/Collection/CreateCard";
import { getCollectionById } from "../services/collection";
import "./CollectionSelected.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export function CollectionSelected() {
    const { id } = useParams();
    const [collection, setCollection] = useState(null);
    
    useEffect(() => {
        async function load() {
            const data = await getCollectionById(id);
            setCollection(data);
        }
        load();
    }, [id]);

    // ⛔ Impede erro: collection ainda é null no início
    if (!collection) {
        return <div className="collectionSelected-page">Carregando...</div>
    }

    return (
        <div className="collectionSelected-page">
            <Sidebar />
                <section className="collectionSelected">
                    <Navbar />
                    <InfoPanel 
                        name={collection.name} 
                        description={collection.description} 
                        cover={collection.cover_name} 
                    />
                    <CreateCard />
                </section>
        </div>
    )
}
