import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import axiosInstance from "../util/axiosInstance.js";
import { AxiosResponse } from "axios";

export default function Navbar() {
  const { loginWithRedirect, user, isAuthenticated, isLoading, logout, getAccessTokenSilently, getIdTokenClaims } =
    useAuth0();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) return;
      if (user) {
        console.log(Object.keys(user));
      }
      getIdTokenClaims().then(res => console.log(res)); 
      getAccessTokenSilently().then(res => {
        console.log(res);
        localStorage.setItem("token", res);
        interface MyResponseData {
          // Define the structure of your response data here
          // For example, if your response data is JSON with a 'message' field:
          message: string;
        }
        
        // ...
        
        axiosInstance.get<MyResponseData>("/private/secured").then((res: AxiosResponse<MyResponseData>) => {
          // Access the response data
          const responseData: MyResponseData = res.data;
          console.log(responseData);
        });
      })
      
    }, [isAuthenticated])
  return (
    <div
      className="flex justify-between w-full items-center h-16 text-gray-50 text-lg shadow-sm font-sans font-bold px-6"
      role="navigation"
    >
      <div className="flex gap-4 items-center">
        <Link to="/">
          <div className="text-2xl cursor-pointer">Key2Glory</div>
        </Link>
        <div className="cursor-pointer rounded transition duration-300 hover:text-purple-600">
          Test My Speed
        </div>
        <div className="cursor-pointer rounded transition duration-300 hover:text-purple-600">
          Leaderboards
        </div>
      </div>
      <div className="flex gap-4 items-center">
        {isAuthenticated ? (
          <div
            onClick={() => logout()}
            className="cursor-pointer rounded transition duration-300 hover:text-purple-600"
          >
            Log Out {user?.email}
          </div>
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
