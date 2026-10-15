import { useEffect, useState } from "react";
import { TypingStatus, calculateStats } from "../../common/typing";
import { RunResult } from "../../common/types";
import { formatNumber } from "../../common/util";

type LiveStatsProps = {
  text: string;
  status: TypingStatus;
  startedAt: number | null;
  typedLength: number;
  missedCount: number;
  result: RunResult | null;
};

function formatElapsedTime(elapsedTime: number) {
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = Math.floor(elapsedTime % 60);
  const hundredths = Math.floor((elapsedTime % 1) * 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
}

// Owns its own ticking state so the rest of the game page doesn't re-render every frame
export default function LiveStats({ text, status, startedAt, typedLength, missedCount, result }: LiveStatsProps) {
  const [now, setNow] = useState(() => performance.now());

  useEffect(() => {
    if (status !== "running" || startedAt === null) return;
    setNow(performance.now());
    const interval = window.setInterval(() => setNow(performance.now()), 50);
    return () => window.clearInterval(interval);
  }, [status, startedAt]);

  const elapsed =
    status === "finished" && result ? result.timeSeconds : startedAt === null ? 0 : Math.max(0, (now - startedAt) / 1000);
  const live = calculateStats(text, typedLength, missedCount, elapsed);
  const wpm = result ? result.wpm : live.wpm;
  const accuracy = result ? result.accuracy : live.accuracy;
  // WPM is meaningless in the first moments of a run
  const showWpm = result !== null || elapsed >= 1;
  const progress = text ? (typedLength / text.length) * 100 : 0;

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-3 text-center">
        <Stat label="Time" value={formatElapsedTime(elapsed)} mono />
        <Stat label="WPM" value={showWpm ? formatNumber(wpm, 0) : "-"} />
        <Stat label="Accuracy" value={typedLength ? `${formatNumber(accuracy, 1)}%` : "-"} />
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800" aria-hidden="true">
        <div className="h-full bg-purple-500 transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg bg-zinc-800 py-2">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</div>
      <div className={`text-2xl sm:text-3xl font-bold tabular-nums ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
