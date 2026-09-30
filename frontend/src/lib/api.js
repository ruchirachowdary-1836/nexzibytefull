const API_URL = import.meta.env.VITE_API_URL || "https://techtalk-backendd.onrender.com";
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
    if (
      response.status === 401 &&
      /visitor pass session has expired/i.test(data.detail || "")
    ) {
      window.dispatchEvent(new Event("visitor-session-expired"));
    }
    throw new Error(data.detail || `HTTP ${response.status} for ${method} ${path}`);
  }
  return data;
}

export async function waitForRegistrationEmail(kind, id, { attempts = 10, delayMs = 300 } = {}) {
  let current = null;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const passes = await apiRequest("/users/me/passes");
    current = passes.find((pass) => pass.kind === kind && pass.id === id) || current;
    if (current && ["sent", "failed", "not_eligible"].includes(current.email_delivery_status)) {
      return current;
    }
    if (attempt + 1 < attempts) {
      await new Promise((resolve) => window.setTimeout(resolve, delayMs));
    }
  }
  return current;
}

export const api = {
  getUpcomingEvents: () => apiRequest("/events/upcoming?limit=12"),
  getSummits: () => apiRequest("/summits?status=upcoming"),
  getFounderMeets: () => apiRequest("/founder-meets?public=true"),
  getCategories: () => apiRequest("/categories"),
  getAdminDashboard: () => apiRequest("/admin/dashboard"),
  getStaffDashboard: () => apiRequest("/staff/dashboard"),
  getAdminRegistrations: (filters = {}) => {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value !== "" && value != null),
    );
    return apiRequest(`/admin/registrations${params.size ? `?${params}` : ""}`);
  },
  getAdminRegistration: (id) => apiRequest(`/admin/registrations/${id}`),
  resendAdminRegistrationEmail: (id) => apiRequest(`/admin/registrations/${id}/resend-email`, { method: "POST" }),
  submitPartnershipInquiry: (payload) => apiRequest("/partnership-inquiries", { method: "POST", body: JSON.stringify(payload) }),
  submitContactInquiry: (payload) => apiRequest("/contact-inquiries", { method: "POST", body: JSON.stringify(payload) }),
  subscribeNewsletter: (email) => apiRequest("/newsletter/subscribe", { method: "POST", body: JSON.stringify({ email }) }),
  submitCourseApplication: (payload) => apiRequest("/course-applications", { method: "POST", body: JSON.stringify(payload) }),
  getContentCatalog: (catalog) => apiRequest(`/content/${encodeURIComponent(catalog)}`),
  submitPassRequest: (payload) => apiRequest("/pass-requests", { method: "POST", body: JSON.stringify(payload) }),
  myPassRequests: () => apiRequest("/users/me/pass-requests"),
  myPasses: () => apiRequest("/users/me/passes"),
  activateVisitorPass: (id) => apiRequest(`/users/me/pass-requests/${id}/activate-visitor`, { method: "POST" }),
  waitForRegistrationEmail,
  resendRegistrationEmail: (kind, id) => apiRequest(`/users/me/registrations/${encodeURIComponent(kind)}/${id}/resend`, { method: "POST" }),
  registerForEvent: (eventType, eventId, phone) => apiRequest("/registrations", { method: "POST", body: JSON.stringify({ event_type: eventType, event_id: eventId, phone }) }),
  createPost: (payload) => apiRequest("/posts", { method: "POST", body: JSON.stringify(payload) }),
  getMyPosts: () => apiRequest("/users/me/posts"),
  updateProfile: (payload) => apiRequest("/users/me", { method: "PUT", body: JSON.stringify(payload) }),
  getProfileLinks: () => apiRequest("/profile/links"),
  createProfileLink: (payload) => apiRequest("/profile/links", { method: "POST", body: JSON.stringify(payload) }),
  updateProfileLink: (id, payload) => apiRequest(`/profile/links/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteProfileLink: (id) => apiRequest(`/profile/links/${id}`, { method: "DELETE" }),
};
