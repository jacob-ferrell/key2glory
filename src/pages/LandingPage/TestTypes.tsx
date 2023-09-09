import { useNavigate } from "react-router-dom";

export default function TestTypes() {
  const navigate = useNavigate();

  const testTypes = [
    {
      name: "General",
      description:
        "Typing test with common words, punctuation and occasional numbers",
      url: "/test-basic",
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
      url: "/test-numbers",
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
      description: "Typing test with a focus special characters",
      url: "/test-special",
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
      <h1 className="w-full text-left text-white text-4xl mb-3">Speed Tests</h1>
      <div className="w-full h-fit bg-zinc-800 flex rounded-lg">
        {testTypes.map((testType, i) => {
          return (
            <>
              <div className="w-1/3 h-full flex flex-col justify-center text-white items-start p-4 gap-5 relative">
                <div className="flex justify-start gap-5 text-xl items-center w-full">
                  <div className="text-2xl font-bold">{testType.name}</div>
                  {testType?.coloredText}
                </div>
                <div className="h-12">{testType.description}</div>
                <button
                  onClick={() => navigate(testType.url)}
                  className={`bg-purple-600 px-3 font-bold`}
                >
                  Begin!
                </button>
                {i !== 0 ? (
                  <div className="h-full border-r-4 h-3/4 rounded-full border-zinc-900 absolute -left-2.5 z-20"></div>
                ) : null}
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}
