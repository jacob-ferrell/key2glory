import { Link, useNavigate } from "react-router-dom";
import { HeartIcon, StarIcon } from "@heroicons/react/20/solid";
import { TypingTest } from "../../common/types";
import { formatNumber, truncate } from "../../common/util";
import { countWords } from "../../common/typing";
import TypeBadge from "../../components/TypeBadge";

const tableHeadings = ["Test", "Type", "Words / Chars", "Rating", "Completed", "Creator"];

export default function TestsTable({ tests }: { tests: TypingTest[] }) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-lg bg-zinc-800">
      <table className="w-full text-left text-sm text-zinc-300">
        <thead className="text-xs uppercase text-zinc-400">
          <tr>
            {tableHeadings.map((heading) => (
              <th scope="col" key={heading} className="whitespace-nowrap px-3 py-2">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr
              key={test.id}
              className="cursor-pointer border-t border-zinc-700/60 transition hover:bg-zinc-700/50"
              onClick={() => navigate(`/typing-test/${test.id}`)}
            >
              <td className="px-3 py-2">
                <Link
                  to={`/typing-test/${test.id}`}
                  className="text-zinc-100 hover:text-purple-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  {test.favorited ? <HeartIcon className="mr-1 inline h-4 w-4 text-pink-400" aria-label="Favorite" /> : null}
                  {truncate(test.text, 70)}
                </Link>
              </td>
              <td className="px-3 py-2">
                <TypeBadge type={test.type} />
              </td>
              <td className="whitespace-nowrap px-3 py-2 tabular-nums">{`${countWords(test.text)} / ${test.text.length}`}</td>
              <td className="whitespace-nowrap px-3 py-2 tabular-nums">
                {test.rating ? (
                  <span className="inline-flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
                    {formatNumber(test.rating)}
                    <span className="text-zinc-500">({test.ratings})</span>
                  </span>
                ) : (
                  <span className="text-zinc-500">-</span>
                )}
              </td>
              <td className="px-3 py-2 tabular-nums">{test.scoresCount ?? 0}</td>
              <td className="px-3 py-2">{test.createdBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
