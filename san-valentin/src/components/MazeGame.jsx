import { useEffect, useRef, useState, useCallback } from "react";
import "../styles/maze.css";

// 1=wall, 0=path, 2=start, 3=goal, 4=fake, 5=bonus(+3s)
const MAZE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,0,0,1,0,0,0,1,0,5,0,1],
  [1,1,1,0,1,0,1,0,1,0,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,1,0,1],
  [1,0,1,1,1,0,1,1,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,0,1,1,1,0,1,1,1,0,1],
  [1,0,0,0,1,4,1,0,0,0,1,0,1],
  [1,1,1,0,1,0,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,0,1],
  [1,0,5,0,0,0,1,0,0,0,4,3,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const START_TIME = 20;
const BONUS_SECONDS = 3;
const HOLD_INTERVAL = 130;
const MOBILE_MAX_WIDTH = 900;

const formatTime = (seconds) => {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

export default function MazeGame({
  onWin,
  title = "💖 Llega al corazón 💖",
  winMessage = "Eres increíble y sabía que llegarías hasta aquí 💖",
}) {
  const cols = MAZE[0].length;
  const rows = MAZE.length;

  const [player, setPlayer] = useState({ x: 1, y: 1 });
  const [completed, setCompleted] = useState(false);
  const [lostReason, setLostReason] = useState(null); // "timeout" | "fake" | null
  const [timeLeft, setTimeLeft] = useState(START_TIME);
  const [canMove, setCanMove] = useState(true);
  const [sparklesUsed, setSparklesUsed] = useState([]);

  // responsive board sizing
  const boardRef = useRef(null);
  const [cellSize, setCellSize] = useState(42);
  const [gap, setGap] = useState(8);

  // touch / hold
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const holdRef = useRef(null);

  const stopHoldMove = useCallback(() => {
    clearInterval(holdRef.current);
    holdRef.current = null;
  }, []);

  // Detect touch device
  useEffect(() => {
    const check = () => {
      const isNarrow = window.innerWidth <= MOBILE_MAX_WIDTH;
      const noHover = window.matchMedia("(hover: none)").matches;
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
      setIsTouchDevice(isNarrow && (noHover || coarsePointer));
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Responsive cell sizing
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    const compute = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;

      const nextGap = w < 420 ? 6 : 8;
      const boardPadding = w < 420 ? 20 : 28;

      const maxCellW = Math.floor((w - boardPadding - nextGap * (cols - 1)) / cols);
      const maxCellH = Math.floor((h - boardPadding - nextGap * (rows - 1)) / rows);
      const nextCell = Math.max(22, Math.min(46, Math.min(maxCellW, maxCellH)));

      setGap(nextGap);
      setCellSize(nextCell);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cols, rows]);

  // Timer
  useEffect(() => {
    if (!canMove) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setCanMove(false);
          setLostReason("timeout");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [canMove]);

  const movePlayer = useCallback(
    (dx, dy) => {
      if (!canMove) return;

      setPlayer((prev) => {
        const newX = prev.x + dx;
        const newY = prev.y + dy;

        if (newX < 0 || newX >= cols || newY < 0 || newY >= rows) return prev;

        const cell = MAZE[newY][newX];
        if (cell === 1) return prev;

        // bonus
        if (cell === 5) {
          const key = `${newX}-${newY}`;
          if (!sparklesUsed.includes(key)) {
            setSparklesUsed((used) => [...used, key]);
            setTimeLeft((t) => t + BONUS_SECONDS);
          }
        }

        // fake
        if (cell === 4) {
          setCanMove(false);
          setLostReason("fake");
        }

        // goal
        if (cell === 3) {
          setCanMove(false);
          setTimeout(() => setCompleted(true), 650);
        }

        return { x: newX, y: newY };
      });
    },
    [canMove, cols, rows, sparklesUsed]
  );

  // Hold move for touch
  const startHoldMove = useCallback(
    (dx, dy) => {
      movePlayer(dx, dy);
      stopHoldMove();
      holdRef.current = setInterval(() => movePlayer(dx, dy), HOLD_INTERVAL);
    },
    [movePlayer, stopHoldMove]
  );

  useEffect(() => stopHoldMove, [stopHoldMove]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault();

      if (e.key === "ArrowUp") movePlayer(0, -1);
      if (e.key === "ArrowDown") movePlayer(0, 1);
      if (e.key === "ArrowLeft") movePlayer(-1, 0);
      if (e.key === "ArrowRight") movePlayer(1, 0);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer]);

  const resetGame = useCallback(() => {
    stopHoldMove();
    setPlayer({ x: 1, y: 1 });
    setTimeLeft(START_TIME);
    setLostReason(null);
    setCompleted(false);
    setCanMove(true);
    setSparklesUsed([]);
  }, [stopHoldMove]);

  // Screens
  if (lostReason) {
    const isTimeout = lostReason === "timeout";
    return (
      <div className="victory-screen">
        <h1>{isTimeout ? "⏳ Se acabó el tiempo…" : "💔 Oh no…"}</h1>
        <p>{isTimeout ? "No llegaste a tiempo 😢" : "Ese corazón no era real 😢"}</p>
        <button className="continue-btn" onClick={resetGame}>
          Intentar de nuevo 💖
        </button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="victory-screen">
        <h1>✨ ¡Lo lograste! ✨</h1>
        <p>{winMessage}</p>

        <div className="victory-actions">
          <button className="continue-btn" onClick={resetGame}>
            🔁 Jugar otra vez
          </button>

          <button className="continue-btn secondary" onClick={() => onWin?.()}>
            ➡️ Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="maze-wrapper">
      <h2 className="maze-title">{title}</h2>

      <p className={`timer ${timeLeft <= 5 ? "timer--danger" : ""}`}>
        ⏱️ {formatTime(timeLeft)}
      </p>

      <div className="maze-board" ref={boardRef}>
        <div
          className="maze"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gap: `${gap}px`,
          }}
        >
          {MAZE.map((row, y) =>
            row.map((cell, x) => {
              const isPlayer = player.x === x && player.y === y;

              const className = [
                "cell",
                cell === 1 && "wall",
                cell === 3 && "goal",
                cell === 4 && "fake-heart",
                cell === 5 && "sparkle",
                isPlayer && "player",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={`${x}-${y}`}
                  className={className}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    fontSize: Math.max(14, Math.floor(cellSize * 0.45)),
                  }}
                >
                  {isPlayer && "🧍‍♂️"}
                  {cell === 3 && "💖"}
                  {cell === 4 && "💔"}
                  {cell === 5 && "✨"}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mobile-controls">
        <p className="maze-hint">
          {isTouchDevice ? "Usa los controles ⬇️" : "Usa las flechas ⬆️⬇️⬅️➡️"}
        </p>

        {isTouchDevice && (
          <div className="dpad" aria-label="Controles táctiles">
            <button
              className="dpad-btn up"
              aria-label="Arriba"
              onPointerDown={(e) => { e.preventDefault(); startHoldMove(0, -1); }}
              onPointerUp={stopHoldMove}
              onPointerCancel={stopHoldMove}
              onPointerLeave={stopHoldMove}
            />

            <div className="dpad-row">
              <button
                className="dpad-btn left"
                aria-label="Izquierda"
                onPointerDown={(e) => { e.preventDefault(); startHoldMove(-1, 0); }}
                onPointerUp={stopHoldMove}
                onPointerCancel={stopHoldMove}
                onPointerLeave={stopHoldMove}
              />

              <button
                className="dpad-btn dpad-btn--center"
                aria-label="Centro"
                onPointerDown={(e) => e.preventDefault()}
              />

              <button
                className="dpad-btn right"
                aria-label="Derecha"
                onPointerDown={(e) => { e.preventDefault(); startHoldMove(1, 0); }}
                onPointerUp={stopHoldMove}
                onPointerCancel={stopHoldMove}
                onPointerLeave={stopHoldMove}
              />
            </div>

            <button
              className="dpad-btn down"
              aria-label="Abajo"
              onPointerDown={(e) => { e.preventDefault(); startHoldMove(0, 1); }}
              onPointerUp={stopHoldMove}
              onPointerCancel={stopHoldMove}
              onPointerLeave={stopHoldMove}
            />
          </div>
        )}
      </div>
    </div>
  );
}
