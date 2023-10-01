import { useState } from "react";
import { Stats } from "../common/types";
import { createRange } from "../common/util";



type useStatsProps = {
  text: string | null;
  missedCharacters: string[];
  timer: any;
};

export default function useStats({
  text,
  missedCharacters,
  timer,
}: useStatsProps) {
  const [stats, setStats] = useState<Stats>({
    WPM: 0.0,
    accuracy: 0.0,
    time: 0.0,
    missedCharacters: [],
    wpmScore: 0,
    overallScore: 0,
  });

  function getWPM() {
    if (!text) return 0;
    let words: number = text.split(" ").length;
    let minutes: number = parseFloat((timer.elapsedTime / 60).toFixed(2));
    let WPM: number = parseFloat((words / minutes).toFixed(2));
    console.log(words, minutes, WPM);
    return WPM;
  }

  function getAccuracy() {
    if (!text) return 0;
    let accuracy: string = (
      ((text.length - missedCharacters.length) / text.length) *
      100
    ).toFixed(2);
    return Number(accuracy);
  }

  function getWpmScore(wpm: number) {
    const ranges = [
      createRange(0, 40),
      createRange(40, 50),
      createRange(50, 60),
      createRange(60, 70),
      createRange(70, 120),
      createRange(120, 200),
      createRange(200, 300),
      createRange(300, 1000)
    ]
    ranges.forEach((range, index) => {
      if (range.includes(wpm)) {
        return index + 1;
      }
    })
    return 0;
  }

  function getOverallScore(wpm: number, accuracy: number) {
    return wpm * (accuracy / 100);
  }

  function getStats() {
    const wpm = getWPM();
    const accuracy = getAccuracy();
    const newStats = {
       WPM: wpm,
      accuracy,
      time: Number(timer.elapsedTime.toFixed(2)),
      missedCharacters,
      wpmScore: getWpmScore(wpm),
      overallScore: getOverallScore(wpm, accuracy)
    };
    setStats(newStats);
    return;
  }

  return { stats, getStats };
}
