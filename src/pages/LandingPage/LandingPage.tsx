import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import TestTypes from "./TestTypes";
import logo from "../../assets/images/logo.png";
import useTitle from "../../hooks/useTitle";

export default function LandingPage() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  useTitle(null);

  return (
    <div>
      <div className="flex justify-center">
        <img src={logo} alt="Key2Glory" className="h-64 object-contain -mt-8 -mb-14" />
      </div>
      <TestTypes />
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/typing-test/browse"
          className="rounded-lg bg-zinc-800 p-4 transition hover:bg-zinc-700"
        >
          <h2 className="text-xl font-bold">Browse tests</h2>
          <p className="text-zinc-400">Search community-made tests, sort by rating or popularity.</p>
        </Link>
        <Link to="/leaderboards" className="rounded-lg bg-zinc-800 p-4 transition hover:bg-zinc-700">
          <h2 className="text-xl font-bold">Leaderboards</h2>
          <p className="text-zinc-400">See who the fastest typists on Key2Glory are.</p>
        </Link>
      </div>
      {!isLoading && !isAuthenticated ? (
        <div className="mt-6 flex flex-col gap-5 rounded-lg bg-zinc-800 p-4 md:w-1/2">
          <h2 className="text-2xl font-bold">Don't have an account?</h2>
          <p className="text-xl">Sign up to: </p>
          <ul className="list-disc px-6">
            <li>Record your scores and personal bests</li>
            <li>Track your strengths and weaknesses</li>
            <li>Create and share your own tests</li>
            <li>Rate and favorite tests</li>
            <li>Be visible in leaderboards</li>
          </ul>
          <button
            onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: "signup" } })}
            className="w-fit rounded-md bg-purple-600 px-6 py-2 font-bold transition hover:bg-purple-500"
          >
            Sign Up Now!
          </button>
        </div>
      ) : null}
    </div>
  );
}
