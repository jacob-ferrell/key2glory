import { TrophyIcon } from "@heroicons/react/20/solid";
import getLeaderboard from "../../api/getLeaderboard";
import useAsync from "../../hooks/useAsync";
import useTitle from "../../hooks/useTitle";
import { EmptyState, ErrorNotice, Spinner } from "../../components/Feedback";
import { formatNumber } from "../../common/util";

// Must match ScoreService.LEADERBOARD_MIN_TESTS on the backend
const MIN_TESTS = 3;
const MEDALS = ["text-yellow-400", "text-zinc-300", "text-amber-600"];

export default function Leaderboards() {
  const { data: entries, error, loading, reload } = useAsync(() => getLeaderboard(50), []);
  useTitle("Leaderboards");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl font-bold">Leaderboards</h2>
        <p className="text-zinc-400">
          Ranked by average WPM across all tests. Complete at least {MIN_TESTS} tests to be ranked. Each test page has
          its own top scores, too.
        </p>
      </div>
      {error ? (
        <ErrorNotice message={error} onRetry={reload} />
      ) : loading && !entries ? (
        <Spinner />
      ) : !entries?.length ? (
        <EmptyState>No one has completed enough tests to be ranked yet.</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-zinc-400">
              <tr>
                <th className="px-3 py-2">Rank</th>
                <th className="px-3 py-2">Player</th>
                <th className="px-3 py-2 text-right">Avg WPM</th>
                <th className="px-3 py-2 text-right">Best WPM</th>
                <th className="px-3 py-2 text-right">Avg Accuracy</th>
                <th className="px-3 py-2 text-right">Tests</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={entry.username} className="border-t border-zinc-700/60">
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      {i < 3 ? <TrophyIcon className={`h-4 w-4 ${MEDALS[i]}`} aria-label={`Rank ${i + 1}`} /> : null}
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-semibold">{entry.username}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatNumber(entry.averageWpm)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatNumber(entry.bestWpm)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatNumber(entry.averageAccuracy)}%</td>
                  <td className="px-3 py-2 text-right tabular-nums">{entry.testsCompleted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
