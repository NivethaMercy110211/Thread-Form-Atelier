/**
 * Thread & Form Atelier — theme.js
 * Dark/Light mode toggle with localStorage persistence
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'tfa-theme';
  const DARK_CLASS = 'dark';
  const DATA_ATTR = 'data-theme';

  // Apply theme before paint to avoid flash
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute(DATA_ATTR, 'dark');
  }

  function getTheme() {
    return document.documentElement.getAttribute(DATA_ATTR) || 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute(DATA_ATTR, theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateThemeButtons(theme);
  }

  function toggleTheme() {
    const current = getTheme();
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  function updateThemeButtons(theme) {
    const btns = document.querySelectorAll('[data-theme-toggle]');
    btns.forEach(btn => {
      const icon = btn.querySelector('.theme-icon');
      const label = btn.querySelector('.theme-label');
      if (icon) {
        icon.className = 'theme-icon ' + (theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon');
      }
      if (label) {
        label.textContent = theme === 'dark' ? 'Light' : 'Dark';
      }
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  }

  function initThemeToggles() {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
    updateThemeButtons(getTheme());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggles);
  } else {
    initThemeToggles();
  }

  // Expose globally for inline usage
  window.TFA = window.TFA || {};
  window.TFA.toggleTheme = toggleTheme;
  window.TFA.getTheme = getTheme;
  window.TFA.setTheme = setTheme;
})();
