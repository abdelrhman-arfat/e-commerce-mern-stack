import axios from "axios";
import { API_URL } from "./constants/api_url";
const app = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default app;
