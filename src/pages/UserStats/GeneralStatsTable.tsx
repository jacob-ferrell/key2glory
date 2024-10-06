import { capitalize } from "../../common/util";
import useUserStats from "../../hooks/useUserStats";
import { GeneralStats } from "../../common/types";

export default function GeneralStatsTable() {
  const { generalStats } = useUserStats();
  const keys: (keyof GeneralStats)[] = [
    "averageWPM",
    "highestWPM",
    "averageAccuracy",
    "testsCompleted",
    "testsContributed",
  ];
  function separateWords(key: string): string {
    let i;
    for (i = 0; i < key.length; i++) {
      if (key[i].toUpperCase() == key[i]) {
        break;
      }
    }
    return capitalize(key.slice(0, i)) + " " + capitalize(key.slice(i));
  }
  return (
    <div
      className={`relative overflow-x-auto transition-all duration-500 opacity-100 max-h-screen
      `}
    >
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
       </thead>
        <tbody>
          {keys.map((key) => {
            return (
              <tr>
                <th scope="col" className="px-2 py-2">
                  {separateWords(key)}
                </th>
                <td className="px-2 py-1">{generalStats?.[key]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
