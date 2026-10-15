import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import UserDropdown from "./UserDropdown";
import logoIcon from "../assets/images/logo-icon.png";

function navClass({ isActive }: { isActive: boolean }) {
  return `rounded px-1 transition duration-300 hover:text-purple-400 ${isActive ? "text-purple-400" : ""}`;
}

export default function Navbar() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  return (
    <nav className="flex flex-wrap justify-between gap-y-2 w-full max-w-6xl mx-auto items-center min-h-16 py-3 text-gray-50 font-bold px-4 sm:px-6">
      <div className="flex flex-wrap gap-x-5 gap-y-1 items-center">
        <Link to="/" className="flex items-center gap-2 mr-2">
          <img src={logoIcon} alt="" className="h-10 w-10 rounded-full object-cover" />
          <span className="text-2xl">Key2Glory</span>
        </Link>
        <NavLink to="/" end className={navClass}>
          Home
        </NavLink>
        <NavLink to="/typing-test/browse" className={navClass}>
          Browse
        </NavLink>
        <NavLink to="/leaderboards" className={navClass}>
          Leaderboards
        </NavLink>
        {isAuthenticated ? (
          <NavLink to="/create/general" className={navClass}>
            Create
          </NavLink>
        ) : null}
      </div>
      <div className="flex gap-4 items-center">
        {isLoading ? null : isAuthenticated ? (
          <UserDropdown />
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            className="rounded-md bg-purple-600 px-4 py-1.5 transition hover:bg-purple-500"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
