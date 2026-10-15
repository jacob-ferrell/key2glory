import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import RateTest from "./RateTest";
import MissedCharactersTable from "./MissedCharactersTable";
import FavoriteButton from "../../components/FavoriteButton";
import { Spinner } from "../../components/Feedback";
import { RunResult, TypingTest } from "../../common/types";
import { formatNumber, formatSeconds } from "../../common/util";

type StatsModalProps = {
  isOpen: boolean;
  result: RunResult | null;
  test: TypingTest;
  // The user's best overall score on this test before this run
  previousBest: number | null;
  onClose: () => void;
  onNext: () => void;
  onTestChange: (changes: Partial<TypingTest>) => void;
};

function getHeadline(result: RunResult | null, previousBest: number | null) {
  if (!result?.saved) return "Test complete!";
  if (previousBest === null) return "First run on this test!";
  if (result.overallScore > previousBest) return "New personal best!";
  return "Test complete!";
}

export default function StatsModal({ isOpen, result, test, previousBest, onClose, onNext, onTestChange }: StatsModalProps) {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const retryButton = useRef<HTMLButtonElement>(null);
  const isBest = result?.saved && previousBest !== null && result.overallScore > previousBest;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={onClose} initialFocus={retryButton}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-zinc-900 p-6 text-left text-zinc-100 shadow-xl ring-1 ring-zinc-700">
                <Dialog.Title as="h3" className={`text-center text-2xl font-bold ${isBest ? "text-yellow-300" : ""}`}>
                  {getHeadline(result, previousBest)}
                </Dialog.Title>

                {result === null ? (
                  <Spinner label="Saving your score…" />
                ) : (
                  <>
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <Tile label="WPM" value={formatNumber(result.wpm, 1)} highlight />
                      <Tile label="Accuracy" value={`${formatNumber(result.accuracy, 1)}%`} />
                      <Tile label="Time" value={formatSeconds(result.timeSeconds)} />
                      <Tile label="Score" value={formatNumber(result.overallScore, 1)} />
                    </div>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-800" title="Accuracy">
                      <div
                        className="h-full rounded-full bg-green-500 transition-[width] duration-700"
                        style={{ width: `${result.accuracy}%` }}
                      />
                    </div>
                    {previousBest !== null && result.saved && !isBest ? (
                      <p className="mt-2 text-center text-sm text-zinc-400">
                        Your best on this test: {formatNumber(previousBest, 1)}
                      </p>
                    ) : null}

                    {result.saveError ? (
                      <p className="mt-4 rounded-md bg-amber-950/60 px-3 py-2 text-sm text-amber-200">
                        {result.saveError}. These stats were calculated locally.
                      </p>
                    ) : null}

                    {result.missedCharacters.length > 0 ? (
                      <div className="mt-5">
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                          Missed characters
                        </h4>
                        <MissedCharactersTable missedCharacters={result.missedCharacters} limit={12} />
                      </div>
                    ) : (
                      <p className="mt-5 text-center font-semibold text-green-400">Flawless - no missed characters!</p>
                    )}
                  </>
                )}

                {isAuthenticated ? (
                  <div className="mt-6 flex flex-wrap items-end justify-between gap-3 border-t border-zinc-800 pt-4">
                    <RateTest
                      testId={test.id}
                      rating={test.currentUserRating}
                      setRating={(rating) => onTestChange({ currentUserRating: rating })}
                    />
                    <FavoriteButton
                      testId={test.id}
                      favorited={!!test.favorited}
                      onChange={(favorited) => onTestChange({ favorited })}
                    />
                  </div>
                ) : (
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-zinc-800 px-4 py-3 text-sm">
                    <span>Sign in to save your scores and appear on leaderboards.</span>
                    <button
                      onClick={() => loginWithRedirect()}
                      className="rounded-md bg-purple-600 px-3 py-1 font-semibold hover:bg-purple-500"
                    >
                      Sign In
                    </button>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={onNext}
                    className="rounded-md bg-zinc-700 px-4 py-2 text-sm font-semibold hover:bg-zinc-600"
                  >
                    Next test
                  </button>
                  <button
                    ref={retryButton}
                    type="button"
                    onClick={onClose}
                    className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
                  >
                    Try again
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function Tile({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg bg-zinc-800 px-3 py-2 text-center">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</div>
      <div className={`text-2xl font-bold tabular-nums ${highlight ? "text-purple-300" : ""}`}>{value}</div>
    </div>
  );
}
