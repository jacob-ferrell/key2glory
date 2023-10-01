import { useParams } from "react-router-dom";
import createSession from "../api/createSession";
import endSession from "../api/endSession";
import { useAuth0 } from "@auth0/auth0-react";

export default function useSession() {
    const { testId } = useParams();
    const {isAuthenticated} = useAuth0();

    async function start() {
        if (!isAuthenticated) return;
        const now = new Date().getMilliseconds();
        await createSession(testId, now);
    }

    async function stop() {
        if (!isAuthenticated) return;
        const now = new Date().getMilliseconds();
        await endSession(testId, now);
    }

    return { start, stop };

}