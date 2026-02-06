// src/components/Celebration/Celebration.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import YouTubeAudio from "../components/Audio/YoutubeAudio";
import "../styles/celebration.css";

// ✅ Importa imágenes (Vite)
import img1 from "../assets/images/imagen1.png";
import img2 from "../assets/images/imagen2.jpg";
import img3 from "../assets/images/imagen3.jpg";
import img4 from "../assets/images/imagen4.jpg";
import img5 from "../assets/images/imagen5.jpg";
import img6 from "../assets/images/imagen6.jpg";
import img7 from "../assets/images/imagen7.jpg";
import img8 from "../assets/images/imagen8.jpg";

import abrazobeso from "../assets/images/abrazobeso.png";
import buffet from "../assets/images/buffetmiamo.png";
import paseociudad from "../assets/images/paseociudad.png";
import cine from "../assets/images/cine.png";
import realmonte from "../assets/images/realdemonte.png";
import pijamada from "../assets/images/pijamada.png";

import real1 from "../assets/images/real1.jpg";
import real2 from "../assets/images/real2.jpg";
import real3 from "../assets/images/real3.jpg";

export default function Celebration() {
  // ===== AUDIO (NO TOCADO) =====
  const playerRef = useRef(null);
  const videoId = "HQEHK7VjaQE"; // Rare - Selena Gomez

  const tryAutoplay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;

    try {
      p.setVolume(65);
      p.playVideo();
    } catch {
      // sin UI, solo silencioso
    }
  }, []);

  useEffect(() => {
    const reTry = () => tryAutoplay();
    window.addEventListener("pointerdown", reTry, { once: true });
    window.addEventListener("keydown", reTry, { once: true });
    window.addEventListener("touchstart", reTry, { once: true });
    return () => {
      window.removeEventListener("pointerdown", reTry);
      window.removeEventListener("keydown", reTry);
      window.removeEventListener("touchstart", reTry);
    };
  }, [tryAutoplay]);

  // ===== COLLAGE =====
  const images = useMemo(
    () => [
      { src: img1, alt: "Foto 1" },
      { src: img2, alt: "Foto 2" },
      { src: img3, alt: "Foto 3" },
      { src: img4, alt: "Foto 4" },
      { src: img5, alt: "Foto 5" },
      { src: img6, alt: "Foto 6" },
      { src: img7, alt: "Foto 7" },
      { src: img8, alt: "Foto 8" },
    ],
    []
  );

  // ===== ITINERARIO =====
  const itinerary = useMemo(
    () => [
      {
        title: "1) Abrazo + beso (no negociable)",
        desc: "Protocolo inicial obligatorio: abrazo bien dado y beso con intención. Sin esto, no inicia el evento 😌💘",
        img: abrazobeso,
        tag: "Warm-up 💖",
      },
      {
        title: "2) Buffet Miamo (Cuauhtémoc)",
        desc: "Comer sin prisas, repetir sin culpa y salir felices. Si tú sonríes, misión cumplida 🍽️😌",
        img: buffet,
        tag: "Comidita rica",
      },
      {
        title: "3) Paseo por la ciudad",
        desc: "Caminata relax, fotos bonitas, chisme de calidad y tú agarrada de mi brazo como debe ser 🏙️✨",
        img: paseociudad,
        tag: "CDMX vibes",
      },
      {
        title: "4) Cine: peli a tu elección",
        desc: "Tú eliges la película, yo llevo palomitas y finjo valentía si es de terror 🎬🍿 (spoiler: lo mejor es verte disfrutarla).",
        img: cine,
        tag: "Cine + palomitas",
      },
      {
        title: "5) Elegir fin de semana para Real del Monte",
        desc: "Planear la escapada: frío rico, pueblito bonito, pan dulce y fotos que no vamos a subir todas 📸🫶",
        img: realmonte,
        tag: "Bonus trip",
      },
      {
        title: "6) Pijamada + juegos",
        desc: "Dormir juntos, pijamada cómoda, risas, jueguitos y cero prisas al día siguiente 😴🎮💞",
        img: pijamada,
        tag: "Nivel final",
      },
    ],
    []
  );

  // ===== REAL DEL MONTE (galería propia) =====
  const rdmPhotos = useMemo(
    () => [
      { src: real1, alt: "Real del Monte 1" },
      { src: real2, alt: "Real del Monte 2" },
      { src: real3, alt: "Real del Monte 3" },
    ],
    []
  );

  // ===== MODAL multi-galería =====
  const [viewerImages, setViewerImages] = useState([]); // lista actual (collage o RDM)
  const [openIndex, setOpenIndex] = useState(null);

  const openPhoto = useCallback((list, idx) => {
    setViewerImages(list);
    setOpenIndex(idx);
  }, []);

  const closePhoto = useCallback(() => {
    setOpenIndex(null);
    setViewerImages([]);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (openIndex == null) return;

      if (e.key === "Escape") closePhoto();

      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        setOpenIndex((prev) => {
          if (prev == null) return prev;
          const len = viewerImages.length || 1;
          if (e.key === "ArrowRight") return (prev + 1) % len;
          return (prev - 1 + len) % len;
        });
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, viewerImages.length, closePhoto]);

  // ===== CALENDARIO (Opción B) + fecha mínima =====
  const [pickedDate, setPickedDate] = useState(() => {
    try {
      return localStorage.getItem("rdm_date") || "";
    } catch {
      return "";
    }
  });
  const [pickedMsg, setPickedMsg] = useState("");

  const toISO = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const minDateStr = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    let base = new Date(y, 1, 14, 12, 0, 0); // Feb = 1
    if (now.getTime() > base.getTime()) base = new Date(y + 1, 1, 14, 12, 0, 0);
    const min = new Date(base);
    min.setDate(min.getDate() + 7);
    return toISO(min);
  }, []);

  const isWeekend = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(`${dateStr}T12:00:00`);
    const day = d.getDay();
    return day === 0 || day === 6;
  };

  const niceDate = (dateStr) => {
    try {
      const d = new Date(`${dateStr}T12:00:00`);
      return d.toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const onPickDate = (dateStr) => {
    setPickedDate(dateStr);

    if (!dateStr) {
      setPickedMsg("");
      try {
        localStorage.removeItem("rdm_date");
      } catch {}
      return;
    }

    if (dateStr < minDateStr) {
      setPickedMsg(
        `Amor… Real del Monte con tan poquito margen está difícil 😅 elige desde la siguiente semana (desde ${niceDate(
          minDateStr
        )}) 💖`
      );
      return;
    }

    if (!isWeekend(dateStr)) {
      setPickedMsg("Amor… eso es entre semana 😅 elige sábado o domingo, porfis 💖");
      return;
    }

    setPickedMsg(`Perfecto amor 💖 entonces nos vamos el ${niceDate(dateStr)}. Ya quedó guardado 😌`);

    try {
      localStorage.setItem("rdm_date", dateStr);
    } catch {}
  };

  // ===== CORAZONES DE FONDO =====
  const hearts = useMemo(() => Array.from({ length: 18 }), []);

  return (
    <div className="cel-wrap">
      <YouTubeAudio
        videoId={videoId}
        onReady={(player) => {
          playerRef.current = player;
          tryAutoplay();
        }}
      />

      {/* Fondo de corazones */}
      <div className="cel-hearts" aria-hidden="true">
        {hearts.map((_, i) => (
          <span key={i} className="cel-heart-float">
            💖
          </span>
        ))}
      </div>

      <h1 className="cel-title">OFICIALMENTE: MI SAN VALENTÍN 💖</h1>
      <p className="cel-sub">Ok amor… ya que dijiste que sí, ahora agárrate 😌</p>
      <div className="cel-hint">👇 Desliza hacia abajo 👇</div>

      {/* ===== COLLAGE ===== */}
      <section className="cel-section">
        <h2 className="cel-h2">Nuestro collage 📸💖</h2>
        <p className="cel-sub cel-sub--spaced">
          Toca una foto para verla grande (y para recordar que me encantas 😌).
        </p>

        <div className="cel-collage">
          {images.map((img, idx) => (
            <button
              key={idx}
              className="cel-tile"
              onClick={() => openPhoto(images, idx)}
              aria-label={`Abrir ${img.alt}`}
            >
              <img className="cel-photo" src={img.src} alt={img.alt} loading="lazy" />
              <span className="cel-tile-glow" />
            </button>
          ))}
        </div>
      </section>

      {/* ===== ITINERARIO ===== */}
      <section className="cel-section">
        <h2 className="cel-h2">Nuestro itinerario del 14 💌</h2>
        <p className="cel-sub cel-sub--spaced">
          Plan oficial (aprobado por mi corazón y por la bonita 😌💖).
        </p>

        <div className="cel-itinerary">
          {itinerary.map((item, idx) => (
            <article className="cel-it-card" key={idx}>
              <div className="cel-it-imgWrap">
                {/* si quieres que al click se abra en modal:
                    onClick={() => openPhoto([{src:item.img, alt:item.title}], 0)} */}
                <img className="cel-it-img" src={item.img} alt={item.title} loading="lazy" />
                <div className="cel-it-tag">{item.tag}</div>
              </div>

              <div className="cel-it-body">
                <h3 className="cel-it-title">{item.title}</h3>
                <p className="cel-it-desc">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===== REAL DEL MONTE ===== */}
      <section className="cel-section">
        <h2 className="cel-h2">
          Real del Monte: el plan romántico de clima rico <span className="cel-heart">💘</span>
        </h2>

        <div className="cel-card">
          <p className="cel-mini">
            Real del Monte es ese pueblito mágico que pide caminar despacio, café caliente en mano, calles empedradas,
            neblinita ocasional y fotos espontáneas contigo 😌📸
          </p>

          <p className="cel-mini">
            Quiero ese viaje porque contigo todo se disfruta más… y porque claramente nos hace falta otro recuerdo bonito juntos 💖
          </p>

          <p className="cel-mini">
            Es un Pueblo Mágico con historia minera y un toque inglés bien curioso. Aquí nació la tradición del “paste”
            (sí o sí lo vamos a probar), y hay lugares perfectos para caminar, explorar y tomarnos mil fotos ✨
          </p>

          <p className="cel-mini">
            Plan de ataque: Plaza Principal, miradores, callecitas, algo calientito para el frío… y tú riéndote, que es mi parte favorita 🫶
          </p>

          <p className="cel-mini">
            Si quieres chismear más del lugar:{" "}
            <a href="https://visitarealdelmonte.com/" target="_blank" rel="noopener noreferrer">
              visitarealdelmonte.com
            </a>
          </p>

          <div className="cel-rdm-grid">
            {rdmPhotos.map((p, i) => (
              <button
                key={i}
                className="cel-rdm-photoBtn"
                onClick={() => openPhoto(rdmPhotos, i)}  // ✅ ahora abre SU galería
                aria-label={`Ver ${p.alt}`}
              >
                <img className="cel-rdm-photo" src={p.src} alt={p.alt} loading="lazy" />
                <span className="cel-rdm-glow" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CALENDARIO ===== */}
      <section className="cel-section">
        <h2 className="cel-h2">
          Elige nuestro fin de semana para Real del Monte <span className="cel-heart">💘</span>
        </h2>

        <div className="cel-card">
          <p className="cel-mini">
            Solo fines de semana 💖 y además desde la semana siguiente al 14 de febrero (desde <b>{niceDate(minDateStr)}</b>).
          </p>

          <div className="cel-date-row">
            <input
              className="cel-date"
              type="date"
              min={minDateStr}
              value={pickedDate}
              onChange={(e) => onPickDate(e.target.value)}
            />

            <span
              className={`cel-badge ${
                pickedDate
                  ? pickedDate < minDateStr
                    ? "warn"
                    : isWeekend(pickedDate)
                    ? "ok"
                    : "warn"
                  : ""
              }`}
            >
              {!pickedDate
                ? "📌 Aún no elegimos fecha"
                : pickedDate < minDateStr
                ? "⏳ Muy pronto"
                : isWeekend(pickedDate)
                ? "✅ Guardado"
                : "⚠️ Entre semana"}
            </span>
          </div>

          {pickedMsg && <div className="cel-toast">{pickedMsg}</div>}

          {pickedDate && pickedDate >= minDateStr && isWeekend(pickedDate) && (
            <div className="cel-memory">
              <p className="cel-mini">
                Queda guardado: <b>{niceDate(pickedDate)}</b> 💖
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ===== MODAL multi-galería ===== */}
      {openIndex != null && viewerImages.length > 0 && (
        <div className="cel-modal" role="dialog" aria-modal="true" onMouseDown={closePhoto}>
          <div className="cel-modal-card" onMouseDown={(e) => e.stopPropagation()}>
            <button className="cel-modal-close" onClick={closePhoto} aria-label="Cerrar">
              ✕
            </button>

            <img
              className="cel-modal-img"
              src={viewerImages[openIndex].src}
              alt={viewerImages[openIndex].alt}
            />

            <div className="cel-modal-actions">
              <button
                className="cel-modal-nav"
                onClick={() => setOpenIndex((i) => (i - 1 + viewerImages.length) % viewerImages.length)}
              >
                ←
              </button>

              <div className="cel-modal-caption">
                {viewerImages[openIndex].alt} • {openIndex + 1}/{viewerImages.length}
              </div>

              <button
                className="cel-modal-nav"
                onClick={() => setOpenIndex((i) => (i + 1) % viewerImages.length)}
              >
                →
              </button>
            </div>

            <div className="cel-modal-note">*Tip: usa ← → o ESC (sí, soy romántico… pero también tech 😌)</div>
          </div>
        </div>
      )}
    </div>
  );
}
