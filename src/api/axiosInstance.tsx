import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

let baseURL;
if (import.meta.env.DEV) {
  baseURL = import.meta.env.VITE_API_SERVER_URL;
} else {
  baseURL = import.meta.env.VITE_API_BASE_URL ?? "/api/";
}

type TokenProvider = () => Promise<string | null>;

let tokenProvider: TokenProvider | null = null;
let markAuthReady: () => void;
// Requests wait until Auth0 has finished loading, so the first request after a
// page load is sent with the user's token instead of racing it
const authReady = new Promise<void>((resolve) => (markAuthReady = resolve));

/** Called by AuthTokenSync once Auth0 knows whether the user is signed in. */
export function setTokenProvider(provider: TokenProvider) {
  tokenProvider = provider;
  markAuthReady();
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (request: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    await authReady;
    // getAccessTokenSilently caches and refreshes tokens, so this is cheap
    const token = await tokenProvider?.().catch(() => null);
    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }
    return request;
  }
);

/** Best-effort human readable message for a failed request. */
export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message) return message;
    if (error.code === "ECONNABORTED") return "The server took too long to respond";
    if (!error.response) return "Couldn't reach the server";
  }
  return fallback;
}

export default axiosInstance;
