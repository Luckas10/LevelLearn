import Sidebar from "../components/Sidebar";
import "./Friends.css";

export function Friends() {
    return (
        <div className="friends-page">
            <Sidebar />
            <section>
                <h1>Friends Page</h1>
                <p>This is where users can manage and view their friends list.</p>
            </section>
        </div>
    );
}