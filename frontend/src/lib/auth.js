const API_URL = import.meta.env.VITE_API_URL || "https://techtalk-backend-shob.onrender.com";
const TOKEN_KEY = "techtalk-token";

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
  async register({ name, email, password, role }) {
    const user = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, professional_role: role || null })
    });
    return this.login({ email, password, name });
  },
  async login({ email, password, name }) {
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
    return request("/users/me", { headers: { Authorization: `Bearer ${getToken()}` } });
  },
  async updateProfile(payload) {
    return request("/users/me", {
      method: "PUT",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(payload)
    });
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },
  hasToken() {
    return Boolean(getToken());
  }
};
