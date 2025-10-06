import Navbar from "../components/Navbar";
import "./Profile.css";

export function Profile() {
    return (
        <div className="profile-page">
            <Navbar />
            <section>
                <h1>Profile Page</h1>
                <p>This is where user profile information will be displayed.</p>
            </section>
        </div>
    );
}