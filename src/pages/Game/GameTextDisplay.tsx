import { useEffect } from "react";
import ConfettiExplosion from "react-confetti-explosion";

type GameTextDisplayProps = {
  text: string;
  index: number;
  matches: boolean[];
  isExploading: boolean;
};

export default function GameTextDisplay({
  text,
  index,
  matches,
  isExploading,
}: GameTextDisplayProps) {
  useEffect(() => {}, [index, matches]);

  return (
    <div className="flex flex-col justify-center items-center">
        {isExploading ? <ConfettiExplosion force={0.6} duration={2500} particleCount={80} width={1000} /> : null}
        <div className="text-2xl flex flex-wrap">
          {text.split("").map((char, i) => {
            char = char == " " ? "\u00A0" : char;
            if (i > matches.length - 1) {
              return <span className="text-grey-800">{char}</span>
            }
            const classes = `${matches[i] ? 'grow text-green-500 bg-green-500' : 'wiggle text-red-500 bg-red-500'} bg-opacity-10 rounded`;
            return <span className={classes}>{char}</span>
          })}
          
        </div>
    </div>
  );
}
