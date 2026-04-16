import { api } from "../libs/api";
import Cookies from "js-cookie";

export type LoginPayload = {
  email: string;
  password: string;
};

type AuthTokenResponse = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn?: string | number | Date;
  refreshTokenExpiresIn?: string | number | Date;
};

const isHttps =
  typeof window !== "undefined" && window.location.protocol === "https:";

const authCookieOptions = {
  path: "/",
  sameSite: "lax",
  secure: isHttps,
} as const;

const toExpiryDate = (value: unknown): Date | undefined => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    if (value > 1e12) {
      return new Date(value);
    }

    if (value > 1e9) {
      return new Date(value * 1000);
    }

    if (value > 0) {
      return new Date(Date.now() + value * 1000);
    }

    return undefined;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      return undefined;
    }

    const numericValue = Number(normalizedValue);

    if (!Number.isNaN(numericValue)) {
      return toExpiryDate(numericValue);
    }

    const parsedDate = new Date(normalizedValue);
    return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
  }

  return undefined;
};

const setAuthCookie = (
  key: "accessToken" | "refreshToken",
  value: string,
  expiresIn?: string | number | Date,
) => {
  const expires = toExpiryDate(expiresIn);

  Cookies.set(key, value, {
    ...authCookieOptions,
    ...(expires ? { expires } : {}),
  });
};

const persistAuthTokens = ({
  accessToken,
  refreshToken,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
}: AuthTokenResponse) => {
  setAuthCookie("accessToken", accessToken, accessTokenExpiresIn);
  setAuthCookie("refreshToken", refreshToken, refreshTokenExpiresIn);
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};

const clearAuthCookies = () => {
  Cookies.remove("accessToken", { path: "/" });
  Cookies.remove("refreshToken", { path: "/" });
};

export const AuthService = {
  login: async (data: LoginPayload): Promise<void> => {
    const res = await api.post("/sign-in", {
      type: "credential",
      email: data.email,
      password: data.password,
    });

    persistAuthTokens(res.data as AuthTokenResponse);
  },
  refreshToken: async (): Promise<void> => {
    const cookieRefreshToken = Cookies.get("refreshToken");

    if (!cookieRefreshToken) {
      throw new Error("No refresh token found");
    }

    const res = await api.post("/sign-in", {
      type: "refreshToken",
      refreshToken: cookieRefreshToken,
    });

    persistAuthTokens(res.data as AuthTokenResponse);
  },
  getMe: async () => {
    const { data } = await api.get("users/me");
    return data;
  },
  signOut: (): void => {
    clearAuthCookies();
  },
};
