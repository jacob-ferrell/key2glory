import { useState } from "react";


export default function useSound(soundPath: string) {
  const [audio] = useState(new Audio(soundPath));

  function play() {
    audio.currentTime = 0; // Reset the playback position to the beginning
    audio.play();
  }

  return play;
}