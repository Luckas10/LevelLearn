import flashcardsimg from "../../assets/Flashcards-img.png";
import pomodoreimg from "../../assets/Pomodore-img.png";
import { StudyCard } from "./StudyCard";

export function StudyCardsContainer() {
    return (
        <div className="cards-container">
            <StudyCard
                to="/study/flashcards"
                imgSrc={flashcardsimg}
                imgId="flashcards-img"
                title="FLASH CARDS"
                description="Cartões com perguntas e respostas usados para memorizar conteúdos por meio da repetição e prática ativa."
            />
            <StudyCard
                to="/study/pomodore"
                imgSrc={pomodoreimg}
                imgId="pomodore-img"
                title="POMODORO"
                description="Técnica que divide o foco em períodos de tempo com pausas curtas, ajudando na concentração e produtividade."
            />
        </div>
    );
}
