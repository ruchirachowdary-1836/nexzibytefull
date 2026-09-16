import { apiRequest } from "./api.js";

const TOKEN_KEY = "techtalk-token";

export const authService = {
  async register({ name, email, password, role, referral_contact, accept_terms }) {
    const result = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, professional_role: role || null, referral_contact: referral_contact || null, accept_terms }),
    });
    return { ...result, email };
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
    localStorage.setItem(TOKEN_KEY, data.access_token);
    return this.me();
  },

  me() {
    return apiRequest("/auth/session");
  },

  updateProfile(payload) {
    return apiRequest("/users/me", { method: "PUT", body: JSON.stringify(payload) });
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  hasToken() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },
};
