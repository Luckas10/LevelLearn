import { useState } from "react";

export default function StudyTabs() {
  const [selected, setSelected] = useState("COLEÇÃO");

  return (
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
  );
}