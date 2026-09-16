import { createClient } from "@neondatabase/neon-js";

const authUrl = import.meta.env.VITE_NEON_AUTH_URL;
const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL;

export const neonAuthEnabled =
  import.meta.env.VITE_AUTH_PROVIDER === "neon" && Boolean(authUrl && dataApiUrl);

export const neonClient = neonAuthEnabled
  ? createClient({ auth: { url: authUrl }, dataApi: { url: dataApiUrl } })
  : null;

export async function getNeonToken() {
  return neonClient?.auth.getJWTToken?.() || null;
}

export async function getNeonSession() {
  if (!neonClient) return null;
  const result = await neonClient.auth.getSession();
  return result?.data || result || null;
}

export async function signInWithGoogle() {
  if (!neonClient) throw new Error("Google sign-in is not configured.");
  const result = await neonClient.auth.signIn.social({
    provider: "google",
    callbackURL: window.location.href,
  });
  if (result?.error) throw new Error(result.error.message || "Google sign-in failed.");
  return result;
}
