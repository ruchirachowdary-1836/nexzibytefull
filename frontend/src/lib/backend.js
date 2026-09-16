import { apiRequest } from "./api.js";

export async function checkBackendHealth() {
  try {
    await apiRequest("/health");
    return true;
  } catch {
    return false;
  }
}
