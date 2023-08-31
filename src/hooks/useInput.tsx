import { useEffect, useRef, useState } from "react";
import useTimer from "./useTimer";
import useStats from "./useStats";

export default function useInput(text: string) {
  const [userInput, setUserInput] = useState("");
  const [matches, setMatches] = useState<boolean[]>([]);
  const [charactersMissed, setCharactersMissed] = useState<string[]>([]);
  const [isExploading, setIsExploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const prevUserInputRef = useRef<string>("");

  const timer = useTimer();
  const stats = useStats({ text, charactersMissed, timer });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (userInput.length && timer.interval === null) { //start timer if user starts typing
      timer.start();
    }
    if (!userInput.length && timer.interval !== null) { //stop timer if user deletes all input and reset all stats
      return reset();
    }
    if (matches[matches.length - 1] === false && isError(userInput) && userInput.length > prevUserInputRef.current.length) { //if user makes 2 mistakes in a row, do not progress but add the missed character
      addMissedCharacter();
      return setUserInput(prevUserInputRef.current);
    }
    if (!isBackSpace(prevUserInputRef.current, userInput) && isError(userInput) && userInput !== prevUserInputRef.current) { //add missed character if user makes a mistake
      addMissedCharacter();
    }
    setMatches(getMatchesArray(userInput));
    if (userInput.length === text.length) {
      return handleCompletion();
    }
  }, [userInput, timer.interval]);

  function isBackSpace(prev: string, value: string) {
    return prev.length > value.length;
  }

  function isError(value: string) {
    return value[value.length - 1] !== text[value.length - 1];
  }

  function addMissedCharacter() {
    setCharactersMissed((prevCharactersMissed) => [
      ...prevCharactersMissed,
      text[userInput.length - 1],
    ]);
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key.length > 1 && e.key !== "Backspace") return;
    e.preventDefault();
    setIsExploading(false);
    setUserInput((prev) => {
      prevUserInputRef.current = prev;
      const newUserInput =
      e.key.length === 1 ? prev + e.key : prev.slice(0, -1);
      return newUserInput;
    });
  }

  function handleCompletion() {
    timer.stop();
    setIsExploading(true);
    stats.getStats();
    setTimeout(() => {
      setShowModal(true);
      reset();
    }, 1000);
  }

  function reset() {
    timer.reset();
    setMatches([]);
    setCharactersMissed([]);
    setUserInput("");
  }

  function getMatchesArray(value: string) {
    //Get an array of booleans where each index represents whether or not the character at that index matches
    return value.split("").map((character, index) => {
      return character === text[index];
    });
  }
  return {
    elapsedTime: timer.elapsedTime,
    matches,
    isExploading,
    showModal,
    setShowModal,
    stats: stats.stats,
    setUserInput,
  };
}
