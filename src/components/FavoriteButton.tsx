import { useState } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import addToFavorites from "../api/addToFavorites";
import removeFromFavorites from "../api/removeFromFavorites";

type FavoriteButtonProps = {
  testId: number;
  favorited: boolean;
  onChange: (favorited: boolean) => void;
};

export default function FavoriteButton({ testId, favorited, onChange }: FavoriteButtonProps) {
  const [pending, setPending] = useState(false);

  async function toggle() {
    const next = !favorited;
    setPending(true);
    // Optimistic update, rolled back if the request fails
    onChange(next);
    try {
      await (next ? addToFavorites(testId) : removeFromFavorites(testId));
    } catch (err) {
      console.error("Failed to update favorites", err);
      onChange(!next);
    } finally {
      setPending(false);
    }
  }

  const Icon = favorited ? HeartSolid : HeartOutline;
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={favorited}
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold transition hover:bg-zinc-700 disabled:opacity-60 ${
        favorited ? "text-pink-400" : "text-zinc-300"
      }`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      {favorited ? "Favorited" : "Favorite"}
    </button>
  );
}
