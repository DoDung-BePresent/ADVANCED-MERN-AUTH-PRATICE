import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  }
);

export default API;
