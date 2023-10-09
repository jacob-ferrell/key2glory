import GameTextDisplay from "./GameTextDisplay";
import Stopwatch from "./Stopwatch";
import ClearButton from "./ClearButton";
import StatsModal from "./StatsModal";
import useGame from "../../hooks/useGame";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import getTest from "../../api/getTest";

type TypingTest = {
  text: string;
  id: number;
  ratings: number;
  rating: number | null;
  createdBy: string;
  currentUserRating: number | null;
  highScore: null;
};

export default function Game() {
  const { testId } = useParams();
  const [typingTest, setTypingTest] = useState<TypingTest | null>(null);

  useEffect(() => {
    getTest(testId).then((res) => setTypingTest(res));
  }, [testId]);

  const {
    elapsedTime,
    matches,
    isExploading,
    showModal,
    setShowModal,
    stats,
    setUserInput,
    missedCharacters,
  } = useGame(typingTest === null ? null : typingTest.text);

  return (
    <>
      {showModal ? (
        <StatsModal
          isOpen={showModal}
          setIsOpen={setShowModal}
          missedCharacters={missedCharacters}
          stats={stats}
          setRating={(rating: number | null) =>
            setTypingTest((prev) =>
              prev ? { ...prev, currentUserRating: rating } : null
            )
          }
          rating={typingTest === null ? null : typingTest.currentUserRating}
        />
      ) : null}
      <div className="flex flex-col items-center gap-12 h-screen">
        <Stopwatch elapsedTime={elapsedTime} />
        <GameTextDisplay
          text={typingTest?.text === null ? "" : typingTest?.text}
          matches={matches}
          isExploading={isExploading}
        />
        <ClearButton setUserInput={setUserInput} />
      </div>
    </>
  );
}
