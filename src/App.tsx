import { useState, useEffect } from "react";
import AWSCard from "./components/AWSCard";
import Footer from "./components/Footer";
import Header from "./components/Header";

import type { Service, Selection } from "./types/Service";

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

  // -- NEW ANIMATION LOGIC --
  const handleCardClick = (clickedIndex: number) => {
    // Prevent clicks during the sequence
    if (isAnimating || selection) return;

    // 1. Show the result overlay
    setSelection({ index: clickedIndex });

    // 2. After 1.2s, hide the overlay. The overlay's fade-out takes 300ms.
    setTimeout(() => {
      setSelection(null);
    }, 800);

    // 3. After the overlay is gone (1200ms + 300ms), start the slide animation.
    setTimeout(() => {
      setIsAnimating(true);
    }, 750);

    // 4. After the slide animation is done (1500ms + 300ms), load new content.
    setTimeout(() => {
      setServices(getServices());
      setIsAnimating(false);
    }, 1500);
  };

  return (
    <main className="flex flex-col h-svh w-svw overflow-hidden">
      <Header />
      <section className="mt-8 px-4">
        <h2 className="text-2xl lg:text-3xl text-center font-normal">
          Which one is the real AWS service?
        </h2>
      </section>
      <section
        // The slide animation is now faster (duration-300)
        className={`flex-1 flex max-lg:flex-col items-center justify-center gap-4 lg:gap-16 transition-all duration-500 ease-in-out
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
            />
            <p className="text-[#888]">or</p>
            <AWSCard
              title={services[1].title}
              description={services[1].description}
              isReal={services[1].isReal}
              isSelected={selection?.index === 1}
              isRevealed={selection !== null}
              isAnimating={isAnimating}
              onClick={() => handleCardClick(1)}
            />
          </>
        )}
      </section>
      <Footer />
    </main>
  );
}

export default App;
