import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res: any) => {
    return res;
  },
  async (err: any) => {
    return Promise.reject(err);
  }
);

export default instance;