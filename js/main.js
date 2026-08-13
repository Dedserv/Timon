/* Тимон ищет дом — лёгкий vanilla JS: появление блоков + лайтбокс */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Появление блоков при скролле ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (!prefersReduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          if (delay) {
            el.style.transitionDelay = (delay * 120) + 'ms';
          }
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Лайтбокс галереи ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-grid .g-item img'));
  var lightbox = document.querySelector('.lightbox');
  var lbImg = lightbox.querySelector('.lb-figure img');
  var lbCaption = lightbox.querySelector('.lb-figure figcaption');
  var lbClose = lightbox.querySelector('.lb-close');
  var lbPrev = lightbox.querySelector('.lb-prev');
  var lbNext = lightbox.querySelector('.lb-next');
  var current = 0;
  var lastFocus = null;

  function open(index) {
    current = (index + items.length) % items.length;
    var img = items[current];
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    lbCaption.textContent = img.closest('figure').querySelector('figcaption')
      ? img.closest('figure').querySelector('figcaption').textContent
      : img.alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lastFocus = document.activeElement;
    lbClose.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    lbImg.src = '';
    if (lastFocus) { lastFocus.focus(); }
  }

  items.forEach(function (img, i) {
    img.addEventListener('click', function () { open(i); });
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', function (e) { e.stopPropagation(); open(current - 1); });
  lbNext.addEventListener('click', function (e) { e.stopPropagation(); open(current + 1); });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) { close(); }
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) { return; }
    if (e.key === 'Escape') { close(); }
    if (e.key === 'ArrowLeft') { open(current - 1); }
    if (e.key === 'ArrowRight') { open(current + 1); }
  });
})();
