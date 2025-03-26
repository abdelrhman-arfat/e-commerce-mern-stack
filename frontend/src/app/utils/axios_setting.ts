import axios from "axios";
import { API_URL } from "./constants/api_url";
import Swal from "sweetalert2";
const app = axios.create({
  baseURL: API_URL, //http://xxxxxxxx/xxxx
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

// make the old functions available again :
const onRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

const refreshAccessToken = async () => {
  try {
    const res = await axios.get(`${API_URL}/auth/refresh-token`, {
      withCredentials: true,
    });
    if (res.status !== 200) {
      Swal.fire({
        title: "Session expired",
        text: "Please login again",
        icon: "error",
        draggable: false,
        cancelButtonText: "Cancel",
        timer: 4000,
      }).then(() => {
        //delete user data from redux
      });
      return false;
    }
    return true;
  } catch (error) {
    console.error("Failed to refresh token", error);
    return false;
  }
};

app.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push(() => resolve(axios(originalRequest)));
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshed = await refreshAccessToken();
      isRefreshing = false;

      if (refreshed) {
        onRefreshed();
        return axios(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default app;
