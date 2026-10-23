// Konfigurasi & fungsi bantu yang dipakai website dan halaman admin.
export const WA_NUMBER = "6283857543852"; // format internasional tanpa +
export const CATEGORIES = [
  { id: "coffee", label: "Coffee" },
  { id: "non", label: "Non Coffee" },
  { id: "snack", label: "Snack" },
];

export const $ = (id) => document.getElementById(id);

export const waLink = (text = "") =>
  `https://wa.me/${WA_NUMBER}${text ? "?text=" + encodeURIComponent(text) : ""}`;

export const rupiah = (n) => "Rp" + Number(n || 0).toLocaleString("id-ID");

// Cegah injeksi HTML dari data menu.
export const escapeHtml = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Validasi & rapikan data menu: item yang rusak dibuang, nilai dibatasi.
export function normalizeItems(list) {
  const valid = new Set(CATEGORIES.map((c) => c.id));
  return (Array.isArray(list) ? list : [])
    .filter((i) => i && i.name && valid.has(i.category))
    .map((i, n) => ({
      id: String(i.id || "item" + n),
      name: String(i.name).slice(0, 60),
      category: i.category,
      price: Math.max(0, Number(i.price) || 0),
      description: String(i.description || "").slice(0, 120),
      image: String(i.image || ""),
      available: i.available !== false,
    }));
}

export async function fetchMenu() {
  const res = await fetch("data/menu.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("Gagal memuat menu (HTTP " + res.status + ")");
  return normalizeItems((await res.json()).items);
}
