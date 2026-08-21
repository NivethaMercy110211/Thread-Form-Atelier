/**
 * Thread & Form Atelier — main.js
 * Core site functionality: navigation, scroll effects, animations,
 * service filters, FAQ accordion, fade-in observer
 */

(function () {
  'use strict';

  /* ---- Sticky Header scroll effect ---- */
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile Navigation Drawer ---- */
  function initMobileNav() {
    const toggler = document.querySelector('.navbar-toggler');
    const drawer = document.querySelector('.mobile-nav-drawer');
    if (!toggler || !drawer) return;

    toggler.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      toggler.classList.toggle('open', isOpen);
      toggler.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggler.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!toggler.contains(e.target) && !drawer.contains(e.target)) {
        drawer.classList.remove('open');
        toggler.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---- Active Nav Link ---- */
  function initActiveNav() {
    let currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (!currentPath || currentPath === '/') currentPath = 'index.html';

    const allNavLinks = document.querySelectorAll('.nav-item-link, .mobile-nav-list a');
    allNavLinks.forEach(link => {
      link.classList.remove('active');
    });

    allNavLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkFile = href.split('/').pop().split('?')[0].split('#')[0];

      if (
        linkFile === currentPath ||
        (currentPath === 'index.html' && (linkFile === 'index.html' || linkFile === ''))
      ) {
        link.classList.add('active');
      }
    });
  }

  /* ---- Service Filter ---- */
  function initServiceFilter() {
    const filterBtns = document.querySelectorAll('[data-filter]');
    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        const group = btn.closest('.filter-group');
        if (group) {
          group.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
        }
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        const container = document.querySelector('[data-filter-container]');
        if (!container) return;

        container.querySelectorAll('[data-category]').forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = '';
            item.style.opacity = '0';
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.3s ease';
              item.style.opacity = '1';
            });
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---- FAQ Accordion ---- */
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
      question.addEventListener('click', () => {
        const item = question.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('.faq-icon');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
          openItem.classList.remove('open');
          const a = openItem.querySelector('.faq-answer');
          if (a) { a.style.maxHeight = '0'; a.style.paddingBottom = '0'; }
          const ic = openItem.querySelector('.faq-icon');
          if (ic) ic.style.transform = 'rotate(0deg)';
        });

        // Open clicked (if was closed)
        if (!isOpen) {
          item.classList.add('open');
          if (answer) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.paddingBottom = '1.25rem';
          }
          if (icon) icon.style.transform = 'rotate(45deg)';
        }
      });
    });
  }

  /* ---- Fade-in Intersection Observer ---- */
  /* ---- Intersection Observer for Trendy Scroll Animations ---- */
  function initFadeIn() {
    const els = document.querySelectorAll('.fade-in, .animate-on-scroll');
    if (!els.length) return;

    // Immediately trigger viewport elements to avoid initial load lag
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        el.classList.add('visible');
      }
    });

    if (!window.IntersectionObserver) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    els.forEach(el => observer.observe(el));
  }

  /* ---- Password Toggle (Auth) ---- */
  function initPasswordToggle() {
    document.querySelectorAll('.btn-password-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const wrap = btn.closest('.input-password-wrap');
        if (!wrap) return;
        const input = wrap.querySelector('input');
        if (!input) return;
        const isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = isText ? 'bi bi-eye' : 'bi bi-eye-slash';
        }
        btn.setAttribute('aria-label', isText ? 'Show password' : 'Hide password');
      });
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ---- Before/After Hover Effect ---- */
  function initBeforeAfter() {
    document.querySelectorAll('.before-after-card').forEach(card => {
      const panels = card.querySelectorAll('.before-after-panel img');
      if (panels.length < 2) return;
      card.addEventListener('mouseover', () => {
        panels[1].style.opacity = '1';
      });
      card.addEventListener('mouseout', () => {
        panels[1].style.opacity = '0';
      });
    });
  }

  /* ---- Appointment Form ---- */
  function initAppointmentForm() {
    const form = document.getElementById('appointment-form');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      if (!submitBtn) return;
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      setTimeout(() => {
        submitBtn.textContent = 'Appointment Requested';
        submitBtn.classList.add('btn-ghost');
        const successMsg = form.querySelector('.form-success-msg');
        if (successMsg) successMsg.style.display = 'block';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.classList.remove('btn-ghost');
          if (successMsg) successMsg.style.display = 'none';
          form.reset();
        }, 4000);
      }, 1200);
    });
  }

  /* ---- Auth Form Validation ---- */
  function initAuthForms() {
    const authForms = document.querySelectorAll('.auth-form');
    authForms.forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        if (!btn) return;
        const origText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Please wait...';
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = origText;
        }, 2000);
      });
    });
  }

  /* ---- Back to Top Button ---- */
  function initBackToTop() {
    let btn = document.getElementById('back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'back-to-top';
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', 'Back to top');
      btn.setAttribute('title', 'Back to top');
      btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
      document.body.appendChild(btn);
    }

    function toggleBtnVisibility() {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', toggleBtnVisibility, { passive: true });
    toggleBtnVisibility();

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ---- Init all on DOM ready ---- */
  function init() {
    initStickyHeader();
    initMobileNav();
    initActiveNav();
    initServiceFilter();
    initFAQ();
    initFadeIn();
    initPasswordToggle();
    initSmoothScroll();
    initBeforeAfter();
    initAppointmentForm();
    initAuthForms();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
