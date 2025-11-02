import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StudyTabs from "../components/StudyFlashCards/StudyTabs";
import StudyCollection from "../components/StudyFlashCards/StudyCollection"
import "./StudyFlashCards.css";

export function StudyFlashCards() {
    return (
        <div className="studyFlashCards-page">
            <Sidebar />
            <section className="studyFlashCards">
                <Navbar />
                <StudyTabs />
                <StudyCollection />
            </section>
        </div>
    );
}
