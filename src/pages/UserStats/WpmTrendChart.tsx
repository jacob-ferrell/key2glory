import { KeyboardEvent, PointerEvent, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Score } from "../../common/types";
import { formatNumber } from "../../common/util";

// Single series, so no legend: the section title names it
const SERIES_COLOR = "#8b5cf6";
const SURFACE = "#27272a"; // zinc-800, the card background
const GRID = "#3f3f46"; // zinc-700

const HEIGHT = 220;
const PAD = { top: 16, right: 56, bottom: 24, left: 40 };

function niceMax(value: number) {
  const step = value <= 50 ? 10 : value <= 150 ? 25 : 50;
  return Math.max(step, Math.ceil(value / step) * step);
}

/** WPM of recent runs, oldest to newest. */
export default function WpmTrendChart({ scores }: { scores: Score[] }) {
  const runs = useMemo(() => [...scores].reverse(), [scores]);
  const [active, setActive] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Draw at the real pixel width so text and strokes don't scale with the container
  const [width, setWidth] = useState(640);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.round(entry.contentRect.width))));
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const maxY = niceMax(Math.max(...runs.map((s) => s.wpm)));
  const ticks = [0, maxY / 2, maxY];
  const innerW = width - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (runs.length === 1 ? innerW / 2 : (i / (runs.length - 1)) * innerW);
  const y = (wpm: number) => PAD.top + innerH - (wpm / maxY) * innerH;

  const line = runs.map((s, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(s.wpm)}`).join(" ");
  const area = `${line} L${x(runs.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const last = runs.length - 1;

  function handlePointerMove(e: PointerEvent<SVGSVGElement>) {
    const rect = svgRef.current!.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * width;
    // Snap the crosshair to the nearest run
    let nearest = 0;
    runs.forEach((_, i) => {
      if (Math.abs(x(i) - svgX) < Math.abs(x(nearest) - svgX)) nearest = i;
    });
    setActive(nearest);
  }

  function handleKeyDown(e: KeyboardEvent<SVGSVGElement>) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const current = active ?? last;
    setActive(Math.min(last, Math.max(0, current + (e.key === "ArrowRight" ? 1 : -1))));
  }

  const activeRun = active !== null ? runs[active] : null;
  // Keep the tooltip inside the chart
  const tooltipLeft = active !== null ? Math.min(Math.max((x(active) / width) * 100, 12), 88) : 0;

  return (
    <div>
      <div ref={containerRef} className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          width={width}
          height={HEIGHT}
          className="block touch-none outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
          role="img"
          aria-label={`WPM over your last ${runs.length} runs, from ${formatNumber(runs[0].wpm)} to ${formatNumber(runs[last].wpm)}. Use arrow keys to inspect runs.`}
          tabIndex={0}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setActive(null)}
          onKeyDown={handleKeyDown}
          onBlur={() => setActive(null)}
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(tick)} y2={y(tick)} stroke={GRID} strokeWidth={1} />
              <text x={PAD.left - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-zinc-400 text-[11px]">
                {tick}
              </text>
            </g>
          ))}
          <text x={PAD.left} y={HEIGHT - 6} className="fill-zinc-500 text-[11px]">
            Oldest
          </text>
          <text x={width - PAD.right} y={HEIGHT - 6} textAnchor="end" className="fill-zinc-500 text-[11px]">
            Latest
          </text>

          <path d={area} fill={SERIES_COLOR} fillOpacity={0.1} />
          <path d={line} fill="none" stroke={SERIES_COLOR} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {activeRun !== null && active !== null ? (
            <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={y(0)} stroke="#a1a1aa" strokeWidth={1} />
          ) : null}
          {runs.map((s, i) =>
            i === last || i === active ? (
              <circle key={s.id} cx={x(i)} cy={y(s.wpm)} r={5} fill={SERIES_COLOR} stroke={SURFACE} strokeWidth={2} />
            ) : null
          )}
          {/* Direct label on the latest run only */}
          <text x={x(last) + 10} y={y(runs[last].wpm)} dy="0.32em" className="fill-zinc-100 text-[12px] font-semibold">
            {formatNumber(runs[last].wpm, 0)}
          </text>
        </svg>

        {activeRun !== null ? (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-950/95 px-3 py-2 text-xs shadow-lg ring-1 ring-zinc-700"
            style={{ left: `${tooltipLeft}%` }}
          >
            <div className="flex items-center gap-2">
              <span className="inline-block h-0.5 w-3 rounded" style={{ background: SERIES_COLOR }} />
              <span className="text-sm font-bold text-zinc-50">{formatNumber(activeRun.wpm)} WPM</span>
            </div>
            <div className="text-zinc-400">
              {formatNumber(activeRun.accuracy)}% accuracy · run {active! + 1} of {runs.length}
            </div>
          </div>
        ) : null}
      </div>

      <button
        onClick={() => setShowTable((v) => !v)}
        className="mt-2 text-xs font-semibold text-purple-300 hover:underline"
        aria-expanded={showTable}
      >
        {showTable ? "Hide table" : "Show as table"}
      </button>
      {showTable ? (
        <div className="mt-2 max-h-64 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-zinc-400">
              <tr>
                <th className="px-2 py-1">Run</th>
                <th className="px-2 py-1 text-right">WPM</th>
                <th className="px-2 py-1 text-right">Accuracy</th>
                <th className="px-2 py-1 text-right">Test</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((s, i) => (
                <tr key={s.id} className="border-t border-zinc-700/60">
                  <td className="px-2 py-1">{i + 1}</td>
                  <td className="px-2 py-1 text-right tabular-nums">{formatNumber(s.wpm)}</td>
                  <td className="px-2 py-1 text-right tabular-nums">{formatNumber(s.accuracy)}%</td>
                  <td className="px-2 py-1 text-right">
                    <Link to={`/typing-test/${s.typingTest}`} className="text-purple-300 hover:underline">
                      #{s.typingTest}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
