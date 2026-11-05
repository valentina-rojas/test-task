/* scroll progress bar at the top of the page */

(function () {
  'use strict';

  var bar = document.getElementById('progress');
  var ticking = false;

  function update() {
    if (document.documentElement.classList.contains('menu-open')) { ticking = false; return; }
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
