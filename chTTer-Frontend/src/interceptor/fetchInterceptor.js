import axios from "axios";
import { API_BASE_URL } from "../config/AppConfig.js";

const service = axios.create({
  baseURL: API_BASE_URL,
});

// CONFIG :
// const TOKEN_PAYLOAD_KEY = "authorization";
// const PUBLIC_REQUEST_KEY = "public-request";

// API REQUEST INTERCEPTOR :
service.interceptors.request.use(
  (config) => {
    // const jwtToken = localStorage.getItem("auth_token");
    // if (jwtToken) {
    //   config.headers[TOKEN_PAYLOAD_KEY] = jwtToken;
    // }
    console.log(config);
    return config;
  },
  (error) => {
    console.log("Fetch Request Interceptor Error : ", error);
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    console.log("response - ", response);

    return response.data;
  },
  (error) => {
    console.log(error.response.data);
    return Promise.reject(error.response.data);
  }
);

export default service;
