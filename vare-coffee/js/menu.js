// Tampilan menu: tab kategori + carousel geser kiri/kanan.
import { $, CATEGORIES, escapeHtml, fetchMenu, rupiah, waLink } from "./config.js";

const PLACEHOLDER =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14l-1.5 12a2 2 0 0 1-2 1.7h-7a2 2 0 0 1-2-1.7L5 7z"/><path d="M4 7h16M9 3.5h6l.5 3.5"/></svg><span>Foto produk</span>';

let items = [];
let active = CATEGORIES[0].id;

function renderTabs() {
  $("tabs").innerHTML = CATEGORIES.map(
    (c) => `<button class="tab" role="tab" aria-selected="${c.id === active}" data-c="${c.id}">${c.label}</button>`
  ).join("");
}

function cardHtml(i) {
  const thumb = i.image
    ? `<div class="thumb"><img src="${escapeHtml(i.image)}" alt="${escapeHtml(i.name)}" loading="lazy"></div>`
    : `<div class="thumb ph">${PLACEHOLDER}</div>`;
  const action = i.available
    ? `<a class="btn sm" target="_blank" rel="noopener" href="${waLink(`Halo Vare, saya mau pesan ${i.name} (${rupiah(i.price)})`)}">Pesan</a>`
    : '<span class="btn sm ghost" style="width:100%;margin-top:8px;opacity:.6">Habis</span>';
  return `<article class="card rv in${i.available ? "" : " sold"}">${thumb}<h3>${escapeHtml(i.name)}</h3><p>${escapeHtml(i.description)}</p><span class="price">${rupiah(i.price)}</span>${action}</article>`;
}

function renderGrid() {
  const list = items.filter((i) => i.category === active);
  $("grid").innerHTML = list.length ? list.map(cardHtml).join("") : '<p class="empty">Belum ada menu di kategori ini.</p>';
  // Jika foto gagal dimuat, kembali ke kotak "Foto produk".
  $("grid").querySelectorAll(".thumb img").forEach((img) =>
    img.addEventListener("error", () => {
      const t = img.closest(".thumb");
      t.classList.add("ph");
      t.innerHTML = PLACEHOLDER;
    })
  );
}

function syncArrows() {
  const g = $("grid");
  $("prev").disabled = g.scrollLeft < 4;
  $("next").disabled = g.scrollLeft + g.clientWidth >= g.scrollWidth - 4;
}

function bindEvents() {
  $("tabs").addEventListener("click", (e) => {
    const b = e.target.closest(".tab");
    if (!b) return;
    active = b.dataset.c;
    renderTabs();
    renderGrid();
    $("grid").scrollTo({ left: 0 });
    syncArrows();
  });
  const go = (d) => $("grid").scrollBy({ left: d * Math.max(220, $("grid").clientWidth * 0.8), behavior: "smooth" });
  $("prev").addEventListener("click", () => go(-1));
  $("next").addEventListener("click", () => go(1));
  $("grid").addEventListener("scroll", syncArrows, { passive: true });
  addEventListener("resize", syncArrows);
  new MutationObserver(syncArrows).observe($("grid"), { childList: true });
}

export async function initMenu() {
  renderTabs();
  bindEvents();
  try {
    items = await fetchMenu();
    renderGrid();
  } catch (err) {
    console.error(err);
    $("grid").innerHTML = '<p class="empty">Menu belum bisa dimuat. Coba muat ulang halaman.</p>';
  }
  syncArrows();
}
