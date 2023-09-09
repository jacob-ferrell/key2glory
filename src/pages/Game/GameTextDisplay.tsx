import { useEffect } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import useTrackLines from "../../hooks/useTrackLines";

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
  
  const { nextCharRef, containerRef, transformY } = useTrackLines();

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
              <div id={`c-${i}`} key={i} className={classes} ref={isNext ? nextCharRef : null}>
                {char}
                {isNext ? (
                  <div className="absolute bottom-0 w-full h-1 bg-violet-500 rounded animate-opacity"></div>
                ) : null}
              </div>
            );
          })}
        </div>
      );
    });
  }

  return (
    <div className={`flex flex-col justify-center items-center `}>
      {isExploading ? (
        <ConfettiExplosion
          force={0.6}
          duration={2500}
          particleCount={80}
          width={1000}
        />
      ) : null}
      <div ref={containerRef} className="bg-zinc-900 rounded relative overflow-hidden h-40">
        <div  style={{transform: `translateY(${transformY}px)`}}className="text-2xl flex flex-wrap clip px-3">
          {renderText()}
        </div>
      </div>
    </div>
  );
}
