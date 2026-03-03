const SOLAR_RADIUS = 695700; // in km
const MAX_INPUT_VALUE = 10000;
const overlay = document.getElementById('overlay');

function clearResult() {
  document.getElementById('result').textContent = '';
  document.getElementById('error').textContent = '';
  document.getElementById('star-input').value = '';
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

  win.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

function closeWindow(win) {
  if (!win) return;

  win.classList.add('hidden');
  overlay.classList.add('hidden');
}

function validateNumberInput(inputId,errorId) {
  const input = document.getElementById(inputId).value.trim();
  const numberRegex = /^\d+(\.\d+)?$/;
  const numberValue = Number(input);

  if (!numberRegex.test(input)) {
    document.getElementById(errorId).textContent = 'Invalid input. Please enter a valid number.';
    console.error('Invalid input. Please enter a valid number.');
    return null;
  } else if (numberValue <= 0) {
    document.getElementById(errorId).textContent = 'Value must be greater than zero.';
    console.error('Value must be greater than zero.');
    return null;
  } else if (numberValue > MAX_INPUT_VALUE) {
    document.getElementById(errorId).textContent = `Input value cannot be more than ${MAX_INPUT_VALUE}.`;
    console.error(`Input value cannot be more than ${MAX_INPUT_VALUE}.`);
    return null;
  }
  document.getElementById(errorId).textContent = '';
  return numberValue;
}

function getStarDiameter() {
  const starRadius = validateNumberInput('star-input','error');
  if (starRadius === null) {
    document.getElementById('result').textContent = '';
    return;
  }

  const diameter = starRadius * SOLAR_RADIUS * 2;
  console.log(`Diameter: ${formatNumber(diameter)} km`);
  document.getElementById('result').textContent = `Diameter: ${formatNumber(diameter)} km`;
}

// keyboard shortcuts, etc
document.addEventListener('keydown', function(event) {
  const key = event.key;
  if (key === 'Enter') {
    getStarDiameter()
  } else if (event.ctrlKey && key === 'Backspace') {
    clearResult()
  } else if (key === 'Escape') {
    document.querySelectorAll('.popup:not(.hidden)').forEach(win => {
      closeWindow(win);
    });
    clearResult()
  }
});

// open/close popup window function
document.querySelectorAll('.calculator-button').forEach(button => {
  button.addEventListener('click', e => {
    const button = e.target;

    if (button.id === 'calculate') {
      getStarDiameter();
    } else if (button.id === 'clear') {
      clearResult();
    }
  });
});

document.querySelectorAll('.view-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const targetId = link.dataset.target;
    const target = document.getElementById(targetId);

    if (target) {
      target.classList.remove('hidden');
      overlay.classList.remove('hidden');
    }
  });
});

document.querySelectorAll('.popup .close-x').forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();
    closeWindow(button.closest('.popup'));
  });
});

overlay.addEventListener('click', () => {
  document.querySelectorAll('.popup:not(.hidden)').forEach(win => {
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
const lightBtn = document.getElementById('light-mode-btn');
const darkBtn = document.getElementById('dark-mode-btn');
const systemBtn = document.getElementById('system-theme-btn');

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(theme) {
  document.body.classList.remove('dark-mode');

  if (theme ==='dark') {
    document.body.classList.add('dark-mode');
  } else if (theme === 'system') {
    if (mediaQuery.matches) {
      document.body.classList.add('dark-mode')
    }
  }
}

lightBtn.addEventListener('click', () => {
  localStorage.setItem('theme', 'light');
  applyTheme('light');
  updateActive();
});

darkBtn.addEventListener('click', () => {
  localStorage.setItem('theme', 'dark');
  applyTheme('dark');
  updateActive();
});

systemBtn.addEventListener('click', () => {
  localStorage.setItem('theme', 'system');
  applyTheme('system');
  updateActive();
});

mediaQuery.addEventListener('change', () => {
  if (localStorage.getItem('theme') === 'system') {
    applyTheme('system');
  }
});

function updateActive() {
  const theme = localStorage.getItem('theme') || 'system';

  lightBtn.classList.toggle('active', theme === 'light');
  darkBtn.classList.toggle('active', theme === 'dark');
  systemBtn.classList.toggle('active', theme === 'system');
}

const savedTheme = localStorage.getItem('theme') || 'system';
applyTheme(savedTheme);
updateActive();