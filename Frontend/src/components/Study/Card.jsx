import { NavLink } from "react-router-dom";

export function StudyCard({ to, imgSrc, title, description, imgId }) {
    return (
        <NavLink to={to} className="study-card">
            <div className="study-img">
                <img id={imgId} src={imgSrc} alt={`${title} Image`} />
            </div>
            <div className="study-text">
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
        </NavLink>
    );
}
