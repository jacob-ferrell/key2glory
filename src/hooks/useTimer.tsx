import { useRef, useState } from "react";

export default function useTimer({}: {}) {
  const [elapsedTime, setElapsedTime] = useState(0.0);
  const intervalId = useRef<number | null>(null);

  function start() {
    if (intervalId.current) return;
    intervalId.current = setInterval(
      () => setElapsedTime((prevElapsedTime) => prevElapsedTime + 0.01),
      10
    );
  }

  function stop() {
    clearInterval(intervalId.current as unknown as number);
    intervalId.current = null;
  }

  function reset() {
    stop();
    setElapsedTime(0.0);
  }

  return {elapsedTime, start, stop, reset};
}
