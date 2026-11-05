/* background when scrolled; on small screens it hides on scroll down and returns on scroll up */

(function () {
  'use strict';

  var root = document.documentElement;
  var header = document.querySelector('.header');
  var small = window.matchMedia('(max-width: 1024px)');
  var lastY = window.scrollY;

  function update() {
    if (root.classList.contains('menu-open')) return;

    var y = window.scrollY;
    var delta = y - lastY;
    header.classList.toggle('scrolled', y > 10);

    if (!small.matches || y < 120) header.classList.remove('hide');
    else if (delta > 8) header.classList.add('hide');
    else if (delta < -8) header.classList.remove('hide');

    if (Math.abs(delta) > 8 || y < 120) lastY = y;
  }

  window.addEventListener('scroll', update, { passive: true });
  header.addEventListener('focusin', function () { header.classList.remove('hide'); });
  small.addEventListener('change', function () { header.classList.remove('hide'); });
  update();
})();
