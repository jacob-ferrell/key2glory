import { memo, useLayoutEffect, useMemo, useRef, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

type GameTextDisplayProps = {
  text: string;
  matches: boolean[];
  isExploding: boolean;
};

// Per character: "c" correct, "x" wrong, "-" not typed yet
type CharStatuses = string;

type WordProps = {
  word: string;
  statuses: CharStatuses;
  // Index of the caret within this word, or -1
  caretAt: number;
};

const VISIBLE_LINES = 3;

// Memoized on primitive props, so a keystroke only re-renders the word(s) it touches
const Word = memo(function Word({ word, statuses, caretAt }: WordProps) {
  return (
    <div className="flex">
      {Array.from(word, (char, i) => {
        const status = statuses[i];
        const classes =
          status === "c"
            ? "grow text-green-500 bg-green-500/10"
            : status === "x"
            ? "wiggle text-red-500 bg-red-500/20"
            : "text-zinc-400";
        return (
          <span key={i} data-caret={i === caretAt ? "" : undefined} className={`${classes} relative rounded leading-[2.5rem]`}>
            {char === " " ? "\u00A0" : char}
            {i === caretAt ? (
              <span className="absolute bottom-0.5 left-0 w-full h-1 bg-violet-500 rounded animate-opacity" />
            ) : null}
          </span>
        );
      })}
    </div>
  );
});

export default function GameTextDisplay({ text, matches, isExploding }: GameTextDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [width, setWidth] = useState(0);

  const words = useMemo(() => {
    let start = 0;
    return text.split(" ").map((word, i, all) => {
      const withSpace = i === all.length - 1 ? word : word + " ";
      const entry = { word: withSpace, start };
      start += withSpace.length;
      return entry;
    });
  }, [text]);

  const caret = matches.length;

  // Re-measure when the container is resized, since words re-wrap
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Scroll so the caret stays on the second visible line
  useLayoutEffect(() => {
    const caretEl = textRef.current?.querySelector<HTMLElement>("[data-caret]");
    if (!caretEl) {
      if (caret === 0) setOffset(0);
      return;
    }
    setOffset(Math.max(0, caretEl.offsetTop - caretEl.offsetHeight));
  }, [caret, text, width]);

  return (
    <div className="relative w-full flex justify-center">
      {isExploding ? (
        <div className="absolute left-1/2 top-1/2">
          <ConfettiExplosion force={0.6} duration={2500} particleCount={80} width={1000} />
        </div>
      ) : null}
      <div ref={containerRef} className="w-full rounded-lg bg-zinc-800/70 px-4 py-3">
        {/* Clip at line boundaries so partially scrolled lines never peek in */}
        <div className="overflow-hidden" style={{ height: `${VISIBLE_LINES * 2.5}rem` }}>
          <div
            ref={textRef}
            style={{ transform: `translateY(${-offset}px)` }}
            className="relative flex flex-wrap font-mono text-2xl transition-transform duration-150 ease-out"
          >
            {words.map(({ word, start }) => {
              let statuses = "";
              for (let i = 0; i < word.length; i++) {
                const match = matches[start + i];
                statuses += match === undefined ? "-" : match ? "c" : "x";
              }
              const caretAt = caret >= start && caret < start + word.length ? caret - start : -1;
              return <Word key={start} word={word} statuses={statuses} caretAt={caretAt} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
