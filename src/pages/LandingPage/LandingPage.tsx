import TestTypes from "./TestTypes";
import { useAuth0 } from "@auth0/auth0-react";

export default function LandingPage() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  return (
    <div className="h-full">
      <TestTypes />
      {!isLoading && !isAuthenticated ? (
        <div className="w-full h-fit px-6">
          <div className="bg-zinc-800 rounded-lg w-1/2 h-full text-white p-4 flex flex-col gap-5">
            <h1 className="text-2xl font-bold">Don't have an account?</h1>
            <p className="text-xl">Sign up to: </p>
            <ul className="list-disc px-6">
              <li>Record your scores</li>
              <li>Track your strengths and weaknesses</li>
              <li>Generate customized tests</li>
              <li>Rate tests</li>
              <li>Be visible in leaderboards</li>
            </ul>
            <button
              onClick={() => loginWithRedirect()}
              className="bg-purple-600 rounded font-bold w-1/2"
            >
              Sign Up Now!
            </button>
          </div>
        </div>
      ) : null}
      {/* <div className="bg-gradient-to-b from-zinc-900 via-violet-500 to-zinc-900 w-full h-24"></div> */}
      
    </div>
  );
}
