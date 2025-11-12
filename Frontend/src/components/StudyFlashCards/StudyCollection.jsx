import StudyCreateCollection from "./StudyCreateCollection";
import StudyInteractiveCard from "./StudyInteractiveCard";
import flashcardsimg from "../../assets/CoverImages/fisica.svg";
import { NavLink } from "react-router-dom";

export default function StudyCollection() {
  const containers = Array.from({ length: 12 }); // 12 containers

  return (
    <div className="studyCollection-page">
      <StudyCreateCollection />

      <NavLink to="/battleflashcards" end>
        <div className="studyCollection">
          {containers.map((_, index) => (
            <StudyInteractiveCard key={index} image={flashcardsimg} />
          ))}
        </div>
      </NavLink>
    </div>
  );
}

