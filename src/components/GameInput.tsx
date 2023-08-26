import { ChangeEvent, SetStateAction } from "react";

type GameInputProps = {
    userInput: string;
    setUserInput: React.Dispatch<SetStateAction<string>>;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function GameInput({userInput, setUserInput, handleChange}: GameInputProps) {




    return (
        <input onChange={handleChange} defaultValue={userInput} className="w-full h-12 px-3 rounded"></input>
    );
}