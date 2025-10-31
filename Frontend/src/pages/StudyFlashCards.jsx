import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./StudyFlashCards.css";

export function StudyFlashCards() {
    return (
        <div className="studyFlashCards-page">
            <Sidebar />
            <section className="studyFlashCards">
                <Navbar />
                <h1>Study FlashCards Page</h1>
                <p>Study with flash cards method in this page.</p>
            </section>
        </div>
    );
}