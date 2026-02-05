import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "../styles/question.css";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export default function ValentineQuestion({
  names = { primary: "Jennyfer Geovana Salas", nicknames: ["amor", "babe", "bonita", "JennGeovis"] },
  onYes,
}) {
  const nickname = useMemo(() => {
    const list = names?.nicknames?.length ? names.nicknames : ["amor"];
    return list[Math.floor(Math.random() * list.length)];
  }, [names]);

  const [noClicks, setNoClicks] = useState(0);
  const [status, setStatus] = useState("");
  const [noPos, setNoPos] = useState({ x: 60, y: 150 }); // px dentro del contenedor
  const [isEscaping, setIsEscaping] = useState(false);

  const arenaRef = useRef(null);
  const noBtnRef = useRef(null);

  const yesScale = useMemo(() => {
    // crece pero con límite (no cubrir pantalla)
    return clamp(1 + noClicks * 0.10, 1, 1.55);
  }, [noClicks]);

  const escapeEnabled = noClicks >= 3;

  const computeRandomPos = useCallback(() => {
    const arena = arenaRef.current;
    const btn = noBtnRef.current;
    if (!arena || !btn) return;

    const pad = 12;
    const rect = arena.getBoundingClientRect();
    const b = btn.getBoundingClientRect();

    const maxX = Math.max(pad, rect.width - b.width - pad);
    const maxY = Math.max(pad, rect.height - b.height - pad);

    const x = Math.floor(pad + Math.random() * (maxX - pad));
    const y = Math.floor(pad + Math.random() * (maxY - pad));

    setNoPos({ x, y });
  }, []);

  const onClickNo = () => {
    const next = noClicks + 1;
    setNoClicks(next);

    if (next === 1) setStatus(`Creo que te equivocaste, ${nickname}… selecciona otra vez 😌`);
    if (next === 2) setStatus(`Ok ok… ${nickname}, pero eso sonó sospechoso 😅 intenta de nuevo`);
    if (next === 3) {
      setStatus(`Uy… ya vi. A partir de ahora el NO entra en “modo cobarde” 😈`);
      setIsEscaping(true);
      // muévete inmediatamente
      setTimeout(() => computeRandomPos(), 60);
    }
    if (next > 3) {
      setStatus(`JAJA ${nickname}… ese NO no coopera. Elige el otro botón 😌💖`);
      setIsEscaping(true);
      computeRandomPos();
    }
  };

  const onMouseEnterNo = () => {
    if (!escapeEnabled) return;
    computeRandomPos();
  };

  // “radar”: si el mouse se acerca, se mueve (hace casi imposible agarrarlo)
  useEffect(() => {
    if (!escapeEnabled) return;

    const arena = arenaRef.current;
    const btn = noBtnRef.current;
    if (!arena || !btn) return;

    const threshold = 110; // px
    const handleMove = (e) => {
      const br = btn.getBoundingClientRect();
      const cx = br.left + br.width / 2;
      const cy = br.top + br.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < threshold) computeRandomPos();
    };

    arena.addEventListener("mousemove", handleMove);
    return () => arena.removeEventListener("mousemove", handleMove);
  }, [escapeEnabled, computeRandomPos]);

  // posición inicial decente al montar (responsive)
  useEffect(() => {
    // coloca el NO en un lugar random suave solo si escapará
    if (escapeEnabled) computeRandomPos();
  }, [escapeEnabled, computeRandomPos]);

  return (
    <div className="vq-wrap">
      <div className="vq-card">
        <h1 className="vq-title">Oye {nickname}… 💘</h1>
        <p className="vq-sub">
          {names.primary} (pero yo te digo <strong>{nickname}</strong>), tengo una pregunta muy seria…
        </p>

        <div className="vq-arena" ref={arenaRef}>
          <p className="vq-question">¿Quieres ser mi San Valentín? 🌹</p>

          {status && <div className="vq-status">{status}</div>}

          <div className="vq-buttons">
            <button
              className="vq-yes"
              style={{ transform: `scale(${yesScale})` }}
              onClick={() => onYes?.()}
            >
              SÍ 💖
            </button>

            <button
              ref={noBtnRef}
              className={`vq-no ${isEscaping ? "vq-no--escape" : ""}`}
              onClick={onClickNo}
              onMouseEnter={onMouseEnterNo}
              style={
                escapeEnabled
                  ? { left: noPos.x, top: noPos.y, position: "absolute" }
                  : undefined
              }
            >
              NO 😶
            </button>
          </div>

          <p className="vq-footnote">
            *Nota legal: elegir “SÍ” aumenta el romance en un 200%. Elegir “NO”… pues no aplica 😌
          </p>
        </div>
      </div>
    </div>
  );
}
