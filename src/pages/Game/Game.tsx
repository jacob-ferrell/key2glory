import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { ArrowPathIcon, StarIcon } from "@heroicons/react/20/solid";
import GameTextDisplay from "./GameTextDisplay";
import LiveStats from "./LiveStats";
import StatsModal from "./StatsModal";
import TestLeaderboard from "./TestLeaderboard";
import useGame from "../../hooks/useGame";
import useAsync from "../../hooks/useAsync";
import useTitle from "../../hooks/useTitle";
import getTest from "../../api/getTest";
import getRandomTest from "../../api/getRandomTest";
import { ErrorNotice, Spinner } from "../../components/Feedback";
import TypeBadge from "../../components/TypeBadge";
import FavoriteButton from "../../components/FavoriteButton";
import { TypingTest } from "../../common/types";
import { formatNumber, formatTestType } from "../../common/util";
import { countWords } from "../../common/typing";

export default function Game() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const { data: test, setData: setTest, error, loading, reload } = useAsync(
    () => getTest(testId),
    [testId, isAuthenticated]
  );
  const isCurrentTest = test !== null && String(test.id) === testId;
  const game = useGame(isCurrentTest ? test : null);
  const [leaderboardKey, setLeaderboardKey] = useState(0);
  const [bestBeforeRun, setBestBeforeRun] = useState<number | null>(null);
  const [nextError, setNextError] = useState<string | null>(null);

  useTitle(test ? `${formatTestType(test.type)} test` : null);

  // Remember the personal best from before the current run for the results dialog
  useEffect(() => {
    if (game.status !== "finished") setBestBeforeRun(test?.currentUserHighScore?.overallScore ?? null);
  }, [test, game.status]);

  // Refresh personal bests and the leaderboard once a score has been saved
  const saved = game.result?.saved;
  useEffect(() => {
    if (!saved) return;
    setLeaderboardKey((key) => key + 1);
    getTest(testId)
      .then(setTest)
      .catch((err) => console.error("Failed to refresh test", err));
  }, [saved, testId, setTest]);

  function updateTest(changes: Partial<TypingTest>) {
    setTest((prev) => (prev ? { ...prev, ...changes } : prev));
  }

  async function goToNextTest() {
    if (!test) return;
    setNextError(null);
    try {
      const next = await getRandomTest(test.type, test.id);
      navigate(`/typing-test/${next.id}`);
    } catch {
      setNextError(`There are no other ${formatTestType(test.type).toLowerCase()} tests yet.`);
      game.restart();
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4">
        <ErrorNotice message={error === "Typing test not found" ? "This typing test doesn't exist." : error} onRetry={reload} />
        <Link to="/typing-test/browse" className="text-purple-400 hover:underline">
          Browse tests
        </Link>
      </div>
    );
  }
  if (!isCurrentTest || (loading && !test)) {
    return <Spinner label="Loading test…" />;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <StatsModal
        isOpen={game.showModal}
        result={game.result}
        test={test}
        previousBest={bestBeforeRun}
        onClose={game.restart}
        onNext={goToNextTest}
        onTestChange={updateTest}
      />

      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">
          <TypeBadge type={test.type} />
          <span>by {test.createdBy}</span>
          <span>{countWords(test.text)} words</span>
          <span>{test.text.length} characters</span>
          <span className="inline-flex items-center gap-1">
            <StarIcon className="h-4 w-4 text-yellow-400" aria-hidden="true" />
            {test.rating ? `${formatNumber(test.rating)} (${test.ratings})` : "Unrated"}
          </span>
          <span>{test.scoresCount ?? 0} completions</span>
        </div>
        {isAuthenticated ? (
          <FavoriteButton testId={test.id} favorited={!!test.favorited} onChange={(favorited) => updateTest({ favorited })} />
        ) : null}
      </div>

      <LiveStats
        text={game.text}
        status={game.status}
        startedAt={game.startedAt}
        typedLength={game.typedLength}
        missedCount={game.missedCount}
        result={game.result}
      />

      <GameTextDisplay text={game.text} matches={game.matches} isExploding={game.isExploding} />

      <div className="flex w-full flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
        <span>
          {game.status === "idle" ? "Start typing to begin." : "Press Esc to restart."} Ctrl+Backspace deletes a word.
        </span>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              game.restart();
              // Don't let a later Enter/Space re-trigger the button
              e.currentTarget.blur();
            }}
            className="inline-flex items-center gap-1.5 rounded-md bg-zinc-700 px-3 py-1.5 font-semibold text-zinc-100 hover:bg-zinc-600"
          >
            <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
            Restart
          </button>
          <button
            onClick={(e) => {
              goToNextTest();
              e.currentTarget.blur();
            }}
            className="rounded-md bg-zinc-700 px-3 py-1.5 font-semibold text-zinc-100 hover:bg-zinc-600"
          >
            Next test
          </button>
        </div>
      </div>
      {nextError ? <p className="w-full text-sm text-amber-300">{nextError}</p> : null}

      {test.currentUserHighScore || test.highScore ? (
        <div className="grid w-full gap-3 sm:grid-cols-2">
          {test.currentUserHighScore ? (
            <BestCard label="Your best" score={test.currentUserHighScore.overallScore} wpm={test.currentUserHighScore.wpm} />
          ) : null}
          {test.highScore ? (
            <BestCard
              label={`Record · ${test.highScore.username}`}
              score={test.highScore.overallScore}
              wpm={test.highScore.wpm}
            />
          ) : null}
        </div>
      ) : null}

      <TestLeaderboard
        testId={test.id}
        refreshKey={leaderboardKey}
        currentUsername={test.currentUserHighScore?.username ?? null}
      />
    </div>
  );
}

function BestCard({ label, score, wpm }: { label: string; score: number; wpm: number }) {
  return (
    <div className="flex items-baseline justify-between rounded-lg bg-zinc-800 px-4 py-3">
      <span className="text-sm font-semibold text-zinc-400">{label}</span>
      <span className="tabular-nums">
        <span className="text-xl font-bold">{formatNumber(wpm)}</span> <span className="text-zinc-400">WPM</span>
        <span className="ml-3 text-zinc-400">score {formatNumber(score)}</span>
      </span>
    </div>
  );
}
