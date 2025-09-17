export default function AWSCard({
  title,
  description,
  isReal,
  isSelected,
  isRevealed,
  isAnimating, // <-- ADD isAnimating to props
  onClick,
  keyboardShortcut,
}: {
  title: string;
  description: string;
  isReal: boolean;
  isSelected: boolean;
  isRevealed: boolean;
  isAnimating: boolean; // <-- ADD isAnimating to type definition
  onClick: () => void;
  keyboardShortcut?: React.ReactNode;
}) {
  const showOverlay = isRevealed && isSelected;

  return (
    <div
      onClick={onClick}
      // UPDATED LINE: The hover effect is now disabled during animations
      className={`relative bg-[#f3f3f7] p-6 rounded-2xl h-[27.5svh] max-h-60 lg:h-70 w-[calc(100svw-2rem)] max-w-110 border-2 border-transparent cursor-pointer font-aws flex flex-col transition-colors duration-300 ${
        !isRevealed && !isAnimating && "hover:border-black"
      }`}
    >
      {/* The rest of the component remains the same... */}
      <div
        className={`flex flex-col h-full transition-opacity duration-300 ${
          showOverlay ? "opacity-0" : "opacity-100"
        }`}
      >
        <h2 className="mb-2 text-lg font-bold">{title ?? ""}</h2>
        <p>{description ?? ""}</p>
        <div className="mt-auto flex items-center gap-2">
          <span className="font-bold">Learn more</span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              className="size-4"
            >
              <path d="M1 7.00001H11.91L8.32 3.74001L9.67 2.26001L15.17 7.26001C15.38 7.45001 15.5 7.72001 15.5 8.00001C15.5 8.28001 15.38 8.55001 15.17 8.74001L9.67 13.74L8.32 12.26L11.91 9.00001H1V7.00001Z" />
            </svg>
          </span>
          {keyboardShortcut}
        </div>
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center rounded-2xl transition-opacity duration-300
          ${showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"}
          ${isReal ? "bg-green-500" : "bg-red-500"}`}
      >
        {isReal ? (
          <svg
            className="size-28 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        ) : (
          <svg
            className="size-28 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
