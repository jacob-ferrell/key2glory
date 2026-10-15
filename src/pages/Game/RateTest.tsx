import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import postTestRating from "../../api/postTestRating";

type RateTestProps = {
  testId: number;
  rating: number | null;
  setRating: (rating: number) => void;
};

export default function RateTest({ testId, rating, setRating }: RateTestProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const shown = hovered ?? rating ?? 0;

  async function rate(value: number) {
    setSaving(true);
    setError(false);
    try {
      const res = await postTestRating(testId, value);
      setRating(res.rating);
    } catch (err) {
      console.error("Failed to rate test", err);
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
        {rating ? "Your rating" : "Rate this test"}
      </div>
      <div className="flex items-center" onMouseLeave={() => setHovered(null)}>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            disabled={saving}
            aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
            onMouseEnter={() => setHovered(value)}
            onFocus={() => setHovered(value)}
            onBlur={() => setHovered(null)}
            onClick={() => rate(value)}
            className="p-0.5 disabled:opacity-60"
          >
            <StarIcon className={`h-6 w-6 transition ${value <= shown ? "text-yellow-400" : "text-zinc-600"}`} />
          </button>
        ))}
      </div>
      {error ? <div className="text-xs text-red-300">Couldn't save your rating</div> : null}
    </div>
  );
}
