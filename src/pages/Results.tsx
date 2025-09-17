// src/pages/Results.tsx (or wherever this component lives)

import { useRef } from "react"; // 👈 Import useRef
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../components/Chart";
import Teaser from "../components/Teaser";
import { useSaveData } from "../hooks/useSaveData";
import GenericShareButton from "../components/GenericShareButton";

const chartConfig = {
  desktop: {
    label: "score",
    color: "black",
  },
} satisfies ChartConfig;

export default function Results() {
  const { getData, getStreak } = useSaveData();
  const chartData = getData();
  const currentStreak = getStreak();

  // Create a ref for the graph section
  const graphSectionRef = useRef<HTMLElement>(null);

  const renderChart = (data: typeof chartData): React.ReactNode => {
    // ... (Your existing renderChart function remains unchanged)
    if (data === null) {
      return <p>Sorry, an error occured!</p>;
    } else if ("itemsLeft" in data) {
      return (
        <div className="w-full h-60 flex flex-col items-center justify-center [&>*]:text-center p-2">
          <h2 className="font-bold text-lg">Nothing here yet!</h2>
          <p>Play {data.itemsLeft} more rounds to start seeing statistics.</p>
        </div>
      );
    } else {
      return (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-60 w-full"
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              wrapperStyle={{
                backgroundColor: "#f3f3f7",
                borderRadius: "8px",
              }}
              content={<ChartTooltipContent className="border-black/10" />}
            />
            <Area
              dataKey="score"
              type="natural"
              fill="black"
              fillOpacity={0.2}
              stroke="black"
            />
          </AreaChart>
        </ChartContainer>
      );
    }
  };

  return (
    <main className="h-svh flex flex-col font-aws">
      <Teaser />
      <section className="flex flex-col flex-1 items-center mx-4 justify-center gap-4">
        <section className="bg-[#f3f3f7] mx-4 w-full max-w-xl lg:max-w-3xl py-4 px-5 rounded-xl flex items-center">
          <div>
            <h2 className="font-bold text-lg lg:text-2xl">Streak</h2>
            <p className="lg:text-lg lg:mt-1">
              Continue to play in order to get a higher streak!
            </p>
          </div>
          <div className="ml-auto flex flex-col items-center justify-center">
            <span className="text-4xl lg:text-5xl font-bold mx-4">
              {currentStreak}
            </span>
          </div>
        </section>

        {/* 👇 Attach the ref to the section you want to capture */}
        <section
          ref={graphSectionRef}
          className="bg-[#f3f3f7] mx-4 w-full max-w-xl lg:max-w-3xl pt-8 pb-4 px-5 rounded-xl flex items-center"
        >
          {renderChart(chartData)}
        </section>

        <section className="flex items-center justify-end w-full max-w-xl lg:max-w-3xl gap-4">
          <a href="#">
            <button className="bg-[#f3f3f7] p-2.5 rounded-lg flex items-center gap-2 cursor-pointer">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-left-icon lucide-arrow-left size-5"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </span>
            </button>
          </a>

          {/* 👇 Replace the old button with the new ShareButton component */}
          {/* <ShareButton
            targetRef={graphSectionRef}
            shareText={`I have a streak of ${currentStreak}! Check out my progress. You can play too: ${window.location.origin}`}
            shareUrl={window.location.origin}
          /> */}
          <GenericShareButton targetRef={graphSectionRef} />
        </section>
      </section>
    </main>
  );
}
