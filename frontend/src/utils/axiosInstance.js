import axios from "axios";

// Replace it with your own backend server port
const PORT = 2121;

// Your current api version
const API_VERSION = "1.0";

const SLUG = "api";

const BASE_URL = `http://localhost:${PORT}/${SLUG}/V${API_VERSION}`;

// JWT Token
const token = "123";

// Axios instance configurations
const config = {
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": BASE_URL,
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin",
  },
};

// Without authentication
export const axiosInstance = axios.create(config);

// With authentication
Object.assign(config.headers, { Authorization: `Bearer ${token}` });
export const axiosUser = axios.create(config);
