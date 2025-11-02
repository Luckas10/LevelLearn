import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function StudyCreateCollection() {
    return (
        <div className="studyCreateCollection">
            <button className="createCollection-btn">
                <FontAwesomeIcon size="lg" icon={faPlus} />
                <p>CRIAR COLEÇÃO</p>
            </button>
        </div>
    )
}

