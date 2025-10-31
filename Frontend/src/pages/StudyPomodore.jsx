import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./StudyPomodore.css";

export function StudyPomodore() {
    return (
        <div className="studyPomodore-page">
            <Sidebar />
            <section className="studyPomodore">
                <Navbar />
                <h1>Study Pomodore Page</h1>
                <p>Study with pomodore method in this page.</p>
            </section>
        </div>
    );
}