// src/api.js
const DEFAULT_API_URL = "http://localhost:8000";
const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, "");

export async function getPerfumes() {
  const res = await fetch(`${API_URL}/api/perfumes/`);
  if (!res.ok) throw new Error("Failed to fetch perfumes");
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
  const res = await fetch(`${API_URL}/api/perfumes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete perfume");
  return res.json();
}

