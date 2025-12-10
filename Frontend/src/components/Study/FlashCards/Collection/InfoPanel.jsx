// InfoPanel.jsx
import { StartButton } from "./StartButton.jsx";

export default function InfoPanel({ id, description, name, cover }) {
  return (
    <div className="infoPanelContainer">
      {/* TOPO: CAPA + BOTÃO JOGAR */}
      <div>
        <div className="cover">
          <img src={cover} className="coverImage" />
          <h1>{name}</h1>
        </div>

        <div className="playButtonWrapper">
          
          <div className="descriptionCollection">
            <h1 className="collectionTitle">{name}</h1>
            <p className="collectionDescription">{description}</p>
          </div>

          <StartButton to={`/study/battleflashcards/${id}`} />
        </div>
      </div>
    </div>
  );
}
