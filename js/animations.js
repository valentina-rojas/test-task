/* scroll reveal and count-up numbers (loads after faq.js) */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function format(n, el) {
    var s = String(n);
    return el.getAttribute('data-fmt') === 'dot' ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : s;
  }

  function countUp(el) {
    var to = parseInt(el.getAttribute('data-count'), 10);
    if (reduceMotion) { el.textContent = format(to, el); return; }

    var start = null;
    var duration = 1500;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / duration, 1);
      el.textContent = format(Math.round(to * (1 - Math.pow(1 - p, 3))), el);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function show(el) {
    el.classList.add('in');
    el.querySelectorAll('[data-count]').forEach(countUp);
  }

  if (!reduceMotion) {
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = '0'; });
  }

  document.querySelectorAll('.faq-item').forEach(function (item, i) {
    item.setAttribute('data-reveal', '');
    item.style.setProperty('--d', (i % 4) * 0.06 + 's');
  });

  var targets = document.querySelectorAll('[data-reveal]');

  if (!('IntersectionObserver' in window)) {
    targets.forEach(show);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      show(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  targets.forEach(function (el) { observer.observe(el); });
})();
