export default function StoreModal({ open, item, onClose, onConfirm }) {
    if (!open || !item) return null;

    return (
        <div className="store-modal-backdrop" role="dialog" aria-modal="true">
            <div className="store-modal">
                <header className="store-modal-head">
                    <h3>{item.title}</h3>
                    <button className="store-modal-close" onClick={onClose} aria-label="Fechar">×</button>
                </header>

                <div className="store-modal-body">
                    <div className="store-modal-images">
                        <figure>
                            <img src={item.imgFront} alt={`${item.title} (frente)`} />
                            <figcaption>Frente</figcaption>
                        </figure>
                        <figure>
                            <img src={item.imgBack} alt={`${item.title} (costas)`} />
                            <figcaption>Costas</figcaption>
                        </figure>
                    </div>

                    {item.description && (
                        <p className="store-modal-desc">{item.description}</p>
                    )}

                    <p className="store-modal-warning">
                        Confirma a compra por <strong>{item.price}</strong> moedas? <br />
                        <u>Não há reembolso</u> após a confirmação.
                    </p>
                </div>

                <footer className="store-modal-actions">
                    <button className="btn-ghost" onClick={onClose}>Cancelar</button>
                    <button className="btn-primary" onClick={() => onConfirm(item)}>
                        Comprar
                    </button>
                </footer>
            </div>
        </div>
    );
}
