import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import getRandomTest from "../../api/getRandomTest";
import { TestType } from "../../common/types";

const testTypes: { name: string; type: TestType; slug: string; description: string; coloredText: JSX.Element }[] = [
  {
    name: "General",
    type: "GENERAL",
    slug: "general",
    description: "Typing test with common words and punctuation",
    coloredText: (
      <div className="text-xl font-bold bg-zinc-900 px-2 rounded-xl">
        <span className="text-blue-500">A</span>
        <span className="text-red-500">B</span>
        <span className="text-yellow-500">C</span>
        <span className="text-green-500">1</span>
      </div>
    ),
  },
  {
    name: "Numbers",
    type: "NUMBERS",
    slug: "numbers",
    description: "Typing test with a focus on numbers",
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
    type: "SPECIAL_CHARACTERS",
    slug: "special-characters",
    description: "Typing test with a focus on special characters",
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

export default function TestTypes() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const [starting, setStarting] = useState<TestType | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function begin(type: TestType) {
    setStarting(type);
    setError(null);
    try {
      const test = await getRandomTest(type);
      navigate(`/typing-test/${test.id}`);
    } catch {
      setError("Couldn't load a test. Please try again.");
      setStarting(null);
    }
  }

  return (
    <section className="w-full my-6">
      <h1 className="mb-3 text-4xl font-bold">Quick Play</h1>
      <p className="mb-4 text-zinc-400">Pick a category and get a random test from it.</p>
      <div className="grid w-full gap-px overflow-hidden rounded-lg bg-zinc-900 md:grid-cols-3">
        {testTypes.map((testType) => (
          <div key={testType.type} className="flex flex-col justify-between gap-5 bg-zinc-800 p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">{testType.name}</h2>
                {testType.coloredText}
              </div>
              <p className="text-zinc-300">{testType.description}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => begin(testType.type)}
                disabled={starting !== null}
                className="rounded-md bg-purple-600 px-4 py-1.5 font-bold transition hover:bg-purple-500 disabled:opacity-60"
              >
                {starting === testType.type ? "Loading…" : "Begin!"}
              </button>
              {isAuthenticated ? (
                <button
                  className="rounded-md bg-zinc-700 px-4 py-1.5 font-bold transition hover:bg-zinc-600"
                  onClick={() => navigate(`/create/${testType.slug}`)}
                >
                  Create Your Own
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
    </section>
  );
}
