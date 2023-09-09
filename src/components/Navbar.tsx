import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div
      className="flex justify-between w-full items-center h-16 text-gray-50 text-lg shadow-sm font-sans font-bold px-6"
      role="navigation"
    >
      <div className="flex gap-4 items-center">
        <Link to="/">
          <div className="text-2xl cursor-pointer">Key2Glory</div>
        </Link>
        <div className="cursor-pointer rounded transition duration-300 hover:text-purple-600">Test My Speed</div>
        <div className="cursor-pointer rounded transition duration-300 hover:text-purple-600">Leaderboards</div>
      </div>
      <div className="flex gap-4 items-center">
        <div className="cursor-pointer rounded transition duration-300 hover:text-purple-600">Sign In</div>
      </div>
    </div>
  );
}
