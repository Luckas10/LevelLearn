import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StudyTabs from "../components/StudyFlashCards/StudyTabs";
import "./StudyFlashCards.css";

export function StudyFlashCards() {
    return (
        <div className="studyFlashCards-page">
            <Sidebar />
            <section className="studyFlashCards">
                <Navbar />
                <StudyTabs />
            </section>
        </div>
    );
}
