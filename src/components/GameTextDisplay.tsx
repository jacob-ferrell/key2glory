import { useEffect } from "react";
import "../index.css";
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
        <div className="text-2xl flex">
          {matches.map((match, index) => {
            return  (
              <>
                <div
                  key={index}
                  className={match ? "grow text-green-500" : "wiggle     text-red-500"}
                >
                  {text[index]}
                </div>
                {text[index + 1] === " " ? <span>&nbsp;</span> : null}
              </>
            );
          })}
          <div className="text-grey-800">{" " + text.slice(matches.length)}</div>
        </div>
    </div>
  );
}
