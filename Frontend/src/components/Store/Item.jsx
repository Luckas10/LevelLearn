export default function StoreItem({
    img,
    title,
    price,
    currency = "coin",
    tag,
    data,
    onBuy,
}) {
    return (
        <article className="store-card" tabIndex={0}>
            {tag && <span className="store-badge">{tag}</span>}

            <div className="store-thumb" aria-hidden="true">
                {img ? <img src={img} alt={title} loading="lazy" /> : <div className="store-thumb-skeleton" />}
            </div>

            <div className="store-info">
                <h3 className="store-title" title={title}>{title}</h3>

                {/* Dados extras compactos */}
                {data && (
                    <ul className="store-meta">
                        {data.raridade && <li>Raridade: <strong>{data.raridade}</strong></li>}
                        {data.categoria && <li>Categoria: <strong>{data.categoria}</strong></li>}
                    </ul>
                )}

                <div className="store-buy">
                    <span className="store-price">
                        <i className={`icon-${currency}`} aria-hidden="true" />
                        {price}
                    </span>
                    <button className="store-btn" onClick={onBuy}>Comprar</button>
                </div>
            </div>
        </article>
    );
}
