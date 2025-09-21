interface ProgressBarProps {
  current: number;
  total: number;
}

function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = Math.min((current / total) * 100, 100);

  return (
    <div className="w-full rounded-full h-2.5 mb-4 mt-8 px-8">
      <div className="w-full bg-[#f3f3f7] rounded-full h-2.5 mb-4">
        <div
          className="bg-black h-2.5 rounded-full transition-[width]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ProgressBar;
