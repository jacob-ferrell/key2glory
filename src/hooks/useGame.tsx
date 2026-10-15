import { useEffect, useMemo, useRef, useState } from "react";
import useSession from "./useSession";
import { RunResult, TypingTest } from "../common/types";
import {
  calculateStats,
  getMatches,
  initialTypingState,
  normalizeText,
  TypingAction,
  typingReducer,
} from "../common/typing";
import { getErrorMessage } from "../api/axiosInstance";

// Delay between finishing and the results dialog, so the confetti can play
const RESULTS_DELAY_MS = 1000;

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

export default function useGame(test: TypingTest | null) {
  const text = useMemo(() => (test ? normalizeText(test.text) : ""), [test]);
  const [state, setState] = useState(() => initialTypingState(text));
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [result, setResult] = useState<RunResult | null>(null);
  const [isExploding, setIsExploding] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const session = useSession(test?.id.toString());

  // Mutable mirrors so the window key listener always sees current values
  const stateRef = useRef(state);
  const startRef = useRef<{ perf: number; wall: number } | null>(null);
  const runRef = useRef(0);
  const resultsTimeout = useRef<number>();

  useEffect(() => {
    restart();
    return () => window.clearTimeout(resultsTimeout.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  function apply(action: TypingAction) {
    const prev = stateRef.current;
    const next = typingReducer(prev, action);
    if (next === prev) return;
    stateRef.current = next;
    setState(next);
    if (prev.status === "idle" && next.status !== "idle") handleStart();
    if (prev.status !== "idle" && next.status === "idle") handleReset();
    if (next.status === "finished") handleFinish(next.missedCharacters);
  }

  function handleStart() {
    const now = { perf: performance.now(), wall: Date.now() };
    startRef.current = now;
    setStartedAt(now.perf);
    session.start(now.wall);
  }

  function handleReset() {
    startRef.current = null;
    setStartedAt(null);
  }

  async function handleFinish(missedCharacters: string[]) {
    const start = startRef.current ?? { perf: performance.now(), wall: Date.now() };
    const elapsedSeconds = (performance.now() - start.perf) / 1000;
    const run = ++runRef.current;
    setIsExploding(true);
    resultsTimeout.current = window.setTimeout(() => setShowModal(true), RESULTS_DELAY_MS);

    const local: RunResult = {
      ...calculateStats(text, text.length, missedCharacters.length, elapsedSeconds),
      missedCharacters,
      saved: false,
    };
    let runResult = local;
    try {
      // Use the same clock for both ends so the duration matches the local timer
      const score = await session.finish(start.wall + elapsedSeconds * 1000, missedCharacters);
      if (score) {
        runResult = {
          wpm: score.wpm,
          accuracy: score.accuracy,
          overallScore: score.overallScore,
          timeSeconds: score.time / 1000,
          missedCharacters: score.missedCharacters ?? missedCharacters,
          saved: true,
        };
      }
    } catch (err) {
      runResult = { ...local, saveError: getErrorMessage(err, "Your score couldn't be saved") };
    }
    // Ignore results from a run the user has already restarted
    if (run === runRef.current) setResult(runResult);
  }

  function restart() {
    window.clearTimeout(resultsTimeout.current);
    runRef.current++;
    const fresh = initialTypingState(text);
    stateRef.current = fresh;
    setState(fresh);
    handleReset();
    setResult(null);
    setIsExploding(false);
    setShowModal(false);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (showModal || isEditableTarget(e.target)) return;
    if (e.key === "Escape") {
      e.preventDefault();
      restart();
      return;
    }
    if (e.key === "Backspace") {
      e.preventDefault();
      apply({ type: "backspace", word: e.ctrlKey || e.altKey });
      return;
    }
    // Leave browser/OS shortcuts alone, but allow AltGr characters
    if (e.metaKey || (e.ctrlKey && !e.getModifierState("AltGraph"))) return;
    if (e.key.length !== 1) return;
    // Stops space from scrolling the page and quick-find from opening
    e.preventDefault();
    apply({ type: "type", char: e.key });
  }

  const keyDownRef = useRef(handleKeyDown);
  keyDownRef.current = handleKeyDown;
  useEffect(() => {
    const listener = (e: KeyboardEvent) => keyDownRef.current(e);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const matches = useMemo(() => getMatches(state), [state]);

  return {
    text,
    matches,
    status: state.status,
    typedLength: state.input.length,
    missedCount: state.missedCharacters.length,
    startedAt,
    result,
    isExploding,
    showModal,
    restart,
  };
}
