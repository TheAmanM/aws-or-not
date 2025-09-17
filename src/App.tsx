import { useState, useEffect, useCallback } from "react";
import AWSCard from "./components/AWSCard";
import Footer from "./components/Footer";
// import Header from "./components/Header";

import arrowRight from "./assets/icons/arrow-right.svg";

import type { Service, Selection } from "./types/Service";
import KeyboardKey from "./components/KeyboardKey";

// Mock getServices function remains the same...
const getServices = () => {
  const allServices = [
    {
      title: "Amazon Aurora",
      description:
        "MySQL and PostgreSQL-compatible relational database built for the cloud.",
      isReal: true,
    },
    {
      title: "Amazon Elastic Compute Cloud (EC2)",
      description: "Provides secure, resizable compute capacity in the cloud.",
      isReal: true,
    },
    {
      title: "Amazon CloudTrail Mix",
      description:
        "A fictional service that combines logging with a DJ-style audio mixer for your cloud events.",
      isReal: false,
    },
    {
      title: "AWS Graviton Buzz",
      description:
        "A fake service that promises to increase processor performance by generating a low-frequency hum.",
      isReal: false,
    },
  ] as Service[];
  const real = allServices.filter((s) => s.isReal);
  const fake = allServices.filter((s) => !s.isReal);
  const pair = [
    real[Math.floor(Math.random() * real.length)],
    fake[Math.floor(Math.random() * fake.length)],
  ];
  return pair.sort(() => Math.random() - 0.5);
};

function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [selection, setSelection] = useState<Selection>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    setServices(getServices());
  }, []);

  // Wrapped handleCardClick in useCallback for performance
  const handleCardClick = useCallback(
    (clickedIndex: number) => {
      // Prevent clicks/keypresses during the sequence
      if (isAnimating || selection) return;

      // 1. Show the result overlay
      setSelection({ index: clickedIndex });

      // 2. Hide the overlay after a delay
      setTimeout(() => {
        setSelection(null);
      }, 800);

      // 3. Start the slide animation
      setTimeout(() => {
        setIsAnimating(true);
      }, 750);

      // 4. Load new content after the animation
      setTimeout(() => {
        setServices(getServices());
        setIsAnimating(false);
      }, 1500);
    },
    [isAnimating, selection]
  ); // Dependencies for useCallback

  // -- NEW: useEffect for Keyboard Controls --
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Use e.key to check which key was pressed
      if (e.key === "ArrowLeft" || e.key === "a") {
        handleCardClick(0); // Trigger left card
      } else if (e.key === "ArrowRight" || e.key === "d") {
        handleCardClick(1); // Trigger right card
      }
    };

    // Add event listener when the component mounts
    window.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleCardClick]); // Re-run effect if handleCardClick changes

  return (
    <main className="flex flex-col h-svh w-svw overflow-hidden">
      {/* <Header /> */}
      <section className="mt-6 px-4">
        <h2 className="text-2xl lg:text-3xl text-center font-normal">
          Which one is the real AWS service?
        </h2>
      </section>
      <section
        className={`flex-1 flex max-lg:flex-col items-center justify-center gap-4 lg:gap-16 transition-all duration-500 ease-in-out
          ${
            isAnimating
              ? "opacity-0 -translate-y-8"
              : // The translate-y-0 was missing, this fixes a small visual bug
                "opacity-100 translate-y-0"
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
