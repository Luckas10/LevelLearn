import Navbar from "../components/Navbar";
import flashcardsimg from "../assets/Flashcards-img.png";
import pomodoreimg from "../assets/Pomodore-img.png"
import "./Study.css";

export function Study() {
    return (
        <div className="study-page">
            <Navbar />
            <section>
                <div className="flashcards-container">
                    <div id="flashcards-img"><img src={flashcardsimg} alt="Flashcards Image" /></div>
                    <div>
                        <h1>FLASH CARDS</h1>
                    </div>
                </div>
                <div className="pomodore-container">
                    <div id="pomodore-img"><img src={pomodoreimg} alt="Pomodore Image" /></div>
                    <div>
                        <h1>POMODORO</h1>
                    </div>
                </div>
            </section>
        </div>
    );
}