import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getCollectionById } from "../../../../services/collection";
import { getCards, createCards, getCardsByDeckId } from "../../../../services/cards";
import { useParams } from "react-router-dom";
import CreateInteractiveCard from "../InteractiveCard";

export default function CreateCard({ onSave }) {
    const [flashcards, setFlashCards] = useState([]);
    const [front, setFront] = useState("")
    const [back, setBack] = useState("")    
    const [deckId, setDeckId] = useState(0)
    const dialogRef = useRef(null);
    const [open, setOpen] = useState(false);
    const { id } = useParams(); 

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);

    const handleCloseWithoutSaving = () => {
        setOpen(false);
    };

    // ---------- CARREGAR CARDS ----------

    const loadCards = async () => {
      const data = await getCardsByDeckId(deckId);
      setFlashCards(data)
    }

    useEffect(() => {
      if (deckId) loadCards();
    }, [deckId]);

    // ---------- CARREGAR O ID DA COLEÇÃO ATUAL ----------

    const loadCollections = async () => {
        const data = await getCollectionById(id);
        setDeckId(data.id);
      };
    
    useEffect(() => {
      loadCollections();
    }, [id]);


    // ---------- ABRIR E FECHAR MODAL ----------

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
    
        if (open) {
          dialog.showModal();
          dialog.classList.add("showing");
    
          requestAnimationFrame(() => {
            dialog.classList.add("visible");
          });
    
          const handleClickOutside = (event) => {
            const rect = dialog.getBoundingClientRect();
            if (
              event.clientX < rect.left ||
              event.clientX > rect.right ||
              event.clientY < rect.top ||
              event.clientY > rect.bottom
            ) {
              handleCloseWithoutSaving();
            }
          };
    
          dialog.addEventListener("click", handleClickOutside);
    
          return () => dialog.removeEventListener("click", handleClickOutside);
    
        } else {
          if (dialog.open) {
            dialog.classList.remove("visible");
            setTimeout(() => {
              dialog.classList.remove("showing");
              dialog.close();
            }, 200);
          }
        }
      }, [open]);

      // ---------- SALVAR CARD CRIADO ----------

      const handleSave = async () => {
            if (!front.trim()) {
                alert("Coloque a mensagem da frente do flashcard.");
                return;
            }

            if (!back.trim()) {
                alert("Coloque o verso do card.");
                return;
            }
        
            const newCard = {
                question: front,
                answer: back,
                deck_id: deckId
            };
        
            try {
                await createCards(newCard);
                await loadCards();
                alert("Card criado com sucesso!");
            
                setFront("");
                setBack("");
                closeModal();
        
                if (onSave) onSave();
                } catch {
                alert("Erro ao criar card");
            }
        };
    

    return (
        <div className="createCardContainer">
            <h1 style={{fontSize: "2.5rem"}}>FLASHCARDS</h1>
            <div className="cards">
                <dialog className="createCardModal" ref={dialogRef}>
                    <div className="cardModalContent">
                        <p style={{ fontWeight: "bold", fontSize: "larger" }}>CRIAR FLASHCARD</p>

                        <input
                            className="cardModalInput"
                            type="text"
                            placeholder="Frente:"
                            value={front}
                            onChange={(e) => setFront(e.target.value)}
                        />

                        <input
                            className="cardModalInput"
                            type="text"
                            placeholder="Verso:"
                            value={back}
                            onChange={(e) => setBack(e.target.value)}
                            />

                        <button className="cardsButtonSave" onClick={handleSave}>
                            SALVAR
                        </button>
                    </div>
                </dialog>
                <div className="createdCards">
                  <button className="createCard" onClick={openModal}>
                    <FontAwesomeIcon size="5x" icon={faPlus} style={{color: "#4346E6"}} />
                  </button>
                  {flashcards.map((card, i) => (
                    <CreateInteractiveCard className="flashCardContainer" key={i}>
                      <p style={{fontSize: "1.5rem", padding: "1rem", wordBreak: "break-word"}}>{card.question}</p>
                      <p style={{fontSize: "0.9rem"}}>Clique para ver o verso</p>
                    </CreateInteractiveCard>
                  ))}
                </div>
            </div>
        </div>
    )
}
