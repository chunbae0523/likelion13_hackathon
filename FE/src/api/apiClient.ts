import axios from "axios";

export const BASE_URL = "http://15.164.169.162:8080";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
