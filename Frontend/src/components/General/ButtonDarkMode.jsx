import "./ButtonDarkMode.css";

export default function ButtonDarkMode({ checked, onChange, size = 16 }) {
    return (
        <label className="theme-switch" style={{ "--toggle-size": `${size}px` }}>
            <input
                type="checkbox"
                className="theme-switch__checkbox"
                checked={checked}
                onChange={onChange}
            />
            <div className="theme-switch__container">
                <div className="theme-switch__clouds"></div>
                <div className="theme-switch__stars-container"> {/* svg aqui */} </div>
                <div className="theme-switch__circle-container">
                    <div className="theme-switch__sun-moon-container">
                        <div className="theme-switch__moon">
                            <div className="theme-switch__spot"></div>
                            <div className="theme-switch__spot"></div>
                            <div className="theme-switch__spot"></div>
                        </div>
                    </div>
                </div>
            </div>
        </label>
    );
}
