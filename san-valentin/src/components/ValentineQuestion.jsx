import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "../styles/question.css";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export default function ValentineQuestion({
  names = {
    primary: "JennGeovis",
    nicknames: ["amor", "babe", "bonita", "JennGeovis"],
  },
  onYes,
}) {
  const nickname = useMemo(() => {
    const list = names?.nicknames?.length ? names.nicknames : ["amor"];
    return list[Math.floor(Math.random() * list.length)];
  }, [names]);

  const [noClicks, setNoClicks] = useState(0);
  const [status, setStatus] = useState("");
  const [noPos, setNoPos] = useState({ x: 18, y: 260 });
  const [isEscaping, setIsEscaping] = useState(false);

  const arenaRef = useRef(null);     // ✅ ahora el área completa verde es el límite
  const noBtnRef = useRef(null);

  const lastEscapeAtRef = useRef(0);

  const yesScale = useMemo(() => clamp(1 + noClicks * 0.1, 1, 1.55), [noClicks]);
  const escapeEnabled = noClicks >= 3;

  const bullyMessages = useMemo(
    () => [
      `JAJA ${nickname}… ese NO no coopera. Elige el otro botón 😌💖`,
      `${nickname}, ¿cómo le hiciste para darle? 😳 Ok… intenta con el SÍ 🙈`,
      `Eso fue trampa, ${nickname}. El NO está en huelga. Vete al SÍ 💘`,
      `Mira nada más… ${nickname} hackeando el NO. Mejor pica SÍ 😈`,
      `El NO: “yo ya no trabajo aquí”. Tú: *clic*. ${nickname}, pica SÍ 💖`,
      `Plot twist: el NO es decorativo 😌 ${nickname}, elige SÍ`,
      `Ok, ${nickname}, ya fue suficiente. El botón correcto es el SÍ 🌹`,
    ],
    [nickname]
  );

  // ✅ Posición aleatoria dentro de TODO el recuadro verde (arena)
  const computeRandomPos = useCallback(() => {
    const area = arenaRef.current;
    const btn = noBtnRef.current;
    if (!area || !btn) return;

    const padding = 14;

    const areaRect = area.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    // Opcional: si quieres evitar tapar el footnote, deja un pequeño margen abajo:
    const bottomSafe = 44; // px (ajusta si quieres más aire)
    const topSafe = 6;     // px

    const maxX = Math.max(0, areaRect.width - btnRect.width - padding * 2);
    const maxY = Math.max(
      0,
      areaRect.height - btnRect.height - padding * 2 - bottomSafe - topSafe
    );

    const x = Math.round(padding + Math.random() * maxX);
    const y = Math.round(topSafe + padding + Math.random() * maxY);

    setNoPos({ x, y });
  }, []);

  // ✅ Difícil pero no imposible (probabilidad + cooldown)
  const maybeEscape = useCallback(
    (chance = 0.65) => {
      if (!escapeEnabled) return;

      const now = performance.now();
      const cooldownMs = 260; // ↑ más posible, ↓ más difícil
      if (now - lastEscapeAtRef.current < cooldownMs) return;

      if (Math.random() < chance) {
        lastEscapeAtRef.current = now;
        computeRandomPos();
      }
    },
    [escapeEnabled, computeRandomPos]
  );

  const handleNoClick = () => {
    const next = noClicks + 1;
    setNoClicks(next);

    if (next === 1) {
      setStatus("Me parece que te equivocaste… te doy otra oportunidad 😌");
      return;
    }

    if (next === 2) {
      setStatus(`¿Segura?, ${nickname}… piénsalo bien 🥺`);
      return;
    }

    if (next === 3) {
      setStatus("Me parece que no has seleccionado el indicado 😈");
      setIsEscaping(true);

      // ✅ al activar escape, muévete dentro del recuadro verde
      requestAnimationFrame(() => computeRandomPos());
      return;
    }

    // > 3: si logra darle, mensaje aleatorio + mover
    const randomMsg =
      bullyMessages[Math.floor(Math.random() * bullyMessages.length)];
    setStatus(randomMsg);
    setIsEscaping(true);
    computeRandomPos();
  };

  // ✅ hover: huye casi siempre pero deja chance
  const handleNoHover = () => {
    if (!escapeEnabled) return;
    maybeEscape(0.85);
  };

  // ✅ radar en TODO el recuadro verde (mouse/touch/pen)
  useEffect(() => {
    if (!escapeEnabled) return;

    const area = arenaRef.current;
    const btn = noBtnRef.current;
    if (!area || !btn) return;

    const threshold = 140; // un poco más para que se sienta vivo

    const handleMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      if (x == null || y == null) return;

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // ✅ si te acercas, a veces huye (no siempre)
      if (dist < threshold) maybeEscape(0.60);
    };

    area.addEventListener("pointermove", handleMove);
    return () => area.removeEventListener("pointermove", handleMove);
  }, [escapeEnabled, maybeEscape]);

  // ✅ al activar escape por primera vez, reubica
  useEffect(() => {
    if (escapeEnabled) requestAnimationFrame(() => computeRandomPos());
  }, [escapeEnabled, computeRandomPos]);

  return (
    <div className="vq-wrap">
      <div className="vq-card">
        <h1 className="vq-title">Mi {nickname}… 💘</h1>

        <div className="vq-arena" ref={arenaRef}>
          <div className="vq-copy">
            <p className="vq-lead">
              Mi {nickname}, desde que llegaste a mi vida todo se siente más bonito… <br />
              y si pudiera elegir un lugar favorito en el mundo, sería donde estés tú. <br />
              <br />
              Contigo aprendí que el amor no solo se dice… <br />
              también se siente, se cuida y se disfruta. <br />
              Y yo quiero seguir viviendo momentos contigo, uno tras otro…<br />
              <br />
              Por eso hoy quiero preguntarte algo muy especial…
            </p>
            <p className="vq-question">¿Quieres ser mi San Valentín? 🌹</p>
          </div>

          <div className="vq-status-slot">
            {status ? (
              <div className="vq-status">{status}</div>
            ) : (
              <div className="vq-status vq-status--ghost">.</div>
            )}
          </div>

          {/* ✅ SÍ fijo (crece) */}
          <div className="vq-controls">
            <div className="vq-yes-slot">
              <button
                className="vq-yes"
                style={{ transform: `scale(${yesScale})` }}
                onClick={() => onYes?.()}
              >
                SÍ 💖
              </button>
            </div>

            {/* ✅ NO normal mientras no escape */}
            {!escapeEnabled && (
              <button className="vq-no" onClick={handleNoClick}>
                NO 😶
              </button>
            )}
          </div>

          {/* ✅ NO en modo cobarde: se mueve por todo el recuadro verde y NO se oculta */}
          {escapeEnabled && (
            <button
              ref={noBtnRef}
              className={`vq-no vq-no--free ${isEscaping ? "vq-no--escape" : ""}`}
              onClick={handleNoClick}
              onMouseEnter={handleNoHover}
              onPointerDown={() => maybeEscape(0.45)} // ✅ chance real de atraparlo
              style={{ left: noPos.x, top: noPos.y }}
            >
              NO 😶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
