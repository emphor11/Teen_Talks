import { API_V1_BASE_URL } from "./config";

export function resolveMediaUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_V1_BASE_URL}${url}`;
}
