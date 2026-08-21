/**
 * Thread & Form Atelier — rtl.js
 * RTL/LTR toggle with localStorage persistence
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'tfa-dir';

  // Apply direction before paint
  const savedDir = localStorage.getItem(STORAGE_KEY);
  if (savedDir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
  }

  function getDir() {
    return document.documentElement.getAttribute('dir') || 'ltr';
  }

  function setDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    if (dir === 'rtl') {
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('lang', 'en');
    }
    localStorage.setItem(STORAGE_KEY, dir);
    updateDirButtons(dir);
  }

  function toggleDir() {
    const current = getDir();
    setDir(current === 'rtl' ? 'ltr' : 'rtl');
  }

  function updateDirButtons(dir) {
    const btns = document.querySelectorAll('[data-dir-toggle]');
    btns.forEach(btn => {
      const label = btn.querySelector('.dir-label');
      if (label) {
        label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
      btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
    });
  }

  function initDirToggles() {
    document.querySelectorAll('[data-dir-toggle]').forEach(btn => {
      btn.addEventListener('click', toggleDir);
    });
    updateDirButtons(getDir());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDirToggles);
  } else {
    initDirToggles();
  }

  window.TFA = window.TFA || {};
  window.TFA.toggleDir = toggleDir;
  window.TFA.getDir = getDir;
  window.TFA.setDir = setDir;
})();
