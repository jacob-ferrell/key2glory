import getTestLeaderboard from "../../api/getTestLeaderboard";
import useAsync from "../../hooks/useAsync";
import { EmptyState, ErrorNotice, Spinner } from "../../components/Feedback";
import { formatNumber, formatSeconds } from "../../common/util";

type TestLeaderboardProps = {
  testId: number;
  // Changing this refetches, e.g. after a new score is saved
  refreshKey: number;
  currentUsername: string | null;
};

export default function TestLeaderboard({ testId, refreshKey, currentUsername }: TestLeaderboardProps) {
  const { data: scores, error, loading, reload } = useAsync(() => getTestLeaderboard(testId), [testId, refreshKey]);

  return (
    <section className="w-full">
      <h2 className="mb-3 text-xl font-bold">Top Scores</h2>
      {error ? (
        <ErrorNotice message={error} onRetry={reload} />
      ) : loading && !scores ? (
        <Spinner />
      ) : !scores?.length ? (
        <EmptyState>No one has completed this test yet. Be the first!</EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-zinc-400">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Player</th>
                <th className="px-3 py-2 text-right">WPM</th>
                <th className="px-3 py-2 text-right">Accuracy</th>
                <th className="px-3 py-2 text-right">Time</th>
                <th className="px-3 py-2 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, i) => (
                <tr
                  key={score.id}
                  className={`border-t border-zinc-700/60 ${score.username === currentUsername ? "bg-purple-500/10 font-semibold" : ""}`}
                >
                  <td className="px-3 py-2 text-zinc-400">{i + 1}</td>
                  <td className="px-3 py-2">{score.username}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatNumber(score.wpm)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatNumber(score.accuracy)}%</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatSeconds(score.time / 1000)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{formatNumber(score.overallScore)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
