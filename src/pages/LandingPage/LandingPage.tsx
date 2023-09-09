import TestTypes from "./TestTypes";

export default function LandingPage() {
  return (
    <>
      <TestTypes />
      <div className="w-full h-fit px-6">
        <div className="bg-zinc-800 rounded-lg w-1/2 h-full text-white p-4 flex flex-col gap-5">
            <h1 className="text-2xl font-bold">Don't have an account?</h1>
            <p className="text-xl">Sign up to: </p>
            <ul className="list-disc px-6">
                <li>Record your scores</li>
                <li>Track your strengths and weaknesses</li>
                <li>Set goals</li>
                <li>Generate customized tests</li>
                <li>Rate tests</li>
                <li>Be visible in leaderboards</li>
            </ul>
            <button className="bg-purple-600 rounded font-bold w-1/2">Sign Up Now!</button>
        </div>
      </div>
      {/* <div className="bg-gradient-to-b from-zinc-900 via-violet-500 to-zinc-900 w-full h-24"></div> */}
      <div className="flex flex-col items-center justify-center h-screen gap-12">
        <h1 className="text-6xl font-bold">Type Fast</h1>
        <div className="flex gap-12">
          <button className="px-4 py-2 text-2xl font-bold text-white bg-blue-500 rounded-md">
            Play
          </button>
          <button className="px-4 py-2 text-2xl font-bold text-white bg-blue-500 rounded-md">
            Stats
          </button>
        </div>
      </div>
    </>
  );
}
