import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import postTest from "../../api/postTest";
import { useAuth0 } from "@auth0/auth0-react";

export default function CreateTest() {
  const { testType } = useParams();
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [testText, setTestText] = useState<string>("");
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    const text = cleanText(event.target.value);
    setTestText(text);
    setCharacterCount(text.length);
    setWordCount(text.trim().split(" ").length);
    if (text.length >= 30 && text.length <= 2000) {
      setCanSubmit(true);
      return;
    }
    setCanSubmit(false);
  }

  function handleSubmit() {
    postTest(testType?.toUpperCase().replace("-", "_") || "", testText).then(
      (res) => navigate(`/typing-test/${res.id}`)
    );
  }

  function cleanText(text: string): string {
    return text.replace(/\n/g, "").replace(/\s{2,}/g, " ");
  }
  return (
    <div className="w-full flex flex-col gap-3 items-center">
      <h2 className="font-bold text-2xl">Create a Test</h2>
      <div className="w-1/3 text-sm text-center">
        Typing tests must be between 30-2000 characters before submission is
        possible. New line characters (pressing enter) and 2 or more consecutive
        whitespaces (pressing spacebar more than once) will automatically be
        removed.
      </div>
      <textarea
        className="w-1/4 border rounded h-32"
        name="test"
        value={testText}
        onChange={handleChange}
        id="test-text"
      ></textarea>
      <span>{`Character Count: ${characterCount}`}</span>
      <span>{`Word Count: ${wordCount}`}</span>
      <button
        className={`bg-purple-600 px-3 font-bold rounded-md`}
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}
