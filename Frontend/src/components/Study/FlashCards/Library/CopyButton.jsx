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

      // 1) buscar cards da coleção original
      const originalCards = await getCardsByDeckId(collection.id);

      // 2) criar nova coleção para o usuário (mesma lógica do CreateCollection)
      const newCollection = await createCollection({
        name: collection.name,
        description: collection.description,
        cover_name: collection.cover_name,
        owner_id: user.id,
      });

      // 3) copiar cards um a um para o novo deck
      //    adaptamos as chaves para o formato que seu backend espera (question/answer)
      for (const card of originalCards) {
        await createCards({
          question: card.question ?? card.front,
          answer: card.answer ?? card.back,
          deck_id: newCollection.id,
        });
      }

      // 4) feedback
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
