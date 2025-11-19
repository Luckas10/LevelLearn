// src/components/common/Tabs.jsx
export default function Tabs({
    options = [],
    selected,
    onChange,
    className = "",
}) {
    return (
        <div className={`studyTabs ${className}`}>
            {options.map((tab) => (
                <div
                    key={tab.value}
                    className={`studyTabsSelect ${selected === tab.value ? "active" : ""
                        }`}
                    onClick={() => onChange(tab.value)}
                >
                    {/* Se quiser garantir tudo MAIÚSCULO */}
                    {tab.label?.toUpperCase() || tab.value.toUpperCase()}
                </div>
            ))}
        </div>
    );
}
