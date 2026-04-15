const DEFAULT_API_BASE_URL = "https://teen-talks.onrender.com";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");
export const API_V1_BASE_URL = `${API_BASE_URL}/api/v1`;
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export function apiUrl(path) {
  if (!path) return API_V1_BASE_URL;
  return `${API_V1_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
