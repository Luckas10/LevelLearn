import StudyCreateCollection from "./StudyCreateCollection";
import StudyInteractiveCard from "./StudyInteractiveCard";
import flashcardsimg from "../../assets/Flashcards-img.png";

export default function StudyCollection() {
  const containers = Array.from({ length: 18}); // 12 containers

  return (
    <div className="studyCollection-page">
      <StudyCreateCollection />
      <div className="studyCollection">
        {containers.map((_, index) => (
            <StudyInteractiveCard key={index} image={flashcardsimg} />
        ))}
      </div>
    </div>
  );
}

