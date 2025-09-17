import { useState, useEffect, useCallback } from "react";
import AWSCard from "./components/AWSCard";
import Footer from "./components/Footer";
import arrowRight from "./assets/icons/arrow-right.svg";
import type { Service, Selection } from "./types/Service";
import KeyboardKey from "./components/KeyboardKey";
import { useGeneratePair } from "./hooks/useGeneratePair";
import { usePosthog } from "./hooks/usePosthog";

function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [selection, setSelection] = useState<Selection>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const { getPair } = useGeneratePair();
  const { captureAttempt } = usePosthog();
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    setServices(getPair());
  }, []);

  useEffect(() => {
    setStartTime(Date.now());
  }, [services]);

  const handleCardClick = useCallback(
    (clickedIndex: number) => {
      if (isAnimating || selection) return;

      const realService = services.find((s) => s.isReal);
      const fakeService = services.find((s) => !s.isReal);
      const selectedService = services[clickedIndex];

      if (realService && fakeService) {
        captureAttempt({
          real_aws_service: realService.title,
          fake_aws_service: fakeService.title,
          selected_answer: selectedService.title,
          is_correct: selectedService.isReal,
          time_to_answer_ms: Date.now() - startTime,
          question_pair_id: `${realService.title}-${fakeService.title}`,
        });
      }

      setSelection({ index: clickedIndex });

      setTimeout(() => {
        setSelection(null);
      }, 450);

      setTimeout(() => {
        setIsAnimating(true);
      }, 400);

      setTimeout(() => {
        setServices(getPair());
        setIsAnimating(false);
      }, 800);
    },
    [isAnimating, selection, services, getPair, captureAttempt, startTime]
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
      <section className="mt-6 px-4">
        <h2 className="text-2xl lg:text-3xl text-center font-normal">
          Which one is the real AWS service?
        </h2>
      </section>
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
      <Footer />
    </main>
  );
}

export default App;
