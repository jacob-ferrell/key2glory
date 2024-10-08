import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function TestTypes() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  const testTypes = [
    {
      name: "General",
      description: "Typing test with common words and punctuations",
      testId: 1,
      coloredText: (
        <div className="text-xl font-bold bg-zinc-900 px-2 rounded-xl">
          <span className="text-blue-500">A</span>
          <span className="text-red-500">B</span>
          <span className="text-yellow-500">C</span>
          <span className="text-green-500">1</span>
          {/* <span className="text-purple-500">T</span>
          <span className="text-orange-500">Y</span>
          <span className="text-yellow-500">1</span>
          <span className="text-red-500">2</span>
          <span className="text-blue-500">3</span> */}
        </div>
      ),
    },
    {
      name: "Numbers",
      description: "Typing test with a focus on numbers",
      testId: 2,
      coloredText: (
        <div className="text-xl font-bold bg-zinc-900 px-2 rounded-xl">
          <span className="text-purple-300">1</span>
          <span className="text-purple-400">2</span>
          <span className="text-purple-500">3</span>
          <span className="text-purple-600">4</span>
        </div>
      ),
    },
    {
      name: "Special Characters",
      description: "Typing test with a focus on special characters",
      testId: 3,
      coloredText: (
        <div className="text-xl font-bold bg-zinc-900 px-2 rounded-xl">
          <span className="text-red-500">!</span>
          <span className="text-yellow-500">@</span>
          <span className="text-green-500">#</span>
          <span className="text-blue-500">$</span>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full px-6 my-6">
      <h1 className="w-full text-left text-white text-4xl mb-3">Quick Play</h1>
      <div className="w-full h-fit bg-zinc-800 flex rounded-lg">
        {testTypes.map((testType, i) => {
          return (
            <div
              key={"test" + i}
              className="w-1/3 h-full flex flex-col justify-between items-start text-white p-4 gap-5 relative"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-start gap-5 text-xl items-center w-full">
                  <div className="text-2xl font-bold">{testType.name}</div>
                  {testType?.coloredText}
                </div>
                <div className="h-12">{testType.description}</div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/typing-test/${testType.testId}`)}
                  className={`bg-purple-600 px-3 font-bold`}
                >
                  Begin!
                </button>
                {!!isAuthenticated ? (
                  <button
                    className={`bg-purple-600 px-3 font-bold`}
                    onClick={() =>
                      navigate(`/create/${testType.name.toLowerCase().replace(' ', '-')}`)
                    }
                  >
                    Create Your Own!
                  </button>
                ) : null}
              </div>
              {i !== 0 ? (
                <div className="border-r-4 h-3/4 rounded-full border-zinc-900 absolute -left-2.5 z-20"></div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
