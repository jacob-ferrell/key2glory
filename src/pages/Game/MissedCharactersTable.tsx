import { displayChar } from "../../common/util";

type MissedCharactersMap = Map<string, number>;

type MissedCharactersTableProps = {
  missedCharacters: string[] | MissedCharactersMap;
  limit?: number;
};

function countCharacters(characters: string[]): MissedCharactersMap {
  const counts = new Map<string, number>();
  characters.forEach((char) => counts.set(char, (counts.get(char) ?? 0) + 1));
  return counts;
}

export default function MissedCharactersTable({ missedCharacters, limit }: MissedCharactersTableProps) {
  const missedCharactersMap = Array.isArray(missedCharacters) ? countCharacters(missedCharacters) : missedCharacters;
  const entries = Array.from(missedCharactersMap.entries()).sort((a, b) => b[1] - a[1]);
  const shown = limit ? entries.slice(0, limit) : entries;

  return (
    <ul className="flex flex-wrap gap-2">
      {shown.map(([char, count]) => (
        <li key={char} className="flex items-center gap-1.5 rounded-md bg-zinc-700/70 px-2 py-1 text-sm">
          <span className="font-mono text-base font-bold text-red-300">{displayChar(char)}</span>
          <span className="text-zinc-400">×{count}</span>
        </li>
      ))}
      {limit && entries.length > limit ? (
        <li className="px-2 py-1 text-sm text-zinc-400">+{entries.length - limit} more</li>
      ) : null}
    </ul>
  );
}
