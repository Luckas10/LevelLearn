import { useEffect, useRef } from "react";
import "./LoginRegisterContainer.css";
import ButtonDarkMode from "../General/ButtonDarkMode";

export default function LoginRegisterContainer({ isNight, onToggleTheme }) {
    const mainRef = useRef(null);        // <main>
    const scopeRef = useRef(null);       // wrapper para escopar querySelector

    useEffect(() => {
        const root = scopeRef.current;
        const main = mainRef.current;
        document.body.style.paddingLeft = "0";

        // Seletores escopados ao componente
        const inputs = root.querySelectorAll(".input-field");
        const toggles = root.querySelectorAll(".toggle");
        const bullets = root.querySelectorAll(".bullets span");
        const images = root.querySelectorAll(".image");
        const textGrp = root.querySelector(".text-group");

        // --- handlers ---
        const onFocus = (e) => e.currentTarget.classList.add("active");
        const onBlur = (e) => {
            if (e.currentTarget.value !== "") return;
            e.currentTarget.classList.remove("active");
        };

        const onToggle = (e) => {
            e.preventDefault();            // <— impede a navegação do <a>
            main.classList.toggle("sign-up-mode");
        };

        const moveSlider = (e) => {
            const index = Number(e.currentTarget.dataset.value); // 1..3

            // imagens
            images.forEach((img) => img.classList.remove("show"));
            const currentImage = root.querySelector(`.img-${index}`);
            if (currentImage) currentImage.classList.add("show");

            // textos
            if (textGrp) textGrp.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;

            // bullets
            bullets.forEach((b) => b.classList.remove("active"));
            e.currentTarget.classList.add("active");
        };

        // --- bind ---
        inputs.forEach((i) => {
            i.addEventListener("focus", onFocus);
            i.addEventListener("blur", onBlur);
        });
        toggles.forEach((t) => t.addEventListener("click", onToggle));
        bullets.forEach((b) => b.addEventListener("click", moveSlider));

        // --- cleanup ---
        return () => {
            inputs.forEach((i) => {
                i.removeEventListener("focus", onFocus);
                i.removeEventListener("blur", onBlur);
            });
            toggles.forEach((t) => t.removeEventListener("click", onToggle));
            bullets.forEach((b) => b.removeEventListener("click", moveSlider));
        };
    }, []);

    return (
        <main ref={mainRef}>
            {/* escopo para os querySelectors */}
            <div ref={scopeRef} className="box">
                <div className="inner-box">
                    <div className="forms-wrap">
                        <form action="index.html" autoComplete="off" className="sign-in-form">
                            <div className="logo">
                                <div className="brand">
                                    <img src="/img/LogoSVG.svg" alt="LevelLearn" />
                                    <h4>LevelLearn</h4>
                                </div>

                                <ButtonDarkMode checked={isNight} onChange={onToggleTheme} />
                            </div>

                            <div className="heading">
                                <h2>Bem vindo de volta!</h2>
                                <h6>Não tem uma conta?</h6>
                                <a href="#signup" className="toggle">Registrar-se</a>
                            </div>

                            <div className="actual-form">
                                <div className="input-wrap">
                                    <input
                                        type="email"
                                        minLength={4}
                                        className="input-field"
                                        autoComplete="off"
                                        required
                                    />
                                    <label className="labelLoginContainer">E-mail</label>
                                </div>

                                <div className="input-wrap">
                                    <input
                                        type="password"
                                        minLength={4}
                                        className="input-field"
                                        autoComplete="off"
                                        required
                                    />
                                    <label className="labelLoginContainer">Senha</label>
                                </div>

                                <input type="submit" value="Entrar" className="sign-btn" />

                                <p className="text">
                                    Esqueceu sua senha?
                                    <a href="#help">Chame ajuda</a> para recuperá-la.
                                </p>
                            </div>
                        </form>

                        <form action="index.html" autoComplete="off" className="sign-up-form">
                            <div className="logo">
                                <div className="brand">
                                    <img src="/img/LogoSVG.svg" alt="LevelLearn" />
                                    <h4>LevelLearn</h4>
                                </div>

                                <ButtonDarkMode checked={isNight} onChange={onToggleTheme} />
                            </div>

                            <div className="heading">
                                <h2>Vamos começar!</h2>
                                <h6>Já tem uma conta?</h6>
                                <a href="#signin" className="toggle">Entrar</a>
                            </div>

                            <div className="actual-form">
                                <div className="input-wrap">
                                    <input
                                        type="text"
                                        minLength={4}
                                        className="input-field"
                                        autoComplete="off"
                                        required
                                    />
                                    <label className="labelLoginContainer">Nome</label>
                                </div>

                                <div className="input-wrap">
                                    <input
                                        type="email"
                                        className="input-field"
                                        autoComplete="off"
                                        required
                                    />
                                    <label className="labelLoginContainer">Email</label>
                                </div>

                                <div className="input-wrap">
                                    <input
                                        type="password"
                                        minLength={4}
                                        className="input-field"
                                        autoComplete="off"
                                        required
                                    />
                                    <label className="labelLoginContainer">Senha</label>
                                </div>

                                <input type="submit" value="Criar conta" className="sign-btn" />

                                <p className="text">
                                    Ao criar sua conta você concorda com os nossos
                                    <a href="#tos">Termos e serviços</a> e a nossa
                                    <a href="#privacy">Política de privacidade</a>
                                </p>
                            </div>
                        </form>
                    </div>

                    <div className="carousel">
                        <div className="images-wrapper">
                            <img src="/img/carrousel1.png" className="image img-1 show" alt="" />
                            <img src="/img/image2.png" className="image img-2" alt="" />
                            <img src="/img/image3.png" className="image img-3" alt="" />
                        </div>

                        <div className="text-slider">
                            <div className="text-wrap">
                                <div className="text-group">
                                    <h2>Seja mais produtivo</h2>
                                    <h2>Estude com jogos e dinâmicas</h2>
                                    <h2>Chame seus amigos para competir</h2>
                                </div>
                            </div>

                            <div className="bullets">
                                <span className="active" data-value="1"></span>
                                <span data-value="2"></span>
                                <span data-value="3"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
