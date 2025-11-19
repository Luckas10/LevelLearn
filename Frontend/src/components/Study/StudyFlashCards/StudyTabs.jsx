// StudyTabs.jsx
import { useState } from "react";
import Tabs from "../../General/Tabs"; // ajuste o caminho conforme sua estrutura
import StudyCollection from "./StudyCollection";
// import StudyLibrary from "./StudyLibrary"; // quando existir

export default function StudyTabs() {
  const [selected, setSelected] = useState("COLEÇÃO");

  const tabOptions = [
    { value: "COLEÇÃO", label: "Coleção" },
    { value: "BIBLIOTECA", label: "Biblioteca" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Tabs options={tabOptions} selected={selected} onChange={setSelected} />

      {selected === "COLEÇÃO" && <StudyCollection />}
      {/* {selected === "BIBLIOTECA" && <StudyLibrary />} */}
    </div>
  );
}
