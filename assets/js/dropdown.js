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