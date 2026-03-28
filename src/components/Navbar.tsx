import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import UserDropdown from "./UserDropdown";
import logoIcon from "../assets/images/logo-icon.png";

export default function Navbar() {
  const {
    loginWithRedirect,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  const location = useLocation();

  const allFalse = {
    leaderboards: false,
    browse: false,
  }

  const [selected, setSelected] = useState(allFalse);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      localStorage.removeItem("token");
      return;
    }
    getAccessTokenSilently().then((res) => {
      localStorage.setItem("token", res);
    });
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (location.pathname.includes("browse")) {
      return setSelected({ ...selected, browse: true });
    }
    setSelected(allFalse);
  }, [location.pathname])
  return (
    <div
      className="flex justify-between w-full items-center h-16 text-gray-50 text-lg shadow-sm font-sans font-bold px-6"
      role="navigation"
    >
      <div className="flex gap-4 items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoIcon} alt="Key2Glory" className="h-10 w-10 rounded-full object-cover" />
          <div className="text-2xl cursor-pointer">Key2Glory</div>
        </Link>
        <Link to="/">
          <div className="cursor-pointer rounded transition duration-300 hover:text-purple-600">
            Home 
          </div>
        </Link>
        <div className="cursor-pointer rounded transition duration-300 hover:text-purple-600">
          Leaderboards
        </div>
        
        <Link to="/typing-test/browse">
          <div className={`cursor-pointer rounded transition duration-300 hover:text-purple-600 ${selected.browse ? 'text-purple-600' : null}`}>
            Browse
          </div>
        </Link>
      </div>
      <div className="flex gap-4 items-center">
        {isAuthenticated ? (
          <UserDropdown />
        ) : (
          <div
            onClick={() => loginWithRedirect()}
            className="cursor-pointer rounded transition duration-300 hover:text-purple-600"
          >
            Sign In
          </div>
        )}
      </div>
    </div>
  );
}
