import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import flashcardsimg from "../assets/Flashcards-img.png";
import pomodoreimg from "../assets/Pomodore-img.png"
import "./Study.css";

export function Study() {
    return (
        <div className="study-page">
            <Sidebar />
            <section className="content">
                <Navbar />
                <h1>ESCOLHA SEU MÉTODO DE ESTUDO</h1>
                <div className="cards-container">
                    <div className="study-card">
                        <div className="study-img"><img id="flashcards-img" src={flashcardsimg} alt="Flashcards Image" /></div>
                        <div className="study-text">
                            <h1>FLASH CARDS</h1>
                            <p>Cartões com perguntas e respostas usados para memorizar conteúdos por meio da repetição e prática ativa.</p>
                        </div>
                    </div>
                    <div className="study-card" id="pomodoro-card">
                        <div className="study-img">
                            <img id="pomodore-img" src={pomodoreimg} alt="Pomodore Image" />
                        </div>
                        <div className="study-text">
                            <h1>POMODORO</h1>
                            <p>Técnica que divide o foco em períodos de tempo com pausas curtas, ajudando na concentração e produtividade.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}