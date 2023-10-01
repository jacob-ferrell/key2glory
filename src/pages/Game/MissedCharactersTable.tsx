type MissedCharactersTableProps = {
  missedCharacters: string[];
  show: boolean;
};

export default function MissedCharactersTable({
  missedCharacters,
  show,
}: MissedCharactersTableProps) {
  const missedCharactersMap = new Map<string, number>();
  missedCharacters.forEach((char) => {
    if (missedCharactersMap.has(char)) {
      missedCharactersMap.set(char, missedCharactersMap.get(char)! + 1);
    } else {
      missedCharactersMap.set(char, 1);
    }
  });
  return (
    <div
      className={`relative overflow-x-auto transition-all duration-500 ${
        show ? "opacity-100 max-h-screen" : "opacity-0 max-h-0 overflow-hidden"
      }`}
    >
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-2 py-2">
              Character
            </th>
            <th scope="col" className="px-2 py-2">
              Times Missed
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from(missedCharactersMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([key, value], i) => {
              return (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={i}>
                  <th
                    scope="row"
                    className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {key}
                  </th>
                  <td className="px-2 py-1">{value}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
