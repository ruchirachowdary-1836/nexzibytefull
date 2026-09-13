import { createClient } from "@neondatabase/neon-js";

const authUrl = import.meta.env.VITE_NEON_AUTH_URL;
const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL;

export const neonAuthEnabled =
  import.meta.env.VITE_AUTH_PROVIDER === "neon" && Boolean(authUrl && dataApiUrl);

export const neonClient = neonAuthEnabled
  ? createClient({
      auth: { url: authUrl },
      dataApi: { url: dataApiUrl }
    })
  : null;

export async function getNeonToken() {
  if (!neonClient) return null;
  return neonClient.auth.getJWTToken?.() || null;
}

export async function getNeonSession() {
  if (!neonClient) return null;
  const result = await neonClient.auth.getSession();
  return result?.data || result || null;
}

export async function queryNeonTable(table, query = {}) {
  if (!neonClient) {
    throw new Error("Neon Data API is not configured for this environment.");
  }
  let request = neonClient.from(table).select(query.columns || "*");
  if (query.orderBy) request = request.order(query.orderBy.column, { ascending: query.orderBy.ascending ?? false });
  if (query.limit) request = request.limit(query.limit);
  const result = await request;
  if (result?.error) throw new Error(result.error.message || `Unable to query Neon table "${table}".`);
  return result?.data || [];
}

export function requireNeonClient() {
  if (!neonClient) {
    throw new Error("Neon Auth is not configured for this environment.");
  }
  return neonClient;
}
