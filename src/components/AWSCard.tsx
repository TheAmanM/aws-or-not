export default function AWSCard({
  title,
  description,
  isReal,
  isSelected,
  isRevealed,
  onClick,
}: {
  title: string;
  description: string;
  isReal: boolean;
  isSelected: boolean;
  isRevealed: boolean;
  onClick: () => void;
}) {
  const getBorderClass = () => {
    if (isRevealed && isSelected) {
      return isReal ? "border-green-500" : "border-red-500";
    }
    return "border-transparent hover:border-black";
  };

  return (
    <div
      onClick={onClick}
      className={`bg-[#f3f3f7] p-6 rounded-2xl h-70 w-[calc(100svw-2rem)] max-w-110 border-2 cursor-pointer font-aws flex flex-col transition-colors duration-300 ${getBorderClass()}`}
    >
      <h2 className="mb-2 text-lg font-bold">{title ?? ""}</h2>
      <p>{description ?? ""}</p>
      <div className="mt-auto flex items-center gap-2">
        <span className="font-bold">Learn more</span>
        <span>
          <svg
            xmlns="http://www.w.org/2000/svg"
            viewBox="0 0 16 16"
            className="size-4"
          >
            <path
              d="M1 7.00001H11.91L8.32 3.74001L9.67 2.26001L15.17 7.26001C15.38 7.45001 15.5 7.72001 15.5 8.00001C15.5 8.28001 15.38 8.55001 15.17 8.74001L9.67 13.74L8.32 12.26L11.91 9.00001H1V7.00001Z"
              data-fill="true"
            ></path>
          </svg>
        </span>
      </div>
    </div>
  );
}
