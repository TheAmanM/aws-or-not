import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../components/Chart";
import Teaser from "../components/Teaser";
import { useSaveData } from "../hooks/useSaveData";

const chartConfig = {
  desktop: {
    label: "score",
    color: "black",
  },
} satisfies ChartConfig;

export default function Results() {
  const { getData, getStreak } = useSaveData();
  const chartData = getData();

  const renderChart = (data: typeof chartData): React.ReactNode => {
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
              {getStreak()}
            </span>
          </div>
        </section>
        <section className="bg-[#f3f3f7] mx-4 w-full max-w-xl lg:max-w-3xl pt-8 pb-4 px-5 rounded-xl flex items-center">
          {renderChart(chartData)}
        </section>
        <section className="flex items-center justify-end w-full max-w-xl lg:max-w-3xl gap-4">
          <a href="/">
            <button className="bg-[#f3f3f7] p-2.5 rounded-lg flex items-center gap-2 cursor-pointer">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-arrow-left-icon lucide-arrow-left size-5"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              </span>
            </button>
          </a>
          <button className="bg-[#f3f3f7] p-2.5 rounded-lg flex items-center gap-2">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-share2-icon lucide-share-2 size-5"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
              </svg>
            </span>
          </button>
        </section>
      </section>
    </main>
  );
}
