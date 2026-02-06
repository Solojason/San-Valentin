import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import IntroPoem from "./components/IntroPoem.jsx";
import MazeGame from "./components/MazeGame.jsx";
import ValentineQuestion from "./components/ValentineQuestion.jsx";
import Celebration from "./components/Celebration.jsx";

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.98 },
};

const pageTransition = {
  duration: 0.45,
  ease: "easeInOut",
};

function App() {
  const [step, setStep] = useState("intro");

  return (
    <div style={{ minHeight: "100svh", width: "100vw", overflow: "hidden" }}>
      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.div
            key="intro"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <IntroPoem onStart={() => setStep("maze")} />
          </motion.div>
        )}

        {step === "maze" && (
          <motion.div
            key="maze"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <MazeGame
              onWin={() => setStep("question")}
              title="💖 Llega al corazón 💖"
              winMessage="Eres increíble y sabía que llegarías hasta aquí 💖"
            />
          </motion.div>
        )}

        {step === "question" && (
          <motion.div
            key="question"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <ValentineQuestion
              names={{
                primary: "JennGeovis",
                nicknames: ["amor", "babe", "bonita", "JennGeovis"],
              }}
              onYes={() => setStep("celebration")}
            />
          </motion.div>
        )}

        {step === "celebration" && (
          <motion.div
            key="celebration"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <Celebration />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
