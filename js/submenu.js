/* accordion toggle inside the mobile panel */

(function () {
  'use strict';

  var toggles = document.querySelectorAll('.sub-toggle');

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.has-sub');
      var open = !item.classList.contains('open');
      item.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
})();
