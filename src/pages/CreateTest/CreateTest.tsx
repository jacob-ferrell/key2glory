import { useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import postTest from "../../api/postTest";
import { getErrorMessage } from "../../api/axiosInstance";
import { countWords, normalizeText } from "../../common/typing";
import { TEST_TYPES, testTypeFromSlug } from "../../common/util";
import { ErrorNotice, Spinner } from "../../components/Feedback";
import useTitle from "../../hooks/useTitle";

// Must match TypingTest.MIN_LENGTH / MAX_LENGTH on the backend
const MIN_LENGTH = 30;
const MAX_LENGTH = 2000;

/** Same cleaning the server applies: newlines and repeated whitespace become single spaces. */
function cleanText(text: string): string {
  return normalizeText(text).replace(/\s+/g, " ").trim();
}

export default function CreateTest() {
  const { testType } = useParams();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const [testText, setTestText] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const type = testTypeFromSlug(testType);

  useTitle("Create a test");

  const cleaned = cleanText(testText);
  const length = cleaned.length;
  const canSubmit = length >= MIN_LENGTH && length <= MAX_LENGTH && !submitting;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const test = await postTest(type, cleaned);
      navigate(`/typing-test/${test.id}`);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't create the test"));
      setSubmitting(false);
    }
  }

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <h2 className="text-2xl font-bold">Create a Test</h2>
        <p className="text-zinc-400">Sign in to create and share your own typing tests.</p>
        <button
          onClick={() => loginWithRedirect()}
          className="rounded-md bg-purple-600 px-4 py-2 font-semibold hover:bg-purple-500"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl flex-col gap-4">
      <h2 className="text-2xl font-bold">Create a Test</h2>

      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Test type">
        {TEST_TYPES.map((option) => (
          <button
            key={option.type}
            type="button"
            role="radio"
            aria-checked={option.type === type}
            onClick={() => navigate(`/create/${option.slug}`, { replace: true })}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              option.type === type ? "bg-purple-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {option.name}
          </button>
        ))}
      </div>

      <p className="text-sm text-zinc-400">
        Tests must be between {MIN_LENGTH} and {MAX_LENGTH} characters. Line breaks and repeated spaces are
        turned into single spaces, and curly quotes are replaced with straight ones so everything can be typed.
      </p>

      <textarea
        className="h-56 w-full resize-y rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-zinc-100 placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none"
        name="test"
        value={testText}
        onChange={(e) => setTestText(e.target.value)}
        id="test-text"
        placeholder="Paste or type the text for your test…"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-4 text-sm tabular-nums">
          <span className={length > MAX_LENGTH || (length > 0 && length < MIN_LENGTH) ? "text-amber-300" : "text-zinc-400"}>
            {length} / {MAX_LENGTH} characters
          </span>
          <span className="text-zinc-400">{countWords(cleaned)} words</span>
        </div>
        <button
          type="submit"
          className="rounded-md bg-purple-600 px-5 py-2 font-semibold transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-purple-600"
          disabled={!canSubmit}
        >
          {submitting ? "Creating…" : "Create Test"}
        </button>
      </div>
      {error ? <ErrorNotice message={error} /> : null}
    </form>
  );
}
