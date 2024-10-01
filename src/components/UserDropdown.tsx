import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function UserDropdown() {
  const { logout } = useAuth0();
  const navigate = useNavigate();
  const textClass = "cursor-pointer hover:text-purple-500 transition duration-300"
  return (
    <div className="flex gap-3">
      <div className={textClass} onClick={() => navigate("/user/stats")} >My Stats</div>
      <div className={textClass} onClick={() => logout()}>Sign Out</div>
    </div>
  );
}
