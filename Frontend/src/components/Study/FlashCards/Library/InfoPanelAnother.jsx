import { CopyButton } from "./CopyButton";

export default function InfoPanelAnother({ collection, description, name, cover }) {
    // se quiser recarregar listas após copiar:
        const handleCopied = (newCollection) => {
    // por exemplo: mostrar a nova coleção no perfil, ou forçar reload de coleções
    // loadMyCollections();
    };
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
                    <CopyButton collection={collection} onCopied={handleCopied} />
                </div>
            </div>
        </div>
    );  
}
