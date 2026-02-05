// src/components/Celebration/Celebration.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import YouTubeAudio from "../components/Audio/YoutubeAudio";
import "../styles/celebration.css";

export default function Celebration() {
  const playerRef = useRef(null);
  const [blocked, setBlocked] = useState(false);

  const videoId = "HQEHK7VjaQE"; // Rare - Selena Gomez

  const tryAutoplay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;

    try {
      p.setVolume(65);
      p.playVideo();

      // verificamos si realmente quedó reproduciendo
      setTimeout(() => {
        try {
          const state = p.getPlayerState?.(); // 1 = playing
          if (state !== 1) setBlocked(true);
          else setBlocked(false);
        } catch {
          setBlocked(true);
        }
      }, 350);
    } catch {
      setBlocked(true);
    }
  }, []);

  useEffect(() => {
    // reintento en la primera interacción (tap/scroll/click/tecla)
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

  return (
    <div className="cel-wrap">
      <YouTubeAudio
        videoId={videoId}
        onReady={(player) => {
          playerRef.current = player;
          tryAutoplay(); // intenta sin click
        }}
      />



      <h1 className="cel-title">OFICIALMENTE: MI SAN VALENTÍN 💖</h1>
      <p className="cel-sub">Ok amor… ya que dijiste que sí, ahora agárrate 😌</p>

      <div className="cel-hint">👇 Desliza hacia abajo 👇</div>

      {/* aquí metemos carrusel + itinerario + calendario + Real del Monte */}
    </div>
  );
}
