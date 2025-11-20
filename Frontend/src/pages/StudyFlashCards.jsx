import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import StudyTabs from "../components/Study/FlashCards/Tabs";
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
