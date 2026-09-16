import { createClient } from "@neondatabase/neon-js";

const authUrl = import.meta.env.VITE_NEON_AUTH_URL;
const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL;

export const neonAuthEnabled =
  import.meta.env.VITE_AUTH_PROVIDER === "neon" && Boolean(authUrl);

export const neonClient = neonAuthEnabled
  ? createClient({
      auth: { url: authUrl },
      ...(dataApiUrl ? { dataApi: { url: dataApiUrl } } : {}),
    })
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
  if (!neonClient) {
    throw new Error(
      "Google sign-in is unavailable because Neon Auth is not configured for this deployment. Set VITE_AUTH_PROVIDER=neon and VITE_NEON_AUTH_URL in the frontend service."
    );
  }
  if (!neonClient.auth?.signIn?.social) {
    throw new Error("Google sign-in is unavailable in the configured Neon Auth client.");
  }
  const result = await neonClient.auth.signIn.social({
    provider: "google",
    callbackURL: `${window.location.origin}/login`,
  });
  if (result?.error) throw new Error(result.error.message || "Google sign-in failed.");
  const redirectUrl = result?.data?.url || result?.url;
  if (redirectUrl) {
    window.location.assign(redirectUrl);
  }
  return result;
}
