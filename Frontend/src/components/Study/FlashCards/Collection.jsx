import StudyCreateCollection from "./CreateCollection";
import StudyInteractiveCard from "./InteractiveCard";
import flashcardsimg from "/CoverImages/fisica.svg";
import { NavLink } from "react-router-dom";

export default function StudyCollection() {
  const containers = Array.from({ length: 14 }); // 12 containers

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

