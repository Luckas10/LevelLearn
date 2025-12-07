import { useEffect, useState } from "react";
import StudyCreateCollection from "./CreateCollection";
import StudyInteractiveCard from "./InteractiveCard";
import { getCollectionByOwnerId } from "../../../services/collection";

export default function StudyCollection() {
  const [collections, setCollections] = useState([]);

  const loadCollections = async () => {
    const data = await getCollectionByOwnerId();
    setCollections(data);
    console.log(data);
  };

  useEffect(() => {
    loadCollections();
  }, []);

  return (
    <div className="studyCollection-page">
      <StudyCreateCollection onSave={loadCollections} />

      <div className="studyCollection">
        {collections.map((c, i) => (
          <StudyInteractiveCard 
            className="collectionContainer" 
            key={i} 
            image={c.cover_name} 
            to={`/study/flashcards/selected/${c.id}`} 
            title={c.name}
            onEdit={() => console.log("Editar")}
            onDelete={() => console.log("Excluir")}
            />
        ))}
      </div>
    </div>
  );
}
