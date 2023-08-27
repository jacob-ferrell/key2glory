import { ChangeEvent, ClipboardEvent } from "react";

type GameInputProps = {
  userInput: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCopyOrPaste: (e: ClipboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export default function GameInput({
  userInput,
  handleChange,
  handleCopyOrPaste,
  inputRef,
}: GameInputProps) {
  return (
    <input
      onChange={handleChange}
      onCopy={handleCopyOrPaste}
      onPaste={handleCopyOrPaste}
      ref={inputRef}
      value={userInput}
      className="w-full h-12 px-3 rounded"
    ></input>
  );
}
