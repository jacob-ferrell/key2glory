import GameTextDisplay from "./GameTextDisplay";
import Stopwatch from "./Stopwatch";
import ClearButton from "./ClearButton";
import StatsModal from "./StatsModal";
import useInput from "../../hooks/useInput";

type GameProps = {
  text: string;
};

export default function Game({ text }: GameProps) {
  const {
    elapsedTime,
    matches,
    isExploading,
    showModal,
    setShowModal,
    stats,
    setUserInput,
  } = useInput(text);

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
