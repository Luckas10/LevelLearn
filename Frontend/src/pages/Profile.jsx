import Sidebar from "../components/Sidebar";
import "./Profile.css";

export function Profile() {
    return (
        <div className="profile-page">
            <Sidebar />
            <section>
                <h1>Profile Page</h1>
                <p>This is where user profile information will be displayed.</p>
            </section>
        </div>
    );
}