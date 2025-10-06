import Navbar from "../components/Navbar";
import "./Friends.css";

export function Friends() {
    return (
        <div className="friends-page">
            <Navbar />
            <section>
                <h1>Friends Page</h1>
                <p>This is where users can manage and view their friends list.</p>
            </section>
        </div>
    );
}