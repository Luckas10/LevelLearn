import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

export function PlayButton() {
    
    return(
        <div className="startButtonContainer">
            <button className="startButton">
                <FontAwesomeIcon size="4x" icon={faPlay} /> 
                <p style={{fontSize: "xx-large"}}>JOGAR</p>
            </button>
        </div>
    )
}