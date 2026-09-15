import { neonAuthEnabled, neonClient, getNeonSession, getNeonToken, signInWithGoogle } from "./neon.js";

const API_URL = import.meta.env.VITE_API_URL || "https://techtalk-backend-shob.onrender.com";
const TOKEN_KEY = "techtalk-token";
const NEON_TOKEN_KEY = "neon-auth-token";

const getToken = () => localStorage.getItem(TOKEN_KEY);

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || "Request failed.");
  return data;
};

export const authService = {
  async loginWithGoogle() {
    if (!neonAuthEnabled) throw new Error("Google sign-in is not configured.");
    return signInWithGoogle();
  },
  async register({ name, email, password, role, referral_contact, accept_terms }) {
    if (neonAuthEnabled) {
      const result = await neonClient.auth.signUp.email({ name, email, password });
      if (result?.error) throw new Error(result.error.message || "Unable to create your Neon account.");
      await cacheNeonToken();
      return normalizeNeonUser(result?.data?.user || result?.user, name);
    }

    await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, professional_role: role || null, referral_contact: referral_contact || null, accept_terms })
    });
    return this.login({ email, password, name });
  },

  async login({ email, password, name }) {
    if (neonAuthEnabled) {
      const result = await neonClient.auth.signIn.email({ email, password });
      if (result?.error) throw new Error(result.error.message || "Unable to sign in with Neon Auth.");
      await cacheNeonToken();
      return normalizeNeonUser(result?.data?.user || result?.user, name);
    }


    const body = new URLSearchParams({ username: email, password });
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.detail || "Unable to sign in.");
    localStorage.setItem(TOKEN_KEY, data.access_token);
    const user = await this.me();
    return { ...user, name: user.name || name };
  },

  async me() {
    if (neonAuthEnabled) {
      const session = await getNeonSession();
      if (!session?.user) throw new Error("No active Neon Auth session.");
      await cacheNeonToken();
      return normalizeNeonUser(session.user);
    }
    return request("/auth/session", {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
  },

  async updateProfile(payload) {
    if (neonAuthEnabled) {
      const result = await neonClient.auth.updateUser({
        name: payload.name,
        image: payload.profile_image
      });
      if (result?.error) throw new Error(result.error.message || "Unable to update your Neon profile.");
      return normalizeNeonUser(result?.data?.user || result?.user);
    }

    const updatedUser = await request("/users/me", {
      method: "PUT",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(payload)
    });
    if (updatedUser.access_token) {
      localStorage.setItem(TOKEN_KEY, updatedUser.access_token);
      delete updatedUser.access_token;
    }
    return updatedUser;
  },

  logout() {
    if (neonAuthEnabled) neonClient.auth.signOut().catch(() => {});
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(NEON_TOKEN_KEY);
  },

  hasToken() {
    return neonAuthEnabled ? true : Boolean(getToken());
  }
};

async function cacheNeonToken() {
  const token = await getNeonToken();
  if (token) localStorage.setItem(NEON_TOKEN_KEY, token);
}

function normalizeNeonUser(user, fallbackName) {
  if (!user) throw new Error("Neon Auth did not return a user.");
  return {
    id: user.id,
    email: user.email,
    name: user.name || fallbackName || user.email,
    profile_image: user.image || user.avatar_url || null,
    isLoggedIn: true
  };
}
