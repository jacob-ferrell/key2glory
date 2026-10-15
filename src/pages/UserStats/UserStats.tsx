import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import getMissedCharacters from "../../api/getMissedCharacters";
import getGeneralStats from "../../api/getGeneralStats";
import getRecentScores from "../../api/getRecentScores";
import useAsync from "../../hooks/useAsync";
import useTitle from "../../hooks/useTitle";
import MissedCharactersTable from "../Game/MissedCharactersTable";
import WpmTrendChart from "./WpmTrendChart";
import KeyboardHeatmap from "./KeyboardHeatmap";
import { EmptyState, ErrorNotice, Spinner } from "../../components/Feedback";
import { formatNumber } from "../../common/util";

async function loadStats() {
  const [generalStats, missedCharacters, recentScores] = await Promise.all([
    getGeneralStats(),
    getMissedCharacters(),
    getRecentScores(30),
  ]);
  return { generalStats, missedCharacters, recentScores };
}

export default function UserStats() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const { data, error, reload } = useAsync(loadStats, [isAuthenticated], isAuthenticated);
  useTitle("My stats");

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <h2 className="text-2xl font-bold">My Stats</h2>
        <p className="text-zinc-400">Sign in to track your progress and see which keys trip you up.</p>
        <button onClick={() => loginWithRedirect()} className="rounded-md bg-purple-600 px-4 py-2 font-semibold hover:bg-purple-500">
          Sign In
        </button>
      </div>
    );
  }
  if (error) return <ErrorNotice message={error} onRetry={reload} />;
  if (!data) return <Spinner label="Loading your stats…" />;

  const { generalStats, missedCharacters, recentScores } = data;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-3xl font-bold">My Stats</h2>
        <div className="flex gap-4 text-sm font-semibold">
          <Link to="/typing-test/browse?mine=FAVORITES" className="text-purple-300 hover:underline">
            My favorites
          </Link>
          <Link to="/typing-test/browse?mine=CREATED" className="text-purple-300 hover:underline">
            Tests I created
          </Link>
        </div>
      </div>

      {generalStats.testsCompleted === 0 ? (
        <EmptyState>
          You haven't completed any tests yet.{" "}
          <Link to="/" className="text-purple-300 hover:underline">
            Take one now
          </Link>{" "}
          to start tracking your stats.
        </EmptyState>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <StatTile label="Average WPM" value={formatNumber(generalStats.averageWPM)} />
            <StatTile label="Best WPM" value={formatNumber(generalStats.highestWPM)} />
            <StatTile label="Average accuracy" value={`${formatNumber(generalStats.averageAccuracy)}%`} />
            <StatTile label="Tests completed" value={formatNumber(generalStats.testsCompleted, 0)} />
            <StatTile label="Tests created" value={formatNumber(generalStats.testsContributed, 0)} />
          </div>

          {recentScores.length > 1 ? (
            <section className="rounded-lg bg-zinc-800 p-4">
              <h3 className="text-lg font-bold">WPM over your last {recentScores.length} runs</h3>
              <WpmTrendChart scores={recentScores} />
            </section>
          ) : null}
        </>
      )}

      <section className="rounded-lg bg-zinc-800 p-4">
        <h3 className="mb-3 text-lg font-bold">Missed keys</h3>
        {missedCharacters.size === 0 ? (
          <p className="text-zinc-400">No missed characters logged yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            <KeyboardHeatmap missedCharacters={missedCharacters} />
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Most missed</h4>
              <MissedCharactersTable missedCharacters={missedCharacters} limit={20} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-800 px-4 py-3">
      <div className="text-sm text-zinc-400">{label}</div>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
