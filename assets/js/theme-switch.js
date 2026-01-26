const lightBtn = document.getElementById("light-mode-btn");
const darkBtn = document.getElementById("dark-mode-btn");
const systemBtn = document.getElementById("system-theme-btn");

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(theme) {
  document.body.classList.remove("dark-mode");

  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  } else if (theme === "system") {
    if (mediaQuery.matches) {
      document.body.classList.add("dark-mode")
    }
  }
}

lightBtn.addEventListener("click", () => {
  localStorage.setItem("theme", "light");
  applyTheme("light");
  updateActive();
});

darkBtn.addEventListener("click", () => {
  localStorage.setItem("theme", "dark");
  applyTheme("dark");
  updateActive();
});

systemBtn.addEventListener("click", () => {
  localStorage.setItem("theme", "system");
  applyTheme("system");
  updateActive();
});

mediaQuery.addEventListener("change", () => {
  if (localStorage.getItem("theme") === "system") {
    applyTheme("system");
  }
});

function updateActive() {
  const theme = localStorage.getItem("theme") || "system";

  lightBtn.classList.toggle("active", theme === "light");
  darkBtn.classList.toggle("active", theme === "dark");
  systemBtn.classList.toggle("active", theme === "system");
}

const savedTheme = localStorage.getItem("theme") || "system";
applyTheme(savedTheme);
updateActive();