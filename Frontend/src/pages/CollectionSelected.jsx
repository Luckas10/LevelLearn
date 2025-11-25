import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import InfoPanel from "../components/Study/FlashCards/Collection/InfoPanel";
import "./CollectionSelected.css";
import { useParams } from "react-router-dom";

export function CollectionSelected() {
    const { id } = useParams();

    return (
        <div className="collectionSelected-page">
            <Sidebar />
                <section className="collectionSelected">
                    <Navbar />
                    <InfoPanel />
                </section>
        </div>
    )
}