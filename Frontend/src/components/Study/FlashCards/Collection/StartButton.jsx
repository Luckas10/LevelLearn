import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

export function PlayButton({to}) {
  return (
    <NavLink to={to} className="startButtonContainer">
      <button className="startButton">
        <FontAwesomeIcon className="startButtonIcon" size="4x" icon={faPlay} />
        <p className="startButtonText" style={{ fontSize: "xx-large" }}>
          JOGAR
        </p>
      </button> 
    </NavLink>
  );
}
