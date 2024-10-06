import { useEffect, useState } from "react";
import getMissedCharacters from "../api/getMissedCharacters";
import getGeneralStats from "../api/getGeneralStats";
import { GeneralStats } from "../common/types";

export default function useUserStats() {
    const [missedCharacters, setMissedCharacters] = useState<Map<string, number>>(new Map());
    const [hasMissedCharacters, setHasMissedCharacters] = useState<boolean>(false);
    const [hasGeneralStats, setHasGeneralStats] = useState<boolean>(false);
    const [generalStats, setGeneralStats] = useState<GeneralStats | undefined>(undefined);

    useEffect(() => {
        async function fetchData() {
            try {
                const missedCharsResponse = await getMissedCharacters();
                if (missedCharsResponse.size === 0) {
                    setHasMissedCharacters(false);
                } else {
                    setHasMissedCharacters(true);
                    setMissedCharacters(missedCharsResponse);
                }

                const generalStatsResponse = await getGeneralStats();
                setGeneralStats(generalStatsResponse);
                setHasGeneralStats(generalStatsResponse['testsCompleted'] > 0);
            } catch (error) {
                console.error("Error fetching user stats:", error);
            }
        }

        fetchData();
    }, []);

    return { missedCharacters, hasGeneralStats, hasMissedCharacters, generalStats };
}
