export default function StoreHeader({
    value = "",
    onChange = () => { },
    placeholder = "Buscar...",
    buttonText = "BUSCAR",
}) {
    return (
        <header className="store-header">
            <input
                className="store-search"
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                aria-label="Buscar itens da loja"
            />
            <button
                className="store-search-btn"
                type="button"
                onClick={() => onChange(value.trim())}
            >
                {buttonText}
            </button>
        </header>
    );
}
