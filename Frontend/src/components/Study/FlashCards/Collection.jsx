import { useEffect, useState, useMemo } from "react";
import StudyCreateCollection from "./CreateCollection";
import InteractiveCardCollection from "./InteractiveCardCollection";
import {
  getCollectionByOwnerId,
  deleteCollection,
} from "../../../services/collection";
import EditCollection from "./EditCollection";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function StudyCollection() {
  const [collections, setCollections] = useState([]);
  const [editingCollection, setEditingCollection] = useState(null);

  // busca
  const [searchTerm, setSearchTerm] = useState("");

  // filtros
  const [filterSubject, setFilterSubject] = useState("all"); // matéria
  const [sortOption, setSortOption] = useState("alpha");

  const loadCollections = async () => {
    const data = await getCollectionByOwnerId();
    setCollections(data);
  };

  const handleDeleteCollection = async (id) => {
    await deleteCollection(id);
    loadCollections();
  };

  useEffect(() => {
    loadCollections();
  }, []);

  // ============= GERAR LISTA DE MATÉRIAS (sem duplicar) =============
  const subjects = useMemo(() => {
    const list = collections
      .map((c) => c.subject)
      .filter((s) => s && s.trim() !== "");

    // eliminar duplicadas
    return ["all", ...new Set(list)];
  }, [collections]);

  // ============= FILTRAR + BUSCAR + ORDENAR =============
  const getProcessedCollections = () => {
    let result = [...collections];

    const term = searchTerm.trim().toLowerCase();

    // filtro por busca
    if (term) {
      result = result.filter((c) => {
        const nameMatch = c.name?.toLowerCase().includes(term);
        const subjectMatch = c.subject?.toLowerCase().includes(term);
        return nameMatch || subjectMatch;
      });
    }

    // filtro por matéria
    if (filterSubject !== "all") {
      result = result.filter((c) => c.subject === filterSubject);
    }

    // ordenação
    if (sortOption === "alpha") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
      );
    }

    if (sortOption === "newest_desc") {
      result = [...result].reverse();
    }

    return result;
  };

  const processedCollections = getProcessedCollections();

  return (
    <div className="studyCollection-page">
      {/* Modal de editar */}
      <EditCollection
        open={!!editingCollection}
        initialData={editingCollection}
        onClose={() => setEditingCollection(null)}
        onSave={loadCollections}
      />

      {/* 🔍 Barra de Busca */}
      <div className="librarySearch">
        <FontAwesomeIcon size="lg" icon={fas.faSearch} className="searchIcon" />
        <input
          type="text"
          className="searchInputLibrary"
          placeholder="Buscar coleções"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="libraryFriendsCollections">
        <div className="libraryHeader">
          <h2>MINHAS COLEÇÕES</h2>

          {/* ====== CONTROLES (Matéria + Ordenação) ====== */}
          <div className="libraryControls">

            {/* FILTRAR POR MATÉRIA */}
            <select
              className="librarySelect filterSelect"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj === "all" ? "Todas as matérias" : subj}
                </option>
              ))}
            </select>

            {/* ORDENAR */}
            <select
              className="librarySelect sortSelect"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="alpha">A–Z (alfabética)</option>
              <option value="newest_desc">Mais recentes ↓</option>
              <option value="newest_asc">Mais recentes ↑</option>
            </select>
          </div>
        </div>

        {/* Botão Criar */}
        <StudyCreateCollection onSave={loadCollections} />

        {/* GRID */}
        <div className="studyCollection">
          {processedCollections.map((c) => (
            <InteractiveCardCollection
              className="collectionContainer"
              key={c.id}
              id={c.id}
              image={c.cover_name}
              title={c.name}
              subject={c.subject}
              to={`/study/flashcards/selected/${c.id}`}
              onEdit={() => setEditingCollection(c)}
              onDelete={handleDeleteCollection}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
