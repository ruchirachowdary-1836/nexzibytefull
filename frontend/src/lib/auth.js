import { apiRequest } from "./api.js";
import { getNeonSession, neonAuthEnabled, neonClient, signInWithGoogle } from "./neon.js";

const TOKEN_KEY = "techtalk-token";
const REFRESH_TOKEN_KEY = "techtalk-refresh-token";

function storeTokens(result) {
  localStorage.setItem(TOKEN_KEY, result.access_token);
  if (result.refresh_token) localStorage.setItem(REFRESH_TOKEN_KEY, result.refresh_token);
}

export const authService = {
  async register({ name, email, password, role, referral_contact, accept_terms }) {
    const result = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, professional_role: role || null, referral_contact: referral_contact || null, accept_terms }),
    });
    if (!result.access_token) throw new Error("Account was created but could not be signed in.");
    storeTokens(result);
    let user = result.user;
    try {
      user = await this.me();
    } catch (error) {
      if (!String(error.message).includes("HTTP 404")) throw error;
    }
    return { ...result, email, user };
  },

  async login({ email, password }) {
    const body = new URLSearchParams({ username: email, password });
    const response = await fetch(`${import.meta.env.VITE_API_URL || "https://techtalk-backend-shob.onrender.com"}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.detail || "Unable to sign in.");
    storeTokens(data);
    return this.me();
  },

  me() {
    if (!localStorage.getItem(TOKEN_KEY) && neonAuthEnabled) {
      return getNeonSession()
        .then((session) => normalizeNeonUser(session?.user))
        .then(hydrateNeonProfile);
    }
    return apiRequest("/auth/session");
  },

  updateProfile(payload) {
    if (!localStorage.getItem(TOKEN_KEY) && neonAuthEnabled) {
      return neonClient.auth.updateUser({ name: payload.name, image: payload.profile_image }).then((result) => {
        if (result?.error) throw new Error(result.error.message || "Unable to update your profile.");
        return normalizeNeonUser(result?.data?.user || result?.user);
      });
    }
    return apiRequest("/users/me", { method: "PUT", body: JSON.stringify(payload) });
  },

  logout() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      apiRequest("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
      }).catch(() => {});
    }
    if (neonAuthEnabled) neonClient.auth.signOut().catch(() => {});
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasToken() {
    return Boolean(
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem("techtalk-google-pending") === "1"
    );
  },

  loginWithGoogle() {
    return signInWithGoogle();
  },
};

function normalizeNeonUser(user) {
  if (!user) throw new Error("No active Neon Auth session.");
  return { id: user.id, email: user.email, name: user.name || user.email, profile_image: user.image || null };
}

async function hydrateNeonProfile(neonUser) {
  try {
    const session = neonUser || (await getNeonSession());
    const sessionUser = session?.user || session;
    const normalized = normalizeNeonUser(sessionUser);
    const profile = await apiRequest("/auth/session", { useNeonToken: true });
    return { ...normalized, ...profile, name: profile.name || normalized.name, profile_image: profile.profile_image || normalized.profile_image };
  } catch (error) {
    throw new Error(`Signed in, but your member profile could not be created: ${error.message}`);
  }
}
