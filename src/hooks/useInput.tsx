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
    if (userInput.length && timer.interval === null) {
      timer.start();
    }
    if (!userInput.length && timer.interval !== null) {
      timer.reset();
    }
    if (userInput.length) {
      handleError();
    }
    if (userInput.length === text.length) {
      handleCompletion();
    }
  }, [userInput, timer.interval]);

  function handleError() {
    const value = userInput;
    console.log(value);
    const prev = prevUserInputRef.current;
    const lastCharacterTyped = value[value.length - 1];
    if (isBackSpace(prev, value) || !isError(value)) return;
    if (userInput.length === 1) {
      return setCharactersMissed([text[0]]);
    }
    console.log("error");
    console.log(lastCharacterTyped);
    setCharactersMissed((prevCharactersMissed) => [
      ...prevCharactersMissed,
      text[value.length - 1],
    ]);
  }

  function isBackSpace(prev: string, value: string) {
    return prev.length > value.length;
  }

  function isError(value: string) {
    return value[value.length - 1] !== text[value.length - 1];
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

  function handleCompletion() {
    if (userInput.length !== text.length) return;
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
