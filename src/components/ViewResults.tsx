export default function ViewResults() {
  return (
    <a href="#results">
      <button className="bg-[#f3f3f7] py-2.5 px-3 rounded-lg flex items-center gap-2 cursor-pointer mx-auto">
        <h2 className="font-bold">View Results</h2>
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
          className="lucide lucide-arrow-right-icon lucide-arrow-right size-5"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
    </a>
  );
}
