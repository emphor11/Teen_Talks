// src/services/api.js
import axios from "axios";
import { API_V1_BASE_URL } from "../utils/config";

const API = axios.create({
  baseURL: API_V1_BASE_URL,
  // withCredentials:false by default; we'll not use cookies for now
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
