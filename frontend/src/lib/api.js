const API_URL = import.meta.env.VITE_API_URL || "https://techtalk-backend-shob.onrender.com";
import { getNeonToken, neonAuthEnabled } from "./neon.js";

export async function apiRequest(path, options = {}, allowRefresh = true) {
  const { useNeonToken = false, neonSession = null, ...requestOptions } = options;
  const token = (useNeonToken || neonAuthEnabled) ? await getNeonToken(neonSession) : null;
  if (neonAuthEnabled && /^\/users\/me(?:\/|$)/.test(path) && !token) {
    throw new Error("Email verification is required before accessing this account.");
  }
  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: {
      ...(requestOptions.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(requestOptions.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const method = requestOptions.method || "GET";
    throw new Error(data.detail || `HTTP ${response.status} for ${method} ${path}`);
  }
  return data;
}

export const api = {
  getUpcomingEvents: () => apiRequest("/events/upcoming?limit=12"),
  getSummits: () => apiRequest("/summits?status=upcoming"),
  getFounderMeets: () => apiRequest("/founder-meets?public=true"),
  getCategories: () => apiRequest("/categories"),
  getAdminDashboard: () => apiRequest("/admin/dashboard"),
  subscribeNewsletter: (email) => apiRequest("/newsletter/subscribe", { method: "POST", body: JSON.stringify({ email }) }),
  submitPartnershipInquiry: (payload) => apiRequest("/partnership-inquiries", { method: "POST", body: JSON.stringify(payload) }),
  submitCourseApplication: (payload) => apiRequest("/course-applications", { method: "POST", body: JSON.stringify(payload) }),
  submitPassRequest: (payload) => apiRequest("/pass-requests", { method: "POST", body: JSON.stringify(payload) }),
  myPassRequests: () => apiRequest("/users/me/pass-requests"),
  registerForEvent: (eventType, eventId) => apiRequest("/registrations", { method: "POST", body: JSON.stringify({ event_type: eventType, event_id: eventId }) }),
  createPost: (payload) => apiRequest("/posts", { method: "POST", body: JSON.stringify(payload) }),
  getMyPosts: () => apiRequest("/users/me/posts"),
  updateProfile: (payload) => apiRequest("/users/me", { method: "PUT", body: JSON.stringify(payload) }),
  getProfileLinks: () => apiRequest("/profile/links"),
  createProfileLink: (payload) => apiRequest("/profile/links", { method: "POST", body: JSON.stringify(payload) }),
  updateProfileLink: (id, payload) => apiRequest(`/profile/links/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteProfileLink: (id) => apiRequest(`/profile/links/${id}`, { method: "DELETE" }),
};
