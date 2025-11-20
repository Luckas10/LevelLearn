import StoreItem from "./Item";

export default function StoreGrid({ items = [], onBuy, emptyText }) {
    if (!items.length) return <p className="store-empty">{emptyText}</p>;

    return (
        <div className="store-grid">
            {items.map((item) => (
                <StoreItem
                    key={item.id}
                    title={item.title}
                    price={item.price}
                    currency={item.currency}
                    img={item.imgFront}    // thumb do grid usa a frente
                    tag={item.tag}
                    data={item.data}
                    onBuy={() => onBuy?.(item)}
                />
            ))}
        </div>
    );
}
