import Navbar from "../components/Navbar";
import "./Study.css";

export function Study() {
    return (
        <div className="study-page">
            <Navbar />
            <section>
                <h1>Study Page</h1>
                <p>This is where users can access study materials and resources.</p>
            </section>
        </div>
    );
}