import { useMemo, useState } from "react";
import { displayChar } from "../../common/util";

// US QWERTY: [unshifted, shifted] per key
const ROWS: [string, string][][] = [
  ["`~", "1!", "2@", "3#", "4$", "5%", "6^", "7&", "8*", "9(", "0)", "-_", "=+"].map((k) => [k[0], k[1]]),
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[{", "]}", "\\|"].map((k) => [k[0], k[1] ?? k[0].toUpperCase()]),
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";:", "'\""].map((k) => [k[0], k[1] ?? k[0].toUpperCase()]),
  ["z", "x", "c", "v", "b", "n", "m", ",<", ".>", "/?"].map((k) => [k[0], k[1] ?? k[0].toUpperCase()]),
];
const ROW_INDENT = ["ml-0", "ml-4", "ml-6", "ml-10"];

// Sequential single hue (purple-500): opacity carries magnitude
const HEAT_RGB = "139, 92, 246";

type KeyStats = { total: number; chars: [string, number][] };

export default function KeyboardHeatmap({ missedCharacters }: { missedCharacters: Map<string, number> }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const { byKey, max, other } = useMemo(() => {
    const byKey = new Map<string, KeyStats>();
    const keyFor = new Map<string, string>();
    ROWS.flat().forEach(([base, shifted]) => {
      keyFor.set(base, base);
      keyFor.set(shifted, base);
    });
    keyFor.set(" ", " ");
    const other: [string, number][] = [];
    missedCharacters.forEach((count, char) => {
      const key = keyFor.get(char);
      if (!key) {
        other.push([char, count]);
        return;
      }
      const stats = byKey.get(key) ?? { total: 0, chars: [] };
      stats.total += count;
      stats.chars.push([char, count]);
      byKey.set(key, stats);
    });
    const max = Math.max(1, ...Array.from(byKey.values(), (s) => s.total));
    return { byKey, max, other };
  }, [missedCharacters]);

  function renderKey(base: string, label: string, className = "w-9") {
    const stats = byKey.get(base);
    const intensity = stats ? 0.15 + 0.85 * (stats.total / max) : 0;
    const description = stats
      ? `${displayChar(base)}: missed ${stats.total} time${stats.total === 1 ? "" : "s"} (${stats.chars
          .map(([c, n]) => `${displayChar(c)} ×${n}`)
          .join(", ")})`
      : `${displayChar(base)}: no misses`;
    return (
      <div
        key={base}
        tabIndex={0}
        aria-label={description}
        onPointerEnter={() => setHovered(description)}
        onPointerLeave={() => setHovered(null)}
        onFocus={() => setHovered(description)}
        onBlur={() => setHovered(null)}
        className={`${className} flex h-9 shrink-0 items-center justify-center rounded-md font-mono text-sm outline-none ring-zinc-300 transition hover:ring-1 focus-visible:ring-2 ${
          stats && intensity > 0.6 ? "text-white" : "text-zinc-300"
        }`}
        style={{ background: stats ? `rgba(${HEAT_RGB}, ${intensity})` : "#3f3f46" }}
      >
        {label}
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto pb-1">
        <div className="flex w-max flex-col gap-1">
          {ROWS.map((row, i) => (
            <div key={i} className={`flex gap-1 ${ROW_INDENT[i]}`}>
              {row.map(([base]) => renderKey(base, base.toUpperCase()))}
            </div>
          ))}
          <div className="ml-24 flex">{renderKey(" ", "space", "w-64")}</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
        <span className="min-h-[1rem]">{hovered ?? "Hover or focus a key for details"}</span>
        <span className="flex items-center gap-2">
          Fewer
          <span
            className="h-2 w-24 rounded-full"
            style={{ background: `linear-gradient(to right, rgba(${HEAT_RGB}, 0.15), rgba(${HEAT_RGB}, 1))` }}
          />
          More misses
        </span>
      </div>
      {other.length ? (
        <p className="mt-2 text-xs text-zinc-400">
          Other characters: {other.map(([c, n]) => `${displayChar(c)} ×${n}`).join(", ")}
        </p>
      ) : null}
    </div>
  );
}
