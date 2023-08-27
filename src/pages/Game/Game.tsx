import { ChangeEvent, ClipboardEvent, useEffect, useState, useRef } from "react";
import GameInput from "./GameInput";
import GameTextDisplay from "./GameTextDisplay";
import Stopwatch from "./Stopwatch";
import ClearButton from "./ClearButton";

type GameProps = {
  text: string;
};
type Stats = { 
    wpm: number;
    accuracy: number;
};

export default function Game({ text }: GameProps) {
  const [userInput, setUserInput] = useState("");
  const [index, setIndex] = useState(0);
  const [matches, setMatches] = useState<boolean[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0.0);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [stats, setStats] = useState<Stats>({ wpm: 0.0, accuracy: 0 });
  const [charactersMissed, setCharactersMissed] = useState<string[]>([]);
  const [isExploading, setIsExploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const prevUserInputRef = useRef<string>("");

  useEffect(() => {
    return () => clearInterval(intervalId as unknown as number);
  }, []);

  useEffect(() => {
    if (userInput) return;
    reset();
  }, [userInput])

  function startTimer() {
    if (intervalId !== null) return;
    setIntervalId(
      setInterval(
        () => setElapsedTime((prevElapsedTime) => prevElapsedTime + 0.01),
        10
      )
    );
  }

  function stopTimer() {
    clearInterval(intervalId as unknown as number);
    setIntervalId(null);
  }

  function resetTimer() {
    setElapsedTime(0.0);
  }

  function handleCompletion(value: string) {
    if (value !== text) return;
    stopTimer();
    const newStats = { wpm: getWPM(), accuracy: getAccuracy() };
    setStats(newStats);
    setIsExploading(true);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setIsExploading(false);
    prevUserInputRef.current = userInput;
    setUserInput(value);
    handleError(value);
    setMatches(getMatchesArray(value));
    handleCompletion(value);
    startTimer();
  }

  function handleError(value: string) {
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
    setUserInput("");
    setIndex(0);
    setElapsedTime(0.0);
    setMatches([]);
    setCharactersMissed([]);
    inputRef.current?.focus();
  }

  function isBackSpace(prev: string, value: string) {
    return prev.length > value.length;
  }

  function isError(value: string) {
    return value[value.length - 1] !== text[value.length - 1];
  }

  function handleCopyOrPaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    alert("Copying and pasting is not allowed!");
  }

  function getWPM() {
    let words: number = text.split(" ").length;
    let minutes: number = parseFloat((elapsedTime / 60).toFixed(2));
    let wpm: number = parseFloat((words / minutes).toFixed(2));
    console.log(words, minutes, wpm);
    return wpm;
  }

  function getAccuracy() {
    let accuracy: number = parseFloat(
      (((text.length - charactersMissed.length) / text.length) * 100).toFixed(2)
    );
    return accuracy;
  }

  function getMatchesArray(value: string) {
    //Get an array of booleans where each index represents whether or not the character at that index matches
    return value.split("").map((character, index) => {
      return character === text[index];
    });
  }

  return (
    <div className="flex flex-col items-center gap-12">
      <Stopwatch elapsedTime={elapsedTime} />
      <GameTextDisplay text={text} index={index} matches={matches} isExploading={isExploading}/>
      <GameInput
        userInput={userInput}
        handleChange={handleChange}
        handleCopyOrPaste={handleCopyOrPaste}
        inputRef={inputRef}
      />
      <ClearButton setUserInput={setUserInput} />
    </div>
  );
}
