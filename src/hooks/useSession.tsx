import { useParams } from "react-router-dom";
import createSession from "../api/createSession";
import endSession from "../api/endSession";
import useTimer from "./useTimer";
import { getCurrentTime } from "../common/util";
import { useState } from "react";
import { Stats } from "../common/types";
import { useAuth0 } from "@auth0/auth0-react";
import useStats from "./useStats";

type useSessionProps = {
  text: string | null;
  missedCharacters: string[];
};

export default function useSession({
  text,
  missedCharacters,
}: useSessionProps) {
  const { testId } = useParams();
  const [stats, setStats] = useState<Stats>({
    wpm: 0,
    accuracy: 0,
    time: 0,
    missedCharacters: [],
    wpmScore: 0,
    overallScore: 0,
  });
  const { isAuthenticated } = useAuth0();
  const timer = useTimer();

  async function start() {
    timer.start();
    if (!isAuthenticated) return;
    await createSession(testId, getCurrentTime());
  }

  async function stop() {
    const now = getCurrentTime();
    const elapsedTime = timer.elapsedTime;
    timer.reset();
    if (!isAuthenticated) {
      const unauthenticatedStats = useStats({
        text,
        missedCharacters,
        elapsedTime,
      });
      setStats(unauthenticatedStats);
      return;
    }
    const stats = await endSession({
      testId,
      endTime: now,
      missedCharacters,
    });
    setStats(stats);
  }

  return { start, stop, stats, timer };
}
