import { PlayButton } from "./StartButton.jsx";


export default function InfoPanel({ description, name, cover,  }) {

    return (
        <div className="infoPanelContainer">
            <div className="infoPanel">
                <div className="cover">
                    <img src={cover} style={{width: "20rem", height: "18rem"}}/>
                    <h1>{name}</h1>
                </div>
                <div className="descriptionCollectionContainer">
                    <div className="descriptionCollection">
                        <h1 className="collectionTitle">{name}</h1>
                        <p style={{textAlign: "justify", fontSize: "1.2rem", marginTop: "1rem"}}>{description}</p>
                    </div>
                </div>
            </div>
            <PlayButton />
        </div>
    );
}

