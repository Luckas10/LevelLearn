import { useEffect, useState } from "react";
import StudyCreateCollection from "./CreateCollection";
import StudyInteractiveCard from "./InteractiveCard";
import { getCollections } from "../../../services/collection";
import { useParams } from "react-router-dom";

export default function StudyCollection() {
  const { id } = useParams()
  const [collections, setCollections] = useState([]);

  const loadCollections = async () => {
    const data = await getCollections();
    setCollections(data);
  };

  useEffect(() => {
    loadCollections();
  }, []);

  return (
    <div className="studyCollection-page">
      <StudyCreateCollection onSave={loadCollections} />

      <div className="studyCollection">
        {collections.map((c, i) => (
          <StudyInteractiveCard key={i} image={c.cover_name} to="/study/flashcards/selected/{id}" />
        ))}
      </div>
    </div>
  );
}
