import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

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
            <p>CAPA DA COLEÇÃO</p>
            <div>
              <div className="collectionCover"></div>
              <div className="collectionCover"></div>
              <div className="collectionCover"></div>
              <div className="collectionCover"></div>
              <div className="collectionCover"></div>
              <div className="collectionCover"></div>
            </div>
          </div>
          <button className="collectionButtonSave">SALVAR</button>
        </div>
      </dialog>
    </div>
  );
}
