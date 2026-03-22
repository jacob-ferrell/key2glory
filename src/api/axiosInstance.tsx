import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

let baseURL;
if (import.meta.env.DEV) {
  baseURL = import.meta.env.VITE_API_SERVER_URL;
} else if (import.meta.env.PROD) {
  baseURL = "https://tomcatserver.jacobferrell.net/Key2Glory-0.0.1-SNAPSHOT/api/";
}


const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig  => {
    const token = localStorage.getItem("token");
    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      localStorage.removeItem("token");
    }
    return response;
  },
);


export default axiosInstance;
