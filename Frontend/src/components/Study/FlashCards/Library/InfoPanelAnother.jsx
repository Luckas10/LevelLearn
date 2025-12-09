export default function InfoPanelAnother({ description, name, cover }) {
    return (
        <div className="infoPanelContainer">
            {/* TOPO: CAPA + BOTÃO JOGAR */}
            <div>
                <div className="cover">
                    <img src={cover} className="coverImage" />
                    <h1>{name}</h1>
                </div>
                <div className="descriptionCollection">
                    <h1 className="collectionTitle">{name}</h1>
                    <p className="collectionDescription">{description}</p>
                </div>
            </div>
        </div>
    );
}
