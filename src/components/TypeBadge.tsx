import { TestType } from "../common/types";
import { formatTestType } from "../common/util";

const colors: Record<string, string> = {
  GENERAL: "bg-blue-500/15 text-blue-300",
  NUMBERS: "bg-purple-500/15 text-purple-300",
  SPECIAL_CHARACTERS: "bg-amber-500/15 text-amber-300",
};

export default function TypeBadge({ type }: { type: TestType }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${colors[type] ?? "bg-zinc-700 text-zinc-300"}`}>
      {formatTestType(type)}
    </span>
  );
}
