const root = document.documentElement;
const theme = document.querySelector(".theme-toggle");
const themeIcon = theme.querySelector(".theme-icon");
const menu = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const language = document.querySelector(".language-switch");

function displayTheme() {
  const dark = root.dataset.theme === "dark";
  theme.setAttribute("aria-pressed", String(dark));
  themeIcon.textContent = dark ? "☼" : "☾";
}

displayTheme();
theme.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  displayTheme();
  try {
    localStorage.setItem("portfolio-theme", root.dataset.theme);
  } catch {
    // A storage restriction should not prevent switching themes.
  }
});

function setMenu(open) {
  menu.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("is-open", open);
}

menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  setMenu(open);
  if (open) navigation.querySelector("a").focus();
});
navigation.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link || menu.getAttribute("aria-expanded") !== "true") return;

  const destination = document.getElementById(link.hash.slice(1));
  setMenu(false);
  if (destination) {
    destination.tabIndex = -1;
    destination.focus({ preventScroll: true });
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || menu.getAttribute("aria-expanded") !== "true") return;
  setMenu(false);
  menu.focus();
});
matchMedia("(min-width: 961px)").addEventListener("change", () => setMenu(false));

const alternatePage = language.getAttribute("href");
function updateLanguageLink() {
  language.setAttribute("href", alternatePage + window.location.hash);
}

updateLanguageLink();
window.addEventListener("hashchange", updateLanguageLink);
