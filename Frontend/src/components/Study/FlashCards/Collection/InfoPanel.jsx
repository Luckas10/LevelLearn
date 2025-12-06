import { PlayButton } from "./StartButton.jsx";

export default function InfoPanel({ description, name, cover }) {

    return (
        <div className="infoPanelContainer">
            <div className="infoPanel">

                {/* Imagem + botão juntos no celular */}
                <div className="coverAndButton">
                    <div className="cover">
                        <img src={cover} className="coverImage" />
                        <h1>{name}</h1>
                    </div>

                    <div className="mobilePlayButton">
                        <PlayButton />
                    </div>
                </div>

                <div className="descriptionCollectionContainer">
                    <div className="descriptionCollection">
                        <h1 className="collectionTitle">{name}</h1>
                        <p style={{textAlign: "justify", fontSize: "1.2rem", marginTop: "1rem"}}>{description}</p>
                    </div>
                </div>
            </div>

            {/* No desktop: botão continua no canto direito */}
            <div className="desktopPlayButton">
                <PlayButton />
            </div>
        </div>
    );
}
