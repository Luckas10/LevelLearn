import Sidebar from "../components/General/Sidebar";
import Navbar from "../components/General/Navbar";
import Information from "../components/Study/FlashCards/Collection/InfoPanel";
import "./CollectionSelected.css";

export function CollectionSelected() {
    
    return (
        <div className="collectionSelected-page">
            <Sidebar />
                <section className="collectionSelected">
                    <Navbar />
                    <Information />
                </section>
        </div>
    )
}