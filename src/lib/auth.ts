import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "mb_admin_session";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "maple2025";
const SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN || "mb-secret-token-2025";

export function verifyCredentials(username: string, password: string) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function createSession() {
  return SESSION_TOKEN;
}

export function isValidSession(token?: string) {
  return token === SESSION_TOKEN;
}

export async function getAdminSession() {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  return isValidSession(token);
}

export async function setAdminSessionCookie(token: string) {
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSessionCookie() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
}
