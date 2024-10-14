import { useEffect, useRef, useState } from "react";
import useSession from "./useSession";


export default function useInput(text: string | null) {
  const [userInput, setUserInput] = useState("");
  const [matches, setMatches] = useState<boolean[]>([]);
  const [missedCharacters, setMissedCharacters] = useState<string[]>([]);
  const [isExploading, setIsExploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const prevUserInputRef = useRef<string>("");

  const session = useSession({ text, missedCharacters });


  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (text === null) return;
    if (userInput.length && session.timer.interval === null) {
      //start session if user starts typing
      session.start();
    }
    if (!userInput.length && session.timer.interval !== null) {
      //stop session if user deletes all input and reset all stats
      return reset();
    }
    if (
      matches[matches.length - 1] === false &&
      isError(userInput) &&
      userInput.length > prevUserInputRef.current.length
    ) {
      //if user makes 2 mistakes in a row, do not progress but add the missed character
      addMissedCharacter();
      return setUserInput(prevUserInputRef.current);
    }
    if (
      !isBackSpace(prevUserInputRef.current, userInput) &&
      isError(userInput) &&
      userInput !== prevUserInputRef.current
    ) {
      //add missed character if user makes a mistake
      addMissedCharacter();
    }
    setMatches(getMatchesArray(userInput));
    if (userInput.length === text.length) {
      handleCompletion();
    }
  }, [userInput, session.timer.interval]);

  function isBackSpace(prev: string, value: string) {
    return prev.length > value.length;
  }

  function isError(value: string) {
    if (text === null) return false;
    return value[value.length - 1] !== text[value.length - 1];
  }

  function addMissedCharacter() {
    if (text === null) return;
    setMissedCharacters((prev) => [
      ...prev,
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

  async function handleCompletion() {
    if (isExploading) return;
    session.stop();
    reset();
    setIsExploading(true);
    setTimeout(() => {
      setShowModal(true);
      //reset();
    }, 1000);
  }

  function reset() {
    //session.timer.reset();
    setMatches([]);
    setMissedCharacters([]);
    setUserInput("");
  }

  function getMatchesArray(value: string) {
    //Get an array of booleans where each index represents whether or not the character at that index matches
    if (text === null) return [];
    return value.split("").map((character, index) => {
      return character === text[index];
    });
  }
  return {
    elapsedTime: session.timer.elapsedTime,
    matches,
    isExploading,
    showModal,
    setShowModal,
    reset,
    stats: session.stats,
    setUserInput,
    missedCharacters,
  };
}
