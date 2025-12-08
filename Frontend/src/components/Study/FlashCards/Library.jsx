import "./Library.css";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getCollections, getCollectionsByFriends } from "../../../services/collection";
import StudyInteractiveCard from "./InteractiveCard";
import { useEffect, useState } from "react";

export default function StudyLibrary() {
    const [collections, setCollections] = useState([]);          // todas
    const [friendCollections, setFriendCollections] = useState([]); // só de amigos

    const [filterOption, setFilterOption] = useState("all");     // all | friends
    const [sortOption, setSortOption] = useState("alpha");       // alpha | newest_desc | newest_asc

    const loadCollections = async () => {
        const [allCollections, friendsDecks] = await Promise.all([
            getCollections(),
            getCollectionsByFriends(),
        ]);

        setCollections(allCollections);
        setFriendCollections(friendsDecks);
    };

    useEffect(() => {
        loadCollections();
    }, []);

    const getFilteredAndSortedCollections = () => {
        // define base (todas ou dos amigos)
        let base =
            filterOption === "friends" ? friendCollections : collections;

        let result = [...base];

        // ================================
        //  ORDENAÇÃO
        // ================================
        if (sortOption === "alpha") {
            result.sort((a, b) =>
                a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
            );
        }

        // ↓ Mais recentes (DESC) = ordem natural que veio do backend
        if (sortOption === "newest_desc") {
            // NÃO muda nada — apenas usa o array original
            result = [...base].reverse();
        }

        // ↑ Mais recentes (ASC) = array invertido
        if (sortOption === "newest_asc") {
            result = [...base];
        }

        return result;
    };

    const processedCollections = getFilteredAndSortedCollections();

    return (
        <div className="studyLibrary-page">
            <div className="librarySearch">
                <FontAwesomeIcon size="lg" icon={fas.faSearch} className="searchIcon" />
                <input
                    type="text"
                    className="searchInputLibrary"
                    placeholder="Buscar coleções"
                />
            </div>

            <div className="libraryFriendsCollections">
                <div className="libraryHeader">
                    <h2>TODAS AS COLEÇÕES</h2>

                    <div className="libraryControls">
                        {/* Filtro */}
                        <select
                            className="librarySelect filterSelect"
                            value={filterOption}
                            onChange={(e) => setFilterOption(e.target.value)}
                        >
                            <option value="all">Todas as coleções</option>
                            <option value="friends">Coleções de amigos</option>
                        </select>

                        {/* Ordenação */}
                        <select
                            className="librarySelect sortSelect"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="alpha">A–Z (alfabética)</option>

                            {/* Agora funcionando sem created_at */}
                            <option value="newest_desc">Mais recentes ↓</option>
                            <option value="newest_asc">Mais recentes ↑</option>
                        </select>
                    </div>
                </div>

                <div className="studyCollection">
                    {processedCollections.map((c) => (
                        <StudyInteractiveCard
                            className="collectionContainer"
                            key={c.id}
                            image={c.cover_name}
                            to={`/study/flashcards/selected/${c.id}`}
                            title={c.name}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
