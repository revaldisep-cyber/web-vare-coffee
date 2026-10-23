// Titik masuk website: tema, link CTA, animasi, dan menu.
import { $, waLink } from "./config.js";
import { initTheme } from "./theme.js";
import { initMenu } from "./menu.js";

initTheme();

["waHero", "waOrder", "waFab"].forEach((id) => { $(id).href = waLink("Halo Vare, saya mau pesan."); });
$("yr").textContent = new Date().getFullYear();
$("rib").innerHTML = Array(8).fill("<span>Coffee</span><span>Non Coffee</span><span>Snack</span>").join("");

// Muncul halus saat di-scroll.
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".rv").forEach((n) => io.observe(n));

// Cup hero miring mengikuti pointer.
const hero = document.querySelector(".hero");
const cup = $("heroCup");
hero.addEventListener("pointermove", (e) => {
  const r = hero.getBoundingClientRect();
  cup.style.transform = `rotate(${((e.clientX - r.left) / r.width - 0.5) * 14}deg)`;
});
hero.addEventListener("pointerleave", () => { cup.style.transform = ""; });

initMenu();
