import { useNavigate } from "react-router-dom";
import { TypingTest } from "../../common/types";

type TestsTableProps = {
    tests: TypingTest[];
};

export default function TestsTable({ tests }: TestsTableProps) {
  const tableHeadings = [
    "Type",
    "Length",
    "Average Rating",
    "Ratings",
    "Completed",
    "Creator",
  ];

  const navigate = useNavigate();

  function handleClick(testId: number) {
    navigate(`/typing-test/${testId}`);
  }
  
  return (
    <div className="w-3/4 px-3">
      <h1>Tests Table</h1>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {tableHeadings.map((heading, i) => <th scope="col" key={'h' + i} className="px-2 py-2">
              {heading}
            </th>)}
            
          </tr>
        </thead>
        <tbody>
            {tests?.map((test, i) => {
                return (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:bg-gray-600" key={i} onClick={() => handleClick(test.id)}>
                        <td className="px-2 py-1">{test.type}</td>
                        <td className="px-2 py-1">{test.text.length + " characters"}</td>
                        <td className="px-2 py-1">{test.rating}</td>
                        <td className="px-2 py-1">{test.ratings}</td>
                        <td className="px-2 py-1">{test.scoresCount}</td>
                        <td className="px-2 py-1">{test.createdBy}</td>
                    </tr>
                )
            })}
        </tbody>
      </table>
    </div>
  );
}
