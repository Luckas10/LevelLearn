import { useEffect, useState } from "react";
import StudyCreateCollection from "./CreateCollection";
import InteractiveCardCollection from "./InteractiveCardCollection";
import { getCollectionByOwnerId, deleteCollection } from "../../../services/collection";
import EditCollection from "./EditCollection";

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
        <StudyCreateCollection onSave={loadCollections} />

        <EditCollection
          open={!!editingCollection}
          initialData={editingCollection}
          onClose={() => setEditingCollection(null)}
          onSave={loadCollections}
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
            subject={c.subject}
            onEdit={() => setEditingCollection(c)}
            onDelete={handleDeleteCollection}
          />
        ))}
      </div>

    </div>
  );
}
