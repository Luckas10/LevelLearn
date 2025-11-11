import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import fisica from "../../assets/CoverImages/fisica.svg"
import matematica from "../../assets/CoverImages/matematica.svg"


export default function StudyCreateCollection() {

    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        // Fecha ao clicar fora do conteúdo
        const handleClickOutside = (event) => {
        const dialogDimensions = dialog.getBoundingClientRect();
        if (
            event.clientX < dialogDimensions.left ||
            event.clientX > dialogDimensions.right ||
            event.clientY < dialogDimensions.top ||
            event.clientY > dialogDimensions.bottom
        ) {
            dialog.close();
        }
        };

        dialog.addEventListener("click", handleClickOutside);

        return () => dialog.removeEventListener("click", handleClickOutside);
    }, []);

    const openModal = () => {
        dialogRef.current.showModal();
    };

    useEffect(() => {
      const container = document.querySelector(".collectionCoverOptions");
  
      if (container) {
        container.addEventListener("wheel", (e) => {
          if (e.deltaY !== 0) {
            e.preventDefault(); // impede o scroll vertical padrão
            container.scrollLeft += e.deltaY; // move horizontalmente
          }
        });
      }
    }, []);

  return (
    <div className="studyCreateCollection">
      <button className="createCollectionButton" onClick={openModal}>
        <FontAwesomeIcon size="lg" icon={faPlus} />
        <p>CRIAR COLEÇÃO</p>
      </button>

      <dialog className="createCollectionModal" ref={dialogRef}>
        <div className="collectionModalContent">
          <p>CRIAR COLEÇÃO</p>
          <input className="collectionInput" type="text" placeholder="Nome: " />
          <input className="collectionInput" type="text" placeholder="Descrição: " />
          <div className="collectionCoverSelect">
            <p>CAPA DA COLEÇÃO:</p>
            <div className="collectionCoverOptions">
              <div className="collectionCoverOption"><img src={fisica} style={{width: "100px", height: "100px"}}/></div>
              <div className="collectionCoverOption"><img src={matematica} style={{width: "100px", height: "100px"}}/></div>
              <div className="collectionCoverOption"><img src={fisica} style={{width: "50px", height: "50px"}}/></div>
              <div className="collectionCoverOption"><img src={fisica} style={{width: "50px", height: "50px"}}/></div>
              <div className="collectionCoverOption"><img src={fisica} style={{width: "50px", height: "50px"}}/></div>
              <div className="collectionCoverOption"><img src={fisica} style={{width: "50px", height: "50px"}}/></div>
              <div className="collectionCoverOption"><img src={fisica} style={{width: "50px", height: "50px"}}/></div>
              <div className="collectionCoverOption"><img src={fisica} style={{width: "50px", height: "50px"}}/></div>
              <div className="collectionCoverOption"><img src={fisica} style={{width: "50px", height: "50px"}}/></div>
            </div>
          </div>
          <button className="collectionButtonSave">SALVAR</button>
        </div>
      </dialog>
    </div>
  );
}
