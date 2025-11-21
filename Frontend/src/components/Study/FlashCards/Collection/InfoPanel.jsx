import { PlayButton } from "./StartButton.jsx";
import fisica from "/CoverImages/fisica.svg"

export default function InfoPanel() {

    return (
        <div className="infoPanelContainer">
            <div className="infoPanel">
                <div className="cover">
                    <img src={fisica} style={{width: "20rem", height: "18rem"}}/>
                    <h1>Física</h1>
                </div>
                <div className="descriptionCollectionContainer">
                    <div className="descriptionCollection">
                        <h1 className="collectionTitle">Física</h1>
                        <p style={{textAlign: "justify", fontSize: "1.2rem", marginTop: "1rem"}}>Lorem ipsum dolor sit amet amet consectetur adipisicing elit.amet consectetur adipisicing elit. consectetur adipisicing elit. Tempore consectetur esse molestias. Provident, accusamus vitae! Quo ab quidem, cum magni corrupti libero hic iste aspernatur? Iste corporis molestiae velit officiis?   
                        </p>
                    </div>
                </div>
            </div>
            <PlayButton />
        </div>
    );
}

