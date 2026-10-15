import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

type PageNavProps = {
  // Zero-based
  current: number;
  total: number;
  onChange: (page: number) => void;
};

const buttonClass =
  "rounded-md p-1 text-zinc-300 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

export default function PageNav({ current, total, onChange }: PageNavProps) {
  return (
    <div className="flex items-center gap-2">
      <button className={buttonClass} onClick={() => onChange(current - 1)} disabled={current <= 0} aria-label="Previous page">
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <span className="text-sm tabular-nums">{`Page ${current + 1} of ${Math.max(total, 1)}`}</span>
      <button className={buttonClass} onClick={() => onChange(current + 1)} disabled={current >= total - 1} aria-label="Next page">
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
