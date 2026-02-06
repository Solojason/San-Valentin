import "../styles/IntroPoem.css";

export default function IntroPoem({ onStart }) {
  return (
    <div className="intro-wrap">
      <div className="intro-card">
        <div className="intro-badge">💌 Para mi amor</div>

        <h1 className="intro-title">JennGeovis</h1>

        <div className="intro-poem" role="article" aria-label="Poema de inicio">
          <p>
            Oye, <strong>mi amor</strong>…
            <br />
            hoy vengo a hacer algo muy serio,
            <br />
            pero con mi nivel normal de payaso. 🤡💖
          </p>

          <p>
            Si el mundo se pone raro,
            <br />
            tú me lo arreglas con una sonrisa;
            <br />
            y si yo me hago el fuerte,
            <br />
            tú me recuerdas que contigo sí se puede.
          </p>

          <p>
            Así que antes de la pregunta importante…
            <br />
            te dejo un reto chiquito:
            <br />
            <strong>llega al corazón</strong> sin caer en trampas 😈
            <br />
            <strong>tienes solo 20 segundos.</strong>
          </p>

          <p className="intro-sign">
            Con amor,
            <br />
            <strong>tu San Valentín</strong> 🌹
          </p>
        </div>

        <button className="intro-btn" onClick={() => onStart?.()}>
          Empezar 💖
        </button>
      </div>
    </div>
  );
}
