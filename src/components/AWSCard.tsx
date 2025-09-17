export default function AWSCard({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="bg-[#f3f3f7] p-6 rounded-2xl h-70 w-[calc(100svw-2rem)] max-w-110 border-[#f3f3f7] border-2 hover:border-black cursor-pointer font-aws flex flex-col">
      <h2 className="mb-2 text-lg">{title ?? ""}</h2>
      <p className="font-light">{description ?? ""}</p>
      <div className="mt-auto flex items-center gap-2">
        <span>Learn more</span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
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
