import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
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
