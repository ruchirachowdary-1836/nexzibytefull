const backendUrl = import.meta.env.VITE_API_URL || 'https://techtalk-backend-shob.onrender.com';

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${backendUrl}/health`, { headers: { Accept: 'application/json' } });
    return response.ok;
  } catch {
    return false;
  }
}
