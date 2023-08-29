import { useEffect, useRef, useState } from "react";

export default function useTimer() {
  const [elapsedTime, setElapsedTime] = useState(0.0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current as unknown as number);
  }, []);

  function start() {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(
      () => setElapsedTime((prevElapsedTime) => prevElapsedTime + 0.01),
      10
    );
  }

  function stop() {
    clearInterval(intervalRef.current as unknown as number);
    intervalRef.current = null;
  }

  function reset() {
    stop();
    setElapsedTime(0.0);
  }

  return {elapsedTime, start, stop, reset, interval: intervalRef.current};
}
