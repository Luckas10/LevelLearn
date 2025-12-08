import { useEffect, useState } from "react";
import StudyCreateCollection from "./CreateCollection";
import InteractiveCardCollection from "./InteractiveCardCollection";
import { getCollectionByOwnerId } from "../../../services/collection";
import { deleteCollection } from "../../../services/collection";

export default function StudyCollection() {
  const [collections, setCollections] = useState([]);
  const [editingCollection, setEditingCollection] = useState(null);

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

  return (
    <div className="studyCollection-page">

      {/* Modal de criar coleção */}
      <StudyCreateCollection 
        onSave={() => {
          loadCollections();
          setEditingCollection(null); // fecha o modal depois
        }}
        editMode={!!editingCollection}
        initialData={editingCollection} 
        />


      <div className="studyCollection">
        {collections.map((c, i) => (
          <InteractiveCardCollection
            className="collectionContainer"
            id={c.id}
            key={i}
            image={c.cover_name}
            to={`/study/flashcards/selected/${c.id}`}
            title={c.name}
            onEdit={() => setEditingCollection(c)}
            onDelete={handleDeleteCollection}
          />
        ))}
      </div>

    </div>
  );
}
