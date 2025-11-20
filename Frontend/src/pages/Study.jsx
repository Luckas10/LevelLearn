import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import "./Study.css";
import { StudyHeader, StudyCardsContainer } from "../components/Study";

export function Study() {
    return (
        <div className="study-page">
            <Sidebar />
            <section className="content">
                <Navbar />
                <StudyHeader />
                <StudyCardsContainer />
            </section>
        </div>
    );
}
