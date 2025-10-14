import Sidebar from "../components/Sidebar";
import "./Store.css";

export function Store() {
    return (
        <div className="store-page">
            <Sidebar />
            <section>
                <h1>Store Page</h1>
                <p>This is where users can browse and purchase items.</p>
            </section>
        </div>
    );
}