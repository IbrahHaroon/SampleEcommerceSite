const DEFAULT_API_URL = "http://localhost:8000";
const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, "");

function authHeader(session) {
  if (!session?.access_token) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

export async function getPerfumes() {
  const res = await fetch(`${API_URL}/api/perfumes/`);
  if (!res.ok) throw new Error("Failed to fetch perfumes");
  return res.json();
}

export async function getPerfume(id) {
  const res = await fetch(`${API_URL}/api/perfumes/${id}`);
  if (!res.ok) throw new Error("Perfume not found");
  return res.json();
}

export async function createCheckoutSession(payload, session = null) {
  const res = await fetch(`${API_URL}/api/checkout/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(session),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create checkout session");
  }
  return res.json();
}

export async function createPerfume(data) {
  const res = await fetch(`${API_URL}/api/perfumes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create perfume");
  return res.json();
}

export async function deletePerfume(id) {
  const res = await fetch(`${API_URL}/api/perfumes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete perfume");
}
