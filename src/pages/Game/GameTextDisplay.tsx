import { useEffect } from "react";
import ConfettiExplosion from "react-confetti-explosion";

type GameTextDisplayProps = {
  text: string;
  matches: boolean[];
  isExploading: boolean;
};

export default function GameTextDisplay({
  text,
  matches,
  isExploading,
}: GameTextDisplayProps) {
  useEffect(() => {}, [matches]);

  function renderText() {
    let i = 0;
    const words = text
      .split(" ")
      .map((word, i, words) => (i === words.length - 1 ? word : word + " "));
    return words.map((word) => {
      return (
        <div key={i} className="flex">
          {word.split("").map((char) => {
            char = char == " " ? "\u00A0" : char;
            const isNext = i === matches.length;
            const classes = `${
              i > matches.length - 1
                ? `text-grey-800`
                : matches[i]
                ? "grow text-green-500 bg-green-500"
                : "wiggle text-red-500 bg-red-500"
            } bg-opacity-10 rounded w-5 flex justify-center items-center text-center relative`;
            i++;
            return (
                <div id={`c-${i}`} key={i} className={classes}>
                  {char}
                  {isNext ? <div className="absolute bottom-0 w-full h-1 bg-violet-500 rounded animate-opacity"></div> : null}
                </div>
            );
          })}
        </div>
      );
    });
  }

  return (
    <div className="flex flex-col justify-center items-center px-3 bg-zinc-900 rounded py-2">
      {isExploading ? (
        <ConfettiExplosion
          force={0.6}
          duration={2500}
          particleCount={80}
          width={1000}
        />
      ) : null}
      <div className="text-2xl flex flex-wrap">{renderText()}</div>
    </div>
  );
}
