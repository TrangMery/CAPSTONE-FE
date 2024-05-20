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
    return error?.response?.data ?? Promise.reject(error);
  }
);

export default instance;
