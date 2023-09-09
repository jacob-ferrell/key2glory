type ClearButtonProps = {
  setUserInput: (userInput: string) => void;
};

export default function ClearButton({ setUserInput }: ClearButtonProps) {

  function handleClick() {
    setUserInput("");
  }

  return (
    <button className="rounded bg-red-800 px-3" onClick={handleClick}>
      Clear
    </button>
  );
}
