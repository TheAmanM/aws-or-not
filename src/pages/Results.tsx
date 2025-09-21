import { useRef } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../components/Chart";
import Teaser from "../components/Teaser";
import { useLastGameData } from "../hooks/useLastGameData"; // Use the new hook
import GenericShareButton from "../components/GenericShareButton";

const chartConfig = {
  desktop: {
    label: "score",
    color: "black",
  },
} satisfies ChartConfig;

export default function Results() {
  const { getLastGameData, getLongestStreak } = useLastGameData();
  const chartData = getLastGameData();
  const longestStreak = getLongestStreak();

  const graphSectionRef = useRef<HTMLElement>(null);

  const renderChart = (data: typeof chartData): React.ReactNode => {
    if (data === null) {
      return (
        <div className="w-full h-60 flex flex-col items-center justify-center [&>*]:text-center p-2">
          <h2 className="font-bold text-lg">No game data found!</h2>
          <p>Play a game to see your results.</p>
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
              left: -28,
              bottom: -8,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="round"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              domain={[0, 1]}
              tickCount={2}
              tickFormatter={(value) => (value === 1 ? "Correct" : "Incorrect")}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              wrapperStyle={{
                backgroundColor: "#f3f3f7",
                borderRadius: "8px",
              }}
              content={<ChartTooltipContent className="border-black/10" />}
            />
            <defs>
              <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="black" stopOpacity={0.3} />
                <stop offset="95%" stopColor="black" stopOpacity={0.15} />
              </linearGradient>
            </defs>
            <Area
              dataKey="score"
              type="step"
              fill="url(#fillScore)"
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
            <h2 className="font-bold text-lg lg:text-2xl">Longest Streak</h2>
            <p className="lg:text-lg lg:mt-1">
              Your best run in the last game.
            </p>
          </div>
          <div className="ml-auto flex flex-col items-center justify-center">
            <span className="text-4xl lg:text-5xl font-bold mx-4">
              {longestStreak}
            </span>
          </div>
        </section>

        <section
          ref={graphSectionRef}
          className="bg-[#f3f3f7] mx-4 w-full max-w-xl lg:max-w-3xl pt-8 pb-4 px-5 rounded-xl flex items-center"
        >
          {renderChart(chartData)}
        </section>

        <section className="flex items-center justify-end w-full max-w-xl lg:max-w-3xl gap-4">
          {/* Corrected href for HashRouter */}
          <a href="#/">
            <button className="bg-[#f3f3f7] p-2.5 rounded-lg flex items-center gap-2 cursor-pointer">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-left-icon lucide-arrow-left"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </span>
            </button>
          </a>
          <GenericShareButton targetRef={graphSectionRef} />
        </section>
      </section>
    </main>
  );
}
