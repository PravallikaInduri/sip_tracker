"use client";

import Cookies from "js-cookie";

const AUTH_TOKEN = "sipAuthToken";
const AUTH_USER = "sipAuthUser";
const INVESTOR_ID = "sipInvestorId";

export function setAuthToken(token, user, investorId, rememberMe = false) {
  const cookieOptions = {
    expires: rememberMe ? 7 : 1,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };

  Cookies.set(AUTH_TOKEN, token, cookieOptions);
  if (user) {
    Cookies.set(AUTH_USER, JSON.stringify(user), cookieOptions);
  }
  if (investorId) {
    Cookies.set(INVESTOR_ID, investorId, cookieOptions);
  }
}

export function getAuthToken() {
  return Cookies.get(AUTH_TOKEN) || "";
}

export function getAuthUser() {
  const raw = Cookies.get(AUTH_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getInvestorId() {
  return Cookies.get(INVESTOR_ID) || "INV001";
}

export function removeAuthCookies() {
  Cookies.remove(AUTH_TOKEN, { path: "/" });
  Cookies.remove(AUTH_USER, { path: "/" });
  Cookies.remove(INVESTOR_ID, { path: "/" });
}
