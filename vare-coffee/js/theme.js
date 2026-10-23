// Mode terang/gelap: ikut pengaturan perangkat, lalu ingat pilihan pengunjung.
import { $ } from "./config.js";

const KEY = "vare-theme";
const root = document.documentElement;

function apply(theme) {
  root.setAttribute("data-theme", theme);
  $("theme")?.setAttribute("aria-pressed", String(theme === "dark"));
  try { localStorage.setItem(KEY, theme); } catch (e) { /* storage dimatikan: abaikan */ }
}

export function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* abaikan */ }
  apply(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  $("theme")?.addEventListener("click", () => apply(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));
}
