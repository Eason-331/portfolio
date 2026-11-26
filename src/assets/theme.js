(() => {
  const root = document.documentElement;
  root.classList.remove("no-js");
  try {
    if (localStorage.getItem("portfolio-theme") === "light") root.dataset.theme = "light";
  } catch {
    // Use the default theme when browser storage is unavailable.
  }
})();
