const SOLAR_RADIUS = 695700; // in km
const MAX_INPUT_VALUE = 10000;
const overlay = document.getElementById("overlay");

function clearResult() {
  document.getElementById("result").textContent = "";
  document.getElementById("error").textContent = "";
  document.getElementById("star-input").value = "";
}

function formatNumber(num) {
  return num.toLocaleString(navigator.language, { 
    minFractionDigits: 0, 
    maxFractionDigits: 3
  });
}

function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;

  win.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function closeWindow(win) {
  if (!win) return;

  win.classList.add("hidden");
  overlay.classList.add("hidden");
}

function validateNumberInput(inputId,errorId) {
  const input = document.getElementById(inputId).value.trim();
  const numberRegex = /^\d+(\.\d+)?$/;
  const numberValue = Number(input);

  if (!numberRegex.test(input)) {
    document.getElementById(errorId).textContent = "Invalid input. Please enter a valid number.";
    console.error("Invalid input. Please enter a valid number.");
    return null;
  } else if (numberValue <= 0) {
    document.getElementById(errorId).textContent = "Value must be greater than zero.";
    console.error("Value must be greater than zero.");
    return null;
  } else if (numberValue > MAX_INPUT_VALUE) {
    document.getElementById(errorId).textContent = `Input value cannot be more than ${MAX_INPUT_VALUE}.`;
    console.error(`Input value cannot be more than ${MAX_INPUT_VALUE}.`);
    return null;
  }
  document.getElementById(errorId).textContent = "";
  return numberValue;
}

function getStarDiameter() {
  const starRadius = validateNumberInput("star-input","error");
  if (starRadius === null) {
    document.getElementById("result").textContent = "";
    return;
  }

  const diameter = starRadius * SOLAR_RADIUS * 2;
  console.log(`Diameter: ${formatNumber(diameter)} km`);
  document.getElementById("result").textContent = `Diameter: ${formatNumber(diameter)} km`;
}

// keyboard shortcuts, etc
document.addEventListener("keydown", function(event) {
  const key = event.key;
  if (key === "Enter") {
    getStarDiameter()
  } else if (event.ctrlKey && key === "Backspace") {
    clearResult()
  } else if (key === "Escape") {
    document.querySelectorAll(".popup:not(.hidden)").forEach(win => {
      closeWindow(win);
    });
    clearResult()
  }
});

// open/close popup window function
document.querySelectorAll(".view-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const targetId = link.dataset.target;
    const target = document.getElementById(targetId);

    if (target) {
      target.classList.remove("hidden");
      overlay.classList.remove("hidden");
    }
  });
});

document.querySelectorAll(".popup .close-x").forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    closeWindow(button.closest(".popup"));
  });
});

overlay.addEventListener("click", () => {
  document.querySelectorAll(".popup:not(.hidden)").forEach(win => {
    closeWindow(win);
  });
});

// Hamburger button for when viewport is less than 800px wide
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');
const nav = navbar.querySelector('nav');

hamburger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navbar.classList.toggle('menu-open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navbar.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Theme Switching
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

// Dropdowns
(function () {
  const dropdown = document.querySelector("[data-dropdown]");
  const button = dropdown.querySelector(".dropdown__button");
  const list = dropdown.querySelector(".dropdown__list");
  const options = [...dropdown.querySelectorAll(".dropdown__option")];
  const valueEl = dropdown.querySelector(".dropdown__value");
  const hiddenInput = dropdown.querySelector('input[type="hidden"]');

  function openDropdown() {
    dropdown.dataset.open = "true";
    button.setAttribute("aria-expanded", "true");
    list.focus();
  }

  function closeDropdown() {
    dropdown.dataset.open = "false";
    button.setAttribute("aria-expanded", "false");
  }

  function toggleDropdown() {
    const isOpen = dropdown.dataset.open === "true";
    isOpen ? closeDropdown() : openDropdown();
  }

  function setSelected(option) {
    options.forEach(o => o.setAttribute("aria-selected", "false"));
    option.setAttribute("aria-selected", "true");

    valueEl.textContent = option.textContent.trim();

    const val = option.dataset.value ?? option.textContent.trim();
    if (hiddenInput) hiddenInput.value = val;

    closeDropdown();
    button.focus();
  }

  function focusOption(index) {
    options[index]?.focus();
  }

  // Default state
  closeDropdown();
  options.forEach(o => o.setAttribute("aria-selected", "false"));

  button.addEventListener("click", toggleDropdown);

  // Click option
  options.forEach((option) => {
    option.addEventListener("click", () => setSelected(option));
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) closeDropdown();
  });

  // Keyboard handling
  button.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDropdown();
      focusOption(0);
    }
  });

  list.addEventListener("keydown", (e) => {
    const activeIndex = options.indexOf(document.activeElement);

    if (e.key === "Escape") {
      e.preventDefault();
      closeDropdown();
      button.focus();
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusOption(Math.min(activeIndex + 1, options.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      focusOption(Math.max(activeIndex - 1, 0));
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (document.activeElement.classList.contains("dropdown__option")) {
        setSelected(document.activeElement);
      }
    }

    if (e.key === "Tab") {
      closeDropdown();
    }
  });
})();