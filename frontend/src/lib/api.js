const API_URL = import.meta.env.VITE_API_URL || "https://techtalk-backend-shob.onrender.com";
const TOKEN_KEY = "techtalk-token";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || "Unable to complete this request.");
  return data;
}

export const api = {
  getUpcomingEvents: () => apiRequest("/events/upcoming?limit=12"),
  getSummits: () => apiRequest("/summits?status=upcoming"),
  getFounderMeets: () => apiRequest("/founder-meets?public=true"),
  getCategories: () => apiRequest("/categories"),
  subscribeNewsletter: (email) => apiRequest("/newsletter/subscribe", { method: "POST", body: JSON.stringify({ email }) }),
  submitPartnershipInquiry: (payload) => apiRequest("/partnership-inquiries", { method: "POST", body: JSON.stringify(payload) }),
  submitCourseApplication: (payload) => apiRequest("/course-applications", { method: "POST", body: JSON.stringify(payload) }),
  submitPassRequest: (payload) => apiRequest("/pass-requests", { method: "POST", body: JSON.stringify(payload) }),
  myPassRequests: () => apiRequest("/users/me/pass-requests"),
  registerForEvent: (eventType, eventId) => apiRequest("/registrations", { method: "POST", body: JSON.stringify({ event_type: eventType, event_id: eventId }) }),
  createPost: (payload) => apiRequest("/posts", { method: "POST", body: JSON.stringify(payload) }),
  getMyPosts: () => apiRequest("/users/me/posts"),
  updateProfile: (payload) => apiRequest("/users/me", { method: "PUT", body: JSON.stringify(payload) }),
};
