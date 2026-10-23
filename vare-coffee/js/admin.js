// Editor menu tanpa database: hasilnya diunduh sebagai data/menu.json lalu di-commit ke repo.
import { $, CATEGORIES, escapeHtml, fetchMenu, normalizeItems } from "./config.js";
import { initTheme } from "./theme.js";

const DRAFT_KEY = "vare-admin-draft";
let draft = [];

const say = (t) => { $("msg").textContent = t; };
const toJson = () => JSON.stringify({ items: normalizeItems(draft) }, null, 2) + "\n";

function saveDraft() {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch (e) { /* abaikan */ }
  $("preview").value = toJson();
}

function draw() {
  $("list").innerHTML = draft.map((i, n) => `
    <div class="adm-item" data-n="${n}">
      <input aria-label="Nama" data-k="name" value="${escapeHtml(i.name)}" maxlength="60">
      <input aria-label="Harga" data-k="price" type="number" min="0" step="500" value="${Number(i.price) || 0}">
      <select aria-label="Kategori" data-k="category">${CATEGORIES.map((c) => `<option value="${c.id}"${c.id === i.category ? " selected" : ""}>${c.label}</option>`).join("")}</select>
      <label><input type="checkbox" data-k="available"${i.available !== false ? " checked" : ""}> Ada</label>
      <button class="btn sm ghost" data-del aria-label="Hapus ${escapeHtml(i.name)}">✕</button>
      <input class="full" aria-label="Deskripsi" data-k="description" maxlength="120" placeholder="Deskripsi produk" value="${escapeHtml(i.description)}">
      <input class="full" aria-label="Path foto" data-k="image" placeholder="Foto (opsional), contoh: assets/products/americano.webp" value="${escapeHtml(i.image)}">
    </div>`).join("");
  saveDraft();
}

$("list").addEventListener("input", (e) => {
  const row = e.target.closest(".adm-item");
  const k = e.target.dataset.k;
  if (!row || !k) return;
  const it = draft[+row.dataset.n];
  it[k] = k === "available" ? e.target.checked : k === "price" ? Number(e.target.value) || 0 : e.target.value;
  saveDraft();
});
$("list").addEventListener("click", (e) => {
  const b = e.target.closest("[data-del]");
  if (!b) return;
  draft.splice(+b.closest(".adm-item").dataset.n, 1);
  draw();
});
$("add").addEventListener("click", () => {
  draft.push({ id: "x" + Date.now().toString(36), name: "Menu baru", category: "coffee", price: 10000, description: "", image: "", available: true });
  draw();
  say("Item baru ditambahkan di paling bawah.");
});
$("download").addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([toJson()], { type: "application/json" }));
  a.download = "menu.json";
  a.click();
  URL.revokeObjectURL(a.href);
  say("menu.json terunduh. Timpa data/menu.json di repo, lalu commit dan push.");
});
$("copy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(toJson()); say("JSON tersalin."); }
  catch (e) { $("preview").select(); say("Gagal menyalin otomatis. Teks di pratinjau sudah terpilih, salin manual."); }
});
$("reset").addEventListener("click", async () => {
  try { draft = await fetchMenu(); draw(); say("Dimuat ulang dari data/menu.json."); }
  catch (e) { say(e.message); }
});

async function init() {
  initTheme();
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch (e) { /* draf rusak: abaikan */ }
  if (Array.isArray(stored) && stored.length) { draft = stored; say("Draf terakhir dari browser ini dimuat. Klik \"Muat ulang dari file\" untuk kembali ke menu yang live."); }
  else { try { draft = await fetchMenu(); } catch (e) { say(e.message); } }
  draw();
}
init();
