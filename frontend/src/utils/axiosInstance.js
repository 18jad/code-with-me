import axios from "axios";
import Cookies from "js-cookie";

// Replace it with your own backend server port
const PORT = 2121;

// Your current api version
const API_VERSION = "1.0";

// Your current api slug
const SLUG = "api";

// Base url of backend server
const BASE_URL = `http://localhost:${PORT}/${SLUG}/V${API_VERSION}`;

// Auth credentials (token, userinfo)
const authCookies = Cookies.get("persist:user");

// JWT Token
const token = authCookies ? JSON.parse(authCookies)?.token.split('"')[1] : null;

// Axios instance configurations
const config = {
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Access-Control-Allow-Origin": BASE_URL,
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin",
  },
  timeout: 10000,
};

// Without authentication
export const axiosInstance = axios.create(config);

// With authentication
Object.assign(config.headers, { Authorization: `Bearer ${token}` });

export const axiosUser = axios.create(config);

// Axios interceptor, to handle bearer token change and expiration
axiosUser.interceptors.request.use(
  (config) => {
    const token = Cookies.get("persist:user")
      ? JSON.parse(Cookies.get("persist:user"))?.token.split('"')[1]
      : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete axiosUser.defaults.headers.common.Authorization;
    }
    return config;
  },

  (error) => Promise.reject(error),
);
