import axios from "axios";
import Cookies from "js-cookie";
import { getCompanySlugFromLocation } from "./company-host";

const companySlug = getCompanySlugFromLocation(window.location);
const accessToken = Cookies.get("accessToken");

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    ...(companySlug && { "x-Company-Slug": companySlug }),
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});
