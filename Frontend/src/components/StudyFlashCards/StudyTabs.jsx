import { useState } from "react";
import StudyCollection from "./StudyCollection";

export default function StudyTabs() {
  const [selected, setSelected] = useState("COLEÇÃO");

  return (
    <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
      <div className="studyTabs">
        <div
          className={`studyTabsSelect ${selected === "COLEÇÃO" ? "active" : ""}`}
          onClick={() => setSelected("COLEÇÃO")}
        >
          COLEÇÃO
        </div>
        <div
          className={`studyTabsSelect ${selected === "BIBLIOTECA" ? "active" : ""}`}
          onClick={() => setSelected("BIBLIOTECA")}
        >
          BIBLIOTECA
        </div>
      </div>

      {selected === "COLEÇÃO" && <StudyCollection />}
      

    </div>
  );
}