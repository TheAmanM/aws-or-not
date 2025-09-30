import { useState, useEffect, useCallback } from "react";
import AWSCard from "../components/AWSCard";
import Footer from "../components/Footer";
import arrowRight from "../assets/icons/arrow-right.svg";
import type { Service, Selection } from "../types/Service";
import KeyboardKey from "../components/KeyboardKey";
import { useGeneratePair } from "../hooks/useGeneratePair";
import { usePosthog } from "../hooks/usePosthog";
import Teaser from "../components/Teaser";
import { useSaveData } from "../hooks/useSaveData";
import ProgressBar from "../components/ProgressBar";
import { useHighScores } from "../hooks/useHighScores";

function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [selection, setSelection] = useState<Selection>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const { getPair } = useGeneratePair();
  const { captureAttempt } = usePosthog();
  const [startTime, setStartTime] = useState(Date.now());
  const { saveResult } = useSaveData();
  const { saveHighScore } = useHighScores();

  const [round, setRound] = useState(0);
  const [gameResults, setGameResults] = useState<boolean[]>([]);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [gameMode, setGameMode] = useState<"normal" | "endless">(() => {
    const savedMode = localStorage.getItem("gameMode");
    return (savedMode as "normal" | "endless") || "normal";
  });

  useEffect(() => {
    localStorage.setItem("gameMode", gameMode);
  }, [gameMode]);
  const TOTAL_ROUNDS = 10;

  const handleModeToggle = () => {
    setGameMode((prev) => (prev === "normal" ? "endless" : "normal"));
    // Reset game state when mode changes
    setServices(getPair());
    setRound(1);
    setGameResults([]);
    setIsRedirecting(false);
  };

  // This effect now runs only once on component mount.
  useEffect(() => {
    setServices(getPair());
    setRound(1);
    setGameResults([]);
  }, []); // <-- Empty dependency array is crucial to prevent loops.

  const endGame = useCallback(() => {
    if (isRedirecting) return;

    const score = gameResults.filter(Boolean).length;
    saveHighScore(score);

    localStorage.setItem("lastGame", JSON.stringify(gameResults));
    setIsRedirecting(true);
    window.location.hash = "#/results";
  }, [gameResults, saveHighScore, isRedirecting]);

  useEffect(() => {
    if (gameMode === "normal" && round > TOTAL_ROUNDS) {
      endGame();
    }
  }, [round, gameMode, endGame]);

  useEffect(() => {
    setStartTime(Date.now());
  }, [services]);

  const handleCardClick = useCallback(
    (clickedIndex: number) => {
      if (isAnimating || selection) return;
      if (gameMode === "normal" && round > TOTAL_ROUNDS) return;

      const realService = services.find((s) => s.isReal);
      const fakeService = services.find((s) => !s.isReal);
      const selectedService = services[clickedIndex];
      const isCorrect = selectedService.isReal;

      if (realService && fakeService) {
        captureAttempt({
          real_aws_service: realService.title,
          fake_aws_service: fakeService.title,
          selected_answer: selectedService.title,
          is_correct: isCorrect,
          time_to_answer_ms: Date.now() - startTime,
          question_pair_id: `${realService.title}-${fakeService.title}`,
        });
      }

      saveResult(isCorrect);
      setGameResults((prevResults) => [...prevResults, isCorrect]);
      setSelection({ index: clickedIndex });

      if (gameMode === "endless" && !isCorrect) {
        setTimeout(() => {
          endGame();
        }, 800);
        return;
      }

      setTimeout(() => {
        setSelection(null);
      }, 450);

      setTimeout(() => {
        setIsAnimating(true);
      }, 400);

      setTimeout(() => {
        setRound((prevRound) => prevRound + 1);
        if (gameMode === "normal" && round >= TOTAL_ROUNDS) {
          // In normal mode, let the useEffect handle the end
        } else {
          setServices(getPair());
        }
        setIsAnimating(false);
      }, 800);
    },
    [
      isAnimating,
      selection,
      services,
      getPair,
      captureAttempt,
      startTime,
      saveResult,
      round,
      gameMode,
      endGame,
    ]
  );

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        handleCardClick(0);
      } else if (e.key === "ArrowRight" || e.key === "d") {
        handleCardClick(1);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleCardClick]);

  return (
    <main className="flex flex-col h-svh w-svw overflow-hidden">
      <Teaser />
      {gameMode === "normal" ? (
        <ProgressBar
          current={Math.min(round, TOTAL_ROUNDS)}
          total={TOTAL_ROUNDS}
        />
      ) : (
        <div className="h-2" /> // Keep spacing consistent
      )}
      <div className="flex items-center justify-center my-4">
        <span className="font-light text-base">
          {gameMode === "normal" ? (
            <>
              <span className="text-3xl font-semibold text-[#222]">
                {Math.min(round, TOTAL_ROUNDS)}{" "}
              </span>
              of {TOTAL_ROUNDS}
            </>
          ) : (
            <>
              Score:{" "}
              <span className="text-3xl font-semibold text-[#222]">
                {gameResults.filter(Boolean).length}
              </span>
            </>
          )}
        </span>
      </div>
      <section
        className={`flex-1 flex max-lg:flex-col items-center justify-center gap-4 lg:gap-16 transition-all duration-250 ease-in-out
          ${
            isAnimating
              ? "opacity-0 -translate-y-8"
              : "opacity-100 translate-y-0"
          }
        `}
      >
        {services.length > 0 && (
          <>
            <AWSCard
              title={services[0].title}
              description={services[0].description}
              isReal={services[0].isReal}
              isSelected={selection?.index === 0}
              isRevealed={selection !== null}
              isAnimating={isAnimating}
              onClick={() => handleCardClick(0)}
              keyboardShortcut={
                <div className="flex items-center gap-2 ml-auto">
                  <KeyboardKey>
                    <img
                      src={arrowRight}
                      alt="Press A or Left Arrow"
                      className="size-4 rotate-180"
                    />
                  </KeyboardKey>
                  <p className="text-xs text-[#0006]">/</p>
                  <KeyboardKey>
                    <h2 className="text-sm">A</h2>
                  </KeyboardKey>
                </div>
              }
            />
            <p className="text-[#888] lg:text-lg">or</p>
            <AWSCard
              title={services[1].title}
              description={services[1].description}
              isReal={services[1].isReal}
              isSelected={selection?.index === 1}
              isRevealed={selection !== null}
              isAnimating={isAnimating}
              onClick={() => handleCardClick(1)}
              keyboardShortcut={
                <div className="flex items-center gap-2 ml-auto">
                  <KeyboardKey>
                    <img
                      src={arrowRight}
                      alt="Press A or Left Arrow"
                      className="size-4"
                    />
                  </KeyboardKey>
                  <p className="text-xs text-[#0006]">/</p>
                  <KeyboardKey>
                    <h2 className="text-sm">D</h2>
                  </KeyboardKey>
                </div>
              }
            />
          </>
        )}
      </section>
      <section className="flex items-center justify-center py-2 lg:py-3">
        <button
          onClick={handleModeToggle}
          className="bg-[#f3f3f7] py-2.5 px-3 rounded-lg flex items-center gap-2 cursor-pointer"
        >
          <p className="font-normal">
            Switch to {gameMode === "normal" ? "Endless" : "Normal"} Mode
          </p>
        </button>
      </section>
      <Footer />
    </main>
  );
}

export default Home;
