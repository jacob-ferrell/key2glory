import { useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import createSession from "../api/createSession";
import endSession from "../api/endSession";
import { Score } from "../common/types";

/**
 * Server-side test session for signed-in users. The server records the start
 * and calculates the score when the session is completed.
 */
export default function useSession(testId: string | undefined) {
  const { isAuthenticated } = useAuth0();
  const startRequest = useRef<Promise<boolean> | null>(null);

  function start(startTime: number) {
    if (!isAuthenticated) {
      startRequest.current = null;
      return;
    }
    startRequest.current = createSession(testId, startTime)
      .then(() => true)
      .catch((err) => {
        console.error("Failed to start test session", err);
        return false;
      });
  }

  /** Resolves to the server score, or null when there is no session to complete (signed out). */
  async function finish(endTime: number, missedCharacters: string[]): Promise<Score | null> {
    const started = startRequest.current;
    startRequest.current = null;
    if (!isAuthenticated || !started) return null;
    // A very short run can finish before the start request has completed
    if (!(await started)) {
      throw new Error("The test session couldn't be started");
    }
    return endSession({ testId, endTime, missedCharacters });
  }

  return { start, finish };
}
