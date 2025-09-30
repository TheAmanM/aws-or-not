import { useRef } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../components/Chart";
import Teaser from "../components/Teaser";
import { useLastGameData } from "../hooks/useLastGameData";
import GenericShareButton from "../components/GenericShareButton";
import { useHighScores } from "../hooks/useHighScores";
import { useTheme } from "../providers/ThemeProvider";

const chartConfig = {
  desktop: {
    label: "score",
    color: "black",
  },
} satisfies ChartConfig;

export default function Results() {
  const { getLastGameData, getLongestStreak } = useLastGameData();
  const { getHighScore } = useHighScores();
  const chartData = getLastGameData();
  const longestStreak = getLongestStreak();
  const highScore = getHighScore();
  const { theme } = useTheme();

  const graphSectionRef = useRef<HTMLElement>(null);

  const renderChart = (
    data: ReturnType<typeof getLastGameData>
  ): React.ReactNode => {
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
              bottom: 0,
              right: 12,
              top: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="round" // Use "round" for the X-axis
              tickLine={false}
              tick={{
                stroke: theme === "normal" ? "#666" : "#ddd",
              }}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              domain={[0, 1]} // Domain is perfect for average score
              tickCount={6}
              tick={{
                stroke: theme === "normal" ? "#666" : "#ddd",
              }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              wrapperStyle={{
                backgroundColor: theme === "normal" ? "#f3f3f7" : "#2a2a36",
                borderRadius: "8px",
              }}
              content={
                <ChartTooltipContent className="border-black/10 dark:border-white/10" />
              }
            />
            <defs>
              <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                {theme === "normal" ? (
                  <>
                    <stop offset="5%" stopColor="black" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="black" stopOpacity={0.15} />
                  </>
                ) : (
                  <>
                    <stop offset="5%" stopColor="white" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="white" stopOpacity={0.15} />
                  </>
                )}
              </linearGradient>
            </defs>
            <Area
              dataKey="score"
              type="natural" // "natural" creates a smooth curve for the average
              fill="url(#fillScore)"
              stroke={theme === "normal" ? "black" : "white"}
            />
          </AreaChart>
        </ChartContainer>
      );
    }
  };

  return (
    <main className="h-svh flex flex-col font-aws bg-white dark:bg-[#1a1a24]">
      <Teaser />
      <section className="flex flex-col flex-1 items-center mx-4 justify-center gap-4">
        <section className="bg-[#f3f3f7] mx-4 w-full max-w-xl lg:max-w-3xl py-4 px-5 rounded-xl flex items-center dark:bg-[#2a2a36] dark:text-white">
          <div>
            <h2 className="font-bold text-lg lg:text-2xl">Longest Streak</h2>
            <p>Your best run in the last game.</p>
          </div>
          <div className="ml-auto flex flex-col items-center justify-center">
            <span className="text-4xl lg:text-5xl font-bold mx-4">
              {longestStreak}
            </span>
          </div>
        </section>

        <section className="bg-[#f3f3f7] mx-4 w-full max-w-xl lg:max-w-3xl py-4 px-5 rounded-xl flex items-center dark:bg-[#2a2a36] dark:text-white">
          <div>
            <h2 className="font-bold text-lg lg:text-2xl">High Score</h2>
            <p>Your best score across all games.</p>
          </div>
          <div className="ml-auto flex flex-col items-center justify-center">
            <span className="text-4xl lg:text-5xl font-bold mx-4">
              {highScore !== null ? highScore : 0}
            </span>
          </div>
        </section>

        <section
          ref={graphSectionRef}
          className="bg-[#f3f3f7] mx-4 w-full max-w-xl lg:max-w-3xl pt-8 pb-4 px-5 rounded-xl flex items-center dark:bg-[#2a2a36] dark:text-white"
        >
          {renderChart(chartData)}
        </section>

        <section className="flex items-center justify-end w-full max-w-xl lg:max-w-3xl gap-4">
          <a href="#/">
            <button className="bg-[#f3f3f7] p-2.5 rounded-lg flex items-center gap-2 cursor-pointer dark:bg-[#2a2a36] dark:text-white">
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
