import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./Home.css";

export function Home() {
    return (
        <div className="home-page">
            <Sidebar />
            <section className="home">
                <Navbar />
                <h1>Welcome to LevelLearn</h1>
                <p>Your journey to mastering new skills starts here.</p>
                <a href="/login" className="btn">Get Started</a>
            </section>
        </div>
    );
}