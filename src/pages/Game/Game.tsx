import {
  useEffect,
  useState,
  useRef,
} from "react";
import GameTextDisplay from "./GameTextDisplay";
import Stopwatch from "./Stopwatch";
import ClearButton from "./ClearButton";
import StatsModal from "./StatsModal";

type GameProps = {
  text: string;
};
type Stats = {
  WPM: number;
  accuracy: string;
  time: string;
  "Keys Missed": number;
};

export default function Game({ text }: GameProps) {
  const [userInput, setUserInput] = useState("");
  const [matches, setMatches] = useState<boolean[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0.0);
  const [stats, setStats] = useState<Stats>({
    WPM: 0.0,
    accuracy: "",
    time: "",
    "Keys Missed": 0,
  });
  const [charactersMissed, setCharactersMissed] = useState<string[]>([]);
  const [isExploading, setIsExploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const prevUserInputRef = useRef<string>("");
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current as unknown as number);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (userInput.length && intervalRef.current === null) {
      startTimer();
    }
    if (!userInput.length && intervalRef.current !== null) {
      reset();
    }
    if (userInput.length === text.length) {
      return handleCompletion();
    }
    if (userInput.length) {
      handleError();
    }
  }, [userInput, intervalRef.current]);

  function startTimer() {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(
      () => setElapsedTime((prevElapsedTime) => prevElapsedTime + 0.01),
      10
    );
  }

  function stopTimer() {
    clearInterval(intervalRef.current as unknown as number);
    intervalRef.current = null;
  }

  function resetTimer() {
    setElapsedTime(0.0);
  }

  function handleCompletion() {
    if (userInput.length !== text.length) return;
    stopTimer();
    const newStats = {
      WPM: getWPM(),
      accuracy: getAccuracy(),
      time: elapsedTime.toFixed(2) + " seconds",
      "Keys Missed": charactersMissed.length,
    };
    setStats(newStats);
    setIsExploading(true);
    setTimeout(() => {
      setShowModal(true);
      reset();
    }, 1000);
  }

  function handleError() {
    const value = userInput;
    console.log(value);
    const prev = prevUserInputRef.current;
    const lastCharacterTyped = value[value.length - 1];
    if (isBackSpace(prev, value) || !isError(value)) return;
    console.log("error");
    console.log(lastCharacterTyped);
    setCharactersMissed((prevCharactersMissed) => [
      ...prevCharactersMissed,
      text[value.length - 1],
    ]);
  }

  function reset() {
    stopTimer();
    resetTimer();
    setMatches([]);
    setCharactersMissed([]);
    setUserInput("");
  }

  function isBackSpace(prev: string, value: string) {
    return prev.length > value.length;
  }

  function isError(value: string) {
    return value[value.length - 1] !== text[value.length - 1];
  }

  function getWPM() {
    let words: number = text.split(" ").length;
    let minutes: number = parseFloat((elapsedTime / 60).toFixed(2));
    let WPM: number = parseFloat((words / minutes).toFixed(2));
    console.log(words, minutes, WPM);
    return WPM;
  }

  function getAccuracy() {
    let accuracy: string =
      (((text.length - charactersMissed.length) / text.length) * 100).toFixed(
        2
      ) + "%";
    return accuracy;
  }

  function getMatchesArray(value: string) {
    //Get an array of booleans where each index represents whether or not the character at that index matches
    return value.split("").map((character, index) => {
      return character === text[index];
    });
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key.length > 1 && e.key !== "Backspace") return;
    e.preventDefault();
    setUserInput((prevUserInput) => {
      setIsExploading(false);
      const newUserInput =
        e.key.length === 1 ? prevUserInput + e.key : prevUserInput.slice(0, -1);
      setMatches(getMatchesArray(newUserInput));
      return newUserInput;
    });
  }

  return (
    <>
      <StatsModal isOpen={showModal} setIsOpen={setShowModal} stats={stats} />
      <div className="flex flex-col items-center gap-12">
        <Stopwatch elapsedTime={elapsedTime} />
        <GameTextDisplay
          text={text}
          matches={matches}
          isExploading={isExploading}
        />
        <ClearButton setUserInput={setUserInput} />
      </div>
    </>
  );
}
