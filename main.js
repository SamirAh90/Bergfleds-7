const header = document.querySelector("header");
if (header && !document.querySelector(".topbar")) {
  header.insertAdjacentHTML(
    "beforebegin",
    '<div class="topbar"><div class="container"><span>Din inköpskanal i Ludvika · Gatubacken 9</span><a href="butiken.html">Öppettider: Mån–tors 07–16, fre 07–13</a></div></div>',
  );
}
const menu = document.querySelector("#menu"),
  nav = document.querySelector(".nav nav");
if (menu && nav) {
  menu.setAttribute("aria-expanded", "false");
  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Stäng meny" : "Öppna meny");
    menu.textContent = open ? "×" : "☰";
  });
  nav.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.textContent = "☰";
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Öppna meny");
  });
}
const file = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav nav a").forEach((a) => {
  if ((a.getAttribute("href") || "").split("?")[0] === file) {
    a.classList.add("active");
    a.setAttribute("aria-current", "page");
  }
});
document
  .querySelectorAll("[data-year]")
  .forEach((el) => (el.textContent = new Date().getFullYear()));
function updateOpeningStatus() {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type)?.value || "";
  const day = get("weekday").replace(".", "").toLowerCase(),
    time = Number(get("hour")) + Number(get("minute")) / 60,
    closes = { mån: 16, tis: 16, ons: 16, tor: 16, fre: 13 }[day],
    open = closes !== undefined && time >= 7 && time < closes;
  let text = open
    ? `Öppet nu till ${String(closes).padStart(2, "0")}:00`
    : closes !== undefined && time < 7
      ? "Stängt · öppnar 07:00"
      : ["mån", "tis", "ons", "tor"].includes(day)
        ? "Stängt · öppnar imorgon 07:00"
        : "Stängt · öppnar måndag 07:00";
  document.querySelectorAll("[data-opening-status]").forEach((el) => {
    el.classList.toggle("is-open", open);
    el.classList.toggle("is-closed", !open);
    const target = el.querySelector(".status-text");
    if (target) target.textContent = text;
  });
}
updateOpeningStatus();
setInterval(updateOpeningStatus, 60000);
const category = new URLSearchParams(location.search).get("kategori"),
  description = document.querySelector('[name="description"]');
if (category && description) description.value = "Förfrågan: " + category;
const companies = [
  ["Milwaukee", "assets/suppliers/milwaukee.png"],
  ["HiKOKI", "assets/suppliers/hikoki.svg"],
  ["Bosch Professional", "assets/suppliers/bosch.svg"],
  ["Kemppi", "assets/suppliers/kemppi.svg"],
  ["Kärcher", "assets/suppliers/karcher.svg"],
  ["Guide", "assets/suppliers/guide.svg"],
  ["Arbesko", "assets/suppliers/arbesko.svg"],
  ["Metabo", "assets/suppliers/metabo.png"],
  ["Loctite", "assets/suppliers/loctite.svg"],
  ["Fiskars", "assets/suppliers/fiskars.png"],
  ["SKF", "assets/suppliers/skf.svg"],
  ["Hultafors", "assets/suppliers/hultafors.svg"],
  ["Cederroth", "assets/suppliers/cederroth.svg"],
  ["Luna", "assets/suppliers/luna.png"],
  ["Hitachi Energy", "assets/logos/hitachi-energy.png"],
  ["Nordic Iron", "assets/logos/nordic-iron.svg"],
  ["Log Max", "assets/logos/logmax.png"],
  ["Spendrups", "assets/logos/spendrups.jpg"],
  ["ABB"],
  ["Rusta"],
  ["JYSK"],
  ["Dala Takentreprenader", "assets/logos/dalatak.png", "http://dalatak.se/"],
  ["ESBE"],
  ["Ahlsell"],
  ["Wavin"],
  [
    "Elbolaget Montage AB",
    "assets/logos/elbolaget.png",
    "https://elbolaget.se/",
  ],
  [
    "Byggbolaget i Bergslagen AB",
    "assets/logos/byggbolaget.png",
    "https://bygg-bolaget.se/",
  ],
  [
    "Trio Perfekta",
    "assets/logos/trio-perfekta.png",
    "https://www.trio-perfekta.se/",
  ],
  ["LG IT AB", "assets/logos/lgit.png", "https://lgit.se/kontakt/"],
  ["DALACC", "assets/logos/dalacc.png", "https://www.dalacc.se/"],
  ["AKETEK", "assets/logos/aketek.webp", "https://www.aketek.com/sv-se/"],
];
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
function logo(name, file, hidden = false) {
  const el = document.createElement("span");
  if (file) {
    const img = document.createElement("img");
    img.src = file;
    img.alt = hidden ? "" : name;
    img.loading = "lazy";
    el.append(img);
  } else {
    el.className = "company-wordmark company-" + slug(name);
    el.textContent = name;
  }
  return el;
}
const track = document.querySelector(".supplier-track");
if (track) {
  const set = (hidden) => {
    const group = document.createElement("div");
    group.className = "supplier-set";
    if (hidden) group.setAttribute("aria-hidden", "true");
    companies.forEach(([name, file, url]) => {
      const item = document.createElement(url ? "a" : "span");
      item.className = "supplier-logo";
      if (url) {
        item.href = url;
        item.target = "_blank";
        item.rel = "noreferrer";
      }
      item.append(logo(name, file, hidden));
      group.append(item);
    });
    return group;
  };
  track.append(set(false), set(true));
}
const directory = document.querySelector(".supplier-directory");
if (directory) {
  companies.forEach(([name, file, url]) => {
    const card = document.createElement(url ? "a" : "article");
    card.className = "supplier-directory-card";
    if (url) {
      card.href = url;
      card.target = "_blank";
      card.rel = "noreferrer";
    }
    const visual = document.createElement("div");
    visual.className = "directory-logo";
    visual.append(logo(name, file));
    const h = document.createElement("h3");
    h.textContent = name;
    const p = document.createElement("p");
    p.textContent = "Leverantör och varumärke i Bergfelds nätverk.";
    card.append(visual, h, p);
    directory.append(card);
  });
}
document.querySelectorAll(".form").forEach((form) =>
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form),
      name = String(data.get("name") || "").trim(),
      company = String(data.get("company") || "").trim(),
      desc = String(data.get("description") || "").trim(),
      email = String(data.get("email") || "").trim(),
      phone = String(data.get("phone") || "").trim(),
      legacy = String(data.get("contact") || "").trim(),
      contact = email || phone || legacy,
      output = form.querySelector("output");
    if (!name || !company || !desc || !contact) {
      if (output)
        output.textContent =
          "Fyll i namn, företag, kontaktuppgift och vad du söker.";
      return;
    }
    const body = `Förfrågan: ${desc}\n\nNamn: ${name}\nFöretag: ${company}\nKontakt: ${contact}\nOmråde: ${data.get("category") || "Ej valt"}`;
    if (output) {
      output.textContent = "Tack! Ditt e-postprogram öppnas nu.";
      output.className = "success";
    }
    location.href =
      "mailto:order@bergfelds.se?subject=" +
      encodeURIComponent("Produktförfrågan till Bergfelds") +
      "&body=" +
      encodeURIComponent(body);
  }),
);
