import { useEffect, useRef, useState } from "react";

export default function Background({
    as: Tag = "div",
    src,
    poster,
    blur = 2,
    dark = 0,
    className = "",
    children,
    ...rest
}) {
    const [active, setActive] = useState(0);          // qual vídeo está visível (0 ou 1)
    const refs = [useRef(null), useRef(null)];
    const [sources, setSources] = useState([src, src]); // inicia iguais para não piscar
    const FADE_MS = 400;                                // combine com o CSS

    useEffect(() => {
        const next = 1 - active; // índice do vídeo “invisível” que vai entrar
        setSources(prev => {
            const copy = [...prev];
            copy[next] = src;
            return copy;
        });

        const vCurr = refs[active].current;
        const vNext = refs[next].current;
        if (!vNext) return;

        let t;
        const onCanPlay = async () => {
            try { await vNext.play(); } catch { }
            // crossfade: próximo entra, atual sai
            vNext.classList.add("is-active");
            vCurr?.classList.remove("is-active");

            t = setTimeout(() => {
                vCurr?.pause();
                setActive(next);
            }, FADE_MS);
        };

        // prepara e começa o fade quando puder tocar
        vNext.addEventListener("canplay", onCanPlay, { once: true });
        vNext.load();

        return () => {
            vNext.removeEventListener("canplay", onCanPlay);
            if (t) clearTimeout(t);
        };
    }, [src]); // roda toda vez que o src (day/night) muda

    return (
        <Tag
            className={`vb-shell ${className}`}
            style={{ "--vb-blur": `${blur}px`, "--vb-dark": dark }}
            {...rest}
        >
            {/* camada de vídeo A */}
            <video
                ref={refs[0]}
                className={`vb-media ${active === 0 ? "is-active" : ""}`}
                src={sources[0]}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster={poster}
            />
            {/* camada de vídeo B */}
            <video
                ref={refs[1]}
                className={`vb-media ${active === 1 ? "is-active" : ""}`}
                src={sources[1]}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster={poster}
            />

            <div className="vb-content">{children}</div>
        </Tag>
    );
}
