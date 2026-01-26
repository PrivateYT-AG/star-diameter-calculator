const lightBtn = document.getElementById("light-mode-btn");
const darkBtn = document.getElementById("dark-mode-btn");

lightBtn.addEventListener("click", () => {
  document.body.classList.remove("dark-mode");
  localStorage.setItem("theme", "light");
});

darkBtn.addEventListener("click", () => {
  document.body.classList.add("dark-mode");
  localStorage.setItem("theme", "dark");
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.classList.add("dark-mode");
}