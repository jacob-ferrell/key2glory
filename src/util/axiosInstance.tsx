import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const baseURL = "http://localhost:8081/api/";

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

export default axiosInstance;
