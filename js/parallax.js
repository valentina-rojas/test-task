/* decorative rings drift slightly while scrolling */

(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var rings = [].slice.call(document.querySelectorAll('.ring'));
  var ticking = false;

  function update() {
    rings.forEach(function (ring, i) {
      var box = ring.parentElement.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) return;
      var offset = box.top + box.height / 2 - window.innerHeight / 2;
      ring.style.translate = '0 ' + (-offset * (i % 2 ? 0.06 : 0.1)).toFixed(1) + 'px';
    });
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
