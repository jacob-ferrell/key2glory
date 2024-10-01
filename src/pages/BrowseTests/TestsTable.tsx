import { useNavigate } from "react-router-dom";
import { TypingTest } from "../../common/types";
import usePage from "../../hooks/usePage";
import { countWords } from "../../common/util";


export default function TestsTable() {
  const tableHeadings = [
    "Type",
    "Length (words/characters)",
    "Average Rating",
    "Ratings",
    "Completed",
    "Creator",
  ];

  const navigate = useNavigate();

  const page = usePage();

  function handleClick(testId: number) {
    navigate(`/typing-test/${testId}`);
  }
  
  return (
    <div className="w-fit p-1 bg-zinc-700 rounded">
      <table className="w-full text-sm text-left text-zinc-300 dark:text-zinc-300">
        <thead className="text-xs text-zinc-300 uppercase bg-zinc-50 dark:bg-zinc-700 dark:text-zinc-300">
          <tr>
            {tableHeadings.map((heading, i) => <th scope="col" key={'h' + i} className="px-2 py-2">
              {heading}
            </th>)}
            
          </tr>
        </thead>
        <tbody>
            {page.results.map((test, i) => {
                return (
                    <tr className="bg-white border-b dark:bg-zinc-800 dark:border-zinc-700 cursor-pointer hover:bg-zinc-600" key={i} onClick={() => handleClick(test.id)}>
                        <td className="px-2 py-1">{test.type}</td>
                        <td className="px-2 py-1">{`${countWords(test.text)}/${test.text.length}`}</td>
                        <td className="px-2 py-1">{test.rating}</td>
                        <td className="px-2 py-1">{test.ratings}</td>
                        <td className="px-2 py-1">{test.scoresCount !== null ? test.scoresCount : 0}</td>
                        <td className="px-2 py-1">{test.createdBy}</td>
                    </tr>
                )
            })}
        </tbody>
      </table>
    </div>
  );
}
