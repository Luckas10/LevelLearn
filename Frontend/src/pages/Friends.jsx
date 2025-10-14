import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./Friends.css";

export function Friends() {
    return (
        <div className="friends-page">
            <Sidebar />
            <section className="friends">
                <Navbar />
                <h1>Friends Page</h1>
                <p>This is where users can manage and view their friends list.</p>
            </section>
        </div>
    );
}