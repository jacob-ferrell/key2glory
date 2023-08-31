import { useState } from "react";

type Stats = {
  WPM: number;
  accuracy: string;
  time: string;
  "Keys Missed": number;
};

type useStatsProps = {
    text: string;
    charactersMissed: string[];
    timer: any;
}

export default function useStats({text, charactersMissed, timer}: useStatsProps) {
  const [stats, setStats] = useState<Stats>({
    WPM: 0.0,
    accuracy: "",
    time: "",
    "Keys Missed": 0,
  });

  function getWPM() {
    let words: number = text.split(" ").length;
    let minutes: number = parseFloat((timer.elapsedTime / 60).toFixed(2));
    let WPM: number = parseFloat((words / minutes).toFixed(2));
    console.log(words, minutes, WPM);
    return WPM;
  }

  function getAccuracy() {
    let accuracy: string =
      (((text.length - charactersMissed.length) / text.length) * 100).toFixed(
        2
      ) + "%";
    return accuracy;
  }

  function getMissedKeysCounts() {
    let counts: { [key: string]: number } = {};
    charactersMissed.forEach((char) => {
      counts[char] = (counts[char] || 0) + 1;
    });
    return counts;
  }

  function getStats() {
    const newStats = {
      WPM: getWPM(),
      accuracy: getAccuracy(),
      time: timer.elapsedTime.toFixed(2) + " seconds",
      "Keys Missed": charactersMissed.length,
    };
    setStats(newStats);
  }

  

  

  return {stats, getStats};
}
