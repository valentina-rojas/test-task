/* countdown to a fixed date, stops at zero */

(function () {
  'use strict';

  var box = document.querySelector('.countdown');
  var deadline = new Date(box.getAttribute('data-deadline')).getTime();
  var timer;

  var els = {
    d: document.getElementById('cd-d'),
    h: document.getElementById('cd-h'),
    m: document.getElementById('cd-m'),
    s: document.getElementById('cd-s')
  };

  function pad(n) { return String(n).padStart(2, '0'); }

  function setNum(el, value) {
    if (el.textContent === value) return;
    el.textContent = value;
    el.classList.remove('tick');
    void el.offsetWidth; 
    el.classList.add('tick');
  }

  function tick() {
    var left = Math.max(deadline - Date.now(), 0);
    var total = Math.ceil(left / 1000);

    setNum(els.d, pad(Math.floor(total / 86400)));
    setNum(els.h, pad(Math.floor((total % 86400) / 3600)));
    setNum(els.m, pad(Math.floor((total % 3600) / 60)));
    setNum(els.s, pad(total % 60));

    if (left === 0) clearInterval(timer);
  }

  tick();
  timer = setInterval(tick, 1000);
})();
