import { useState } from "react";

import MazeGame from "./components/MazeGame.jsx";
import ValentineQuestion from "./components/ValentineQuestion.jsx";
import Celebration from "./components/Celebration.jsx";

function App() {
  const [step, setStep] = useState("maze"); // "maze" | "question" | "celebration"

  return (
    <div style={{ minHeight: "100svh", width: "100vw" }}>
      {step === "maze" && (
        <MazeGame
          onWin={() => setStep("question")}
          title="💖 Llega al corazón 💖"
          winMessage="Eres increíble y sabía que llegarías hasta aquí 💖"
        />
      )}

      {step === "question" && (
        <ValentineQuestion
          names={{
            primary: "Jennyfer Geovana Salas",
            nicknames: ["amor", "babe", "bonita", "JennGeovis"],
          }}
          onYes={() => setStep("celebration")}
        />
      )}

      {step === "celebration" && <Celebration />}
    </div>
  );
}

export default App;
