import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { setTokenProvider } from "../api/axiosInstance";

/** Hands the API client a way to get the current access token once Auth0 has loaded. */
export default function AuthTokenSync() {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isLoading) return;
    setTokenProvider(isAuthenticated ? () => getAccessTokenSilently() : async () => null);
  }, [isLoading, isAuthenticated, getAccessTokenSilently]);

  return null;
}
