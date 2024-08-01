
import { notification } from "antd";
import axios from "axios";

// const baseURL = import.meta.env.VITE_BACKEND_URL;
const baseURL = import.meta.env.VITE_BACKEND_URL_DEMO;
const instance = axios.create({
  baseURL: baseURL,
});

instance.defaults.headers.common = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};
// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (
      typeof window !== "undefined" &&
      window &&
      window.localStorage &&
      window.localStorage.getItem("token")
    ) {
      config.headers.Authorization =
        "Bearer " + window.localStorage.getItem("token");
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
const NO_RETRY_HEADER = "x-no-retry";
// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (
      error.config &&
      error.response &&
      +error.response.status === 401 &&
      !error.config.headers[NO_RETRY_HEADER]
    ) {
      error.config.headers[NO_RETRY_HEADER] = "true";
      notification.info({
        description: "Vui lòng đăng nhập lại",
        message: "Hết phiên đăng nhập",
      })
      localStorage.removeItem("token");
      sessionStorage.removeItem("userId");
      window.location.href = "/login";
    }
    return error?.response?.data ?? Promise.reject(error);
  }
);

export default instance;
