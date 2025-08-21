import axios from "axios";

const SERVER_URL = "http://3.38.103.173/"

const apiClient = axios.create({
  baseURL: SERVER_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
