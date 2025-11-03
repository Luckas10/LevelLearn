import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function StudyCreateCollection() {
    

    return (
        <div className="studyCreateCollection">
            <button className="createCollection-btn">
                <FontAwesomeIcon size="lg" icon={faPlus} />
                <p>CRIAR COLEÇÃO</p>
            </button>

            <dialog >
                <div>
                    <h1>CRIAR COLEÇÃO</h1>
                    <input type="text" />
                    <input type="text" />
                    <div>
                        <h1>CAPA DA COLEÇÃO</h1>
                        <div>
                            <div className=""></div>
                            <div className=""></div>
                            <div className=""></div>
                            <div className=""></div>
                            <div className=""></div>
                            <div className=""></div>
                        </div>
                    </div>
                    <button></button>
                </div>
            </dialog>

        </div>
    )
}

