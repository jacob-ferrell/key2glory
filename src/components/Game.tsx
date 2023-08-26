import { ChangeEvent, useEffect, useState } from "react";
import GameInput from "./GameInput";
import GameTextDisplay from "./GameTextDisplay";

type GameProps = {
    text: string;
}

export default function Game({text}: GameProps) {

    const [userInput, setUserInput] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        getIndex();
    }, [userInput])

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        //e.persist();
        setUserInput(e.target.value);
        getIndex();
    }
    function getIndex() { //Get the index of text where userInput stops matching
        for (let i = 0; i < text.length; i++) {
            if (userInput[i] !== text[i]) return setIndex(i);
        }
        return setIndex(text.length);
    }

    return (
        <div className="">
            <GameTextDisplay text={text} index={index}/>
            <GameInput userInput={userInput} setUserInput={setUserInput} handleChange={handleChange}/>
        </div>
    );
}