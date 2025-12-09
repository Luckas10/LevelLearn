// CopyButton.jsx
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

import { getCardsByDeckId, createCards } from "../../../../services/cards";
import { createCollection } from "../../../../services/collection";

import { getDataUser } from "../../../../services/auth";

/**
 * Props:
 *  - collection: objeto da coleção atual (necessário: id, name, description, cover_name)
 *  - onCopied: (opcional) função callback chamada depois que a cópia terminar (ex: para recarregar lista)
 */
export function CopyButton({ collection, onCopied }) {
  const [loading, setLoading] = useState(false);


  async function handleCopy() {
    if (loading) return;
    setLoading(true);

    try {
      const user = await getDataUser();

      // ------------ BUSCA CARDS DA COLEÇÃO ORIGINAL PELO ID DO DECK ---------------
      const originalCards = await getCardsByDeckId(collection.id);

      // ------------ CRIA A COLEÇÃO COM O ID DO CURRENT USER ----------------
      const newCollection = await createCollection({
        name: collection.name,
        description: collection.description,
        cover_name: collection.cover_name,
        owner_id: user.id,
      });

      // ------------ COPIA CARDS UM A UM PRO NOVO DECK ---------------

      for (const card of originalCards) {
        await createCards({
          question: card.question ?? card.front,
          answer: card.answer ?? card.back,
          deck_id: newCollection.id,
        });
      }


      await Swal.fire({
        icon: "success",
        title: "Coleção copiada!",
        text: "A coleção e seus flashcards foram adicionados às suas coleções.",
        timer: 1600,
        showConfirmButton: false,
      });

      if (typeof onCopied === "function") onCopied(newCollection);

    } catch (err) {
      console.error("Erro ao copiar coleção:", err);
      await Swal.fire({
        icon: "error",
        title: "Erro ao copiar",
        text: "Não foi possível copiar a coleção. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="startButtonContainer" style={{ marginTop: "1.5rem" }}>
        <button
            className="startButton"
            onClick={handleCopy}
            disabled={loading}
            aria-busy={loading}
        >
        <FontAwesomeIcon
            className="startButtonIcon"
            size="3x"
            icon={faCopy}
        />
        <p className="startButtonText" style={{ fontSize: "xx-large" }}>
            {loading ? "COPIANDO..." : "COPIAR"}
        </p>
      </button>
    </div>
  );
}
