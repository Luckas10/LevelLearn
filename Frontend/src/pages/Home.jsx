import Navbar from "../components/Navbar";
import "./Home.css";

export function Home() {
    return (
        <div className="home-page">
            <Navbar />
            <section className="home">
                <h1>Welcome to LevelLearn</h1>
                <p>Your journey to mastering new skills starts here.</p>
                <a href="/login" className="btn">Get Started</a>
            </section>
        </div>
    );
}