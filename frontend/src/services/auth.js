// Mock authentication — UI-only. Replace with real auth API calls later.
import { SHOPS } from "./api";

const KEY = "leftoverlab_user";

export const USERS = [
  { email: "mess@leftoverlab.edu", password: "mess123", role: "mess", name: "Mess Incharge" },
  { email: "admin@leftoverlab.edu", password: "admin123", role: "admin", name: "Campus Admin" },
  ...SHOPS.map((s) => ({
    email: `${s.id}@leftoverlab.edu`,
    password: "shop123",
    role: "shop",
    shopId: s.id,
    name: `${s.name} Owner`,
  })),
];

export function login(email, password, role, shopId) {
  const u = USERS.find(
    (x) =>
      x.email.toLowerCase() === email.trim().toLowerCase() &&
      x.password === password &&
      x.role === role &&
      (role !== "shop" || x.shopId === shopId)
  );
  if (!u) return null;
  const { password: _pw, ...pub } = u;
  localStorage.setItem(KEY, JSON.stringify(pub));
  return pub;
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function getUser() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
