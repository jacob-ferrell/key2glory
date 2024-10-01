import { useEffect, useState } from "react";
import getMissedCharacters from "../api/getMissedCharacters";

export default function useUserStats() {
    const [missedCharacters, setMissedCharacters] = useState<Map<string, number>>(new Map());
    const [isEmpty, setIsEmpty] = useState<boolean>(true);

    useEffect(() => {
        getMissedCharacters().then(res => {
            if (res.size === 0) {
                setIsEmpty(true);
                return;
            }
            setIsEmpty(false);
            setMissedCharacters(res);
        });
    }, []);

    return { missedCharacters, isEmpty }
}