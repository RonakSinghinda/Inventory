export const API_URL = "http://localhost:4000";

/**
 * Standard fetch wrapper that automatically appends the user's JWT from localStorage
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("inv_auth_token");
  
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If the server returns 401, the token might be expired.
  if (response.status === 401) {
    try {
      localStorage.removeItem("inv_auth_token");
      localStorage.removeItem("inv_auth_email");
      localStorage.removeItem("inv_auth_user");
    } catch {}
    // We could dispatch a custom event here, or rely on AppContext reloading
  }

  return response;
}
