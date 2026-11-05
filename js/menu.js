/* burger menu: drawer, focus trap, inert background, scroll lock, drag to close, back button */

(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var backdrop = document.getElementById('backdrop');
  var background = [].slice.call(document.querySelectorAll('main, footer, .logo, .skip'));

  var isOpen = false;
  var pushed = false;
  var pending = null;
  var savedY = 0;
  var animTimer;

  /* scroll lock  */
  function lockScroll() {
    savedY = window.scrollY;
    root.style.setProperty('--sbw', (window.innerWidth - root.clientWidth) + 'px');
    body.style.top = -savedY + 'px';
    root.classList.add('menu-open');
  }

  function unlockScroll() {
    root.classList.remove('menu-open');
    body.style.top = '';
    root.style.removeProperty('--sbw');
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, savedY);
    root.style.scrollBehavior = '';
  }

  /* ---- helpers ---- */
  function setBackground(hidden) {
    background.forEach(function (el) {
      if (hidden) el.setAttribute('inert', '');
      else el.removeAttribute('inert');
    });
  }

  function animate() {
    nav.classList.add('animating');
    clearTimeout(animTimer);
    animTimer = setTimeout(function () { nav.classList.remove('animating'); }, 600);
  }

  function setState(open) {
    isOpen = open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('open', open);
    backdrop.classList.toggle('show', open);
    if (open) {
      nav.setAttribute('role', 'dialog');
      nav.setAttribute('aria-modal', 'true');
    } else {
      nav.removeAttribute('role');
      nav.removeAttribute('aria-modal');
    }
    setBackground(open);
    animate();
  }

  function flush() {
    if (!pending) return;
    var fn = pending;
    pending = null;
    fn();
  }

  /* ---- open / close ---- */
  function open() {
    if (isOpen) return;
    lockScroll();
    setState(true);
    try { history.pushState({ menu: true }, ''); pushed = true; } catch (e) { pushed = false; }
    setTimeout(function () {
      var first = nav.querySelector('a');
      if (first && isOpen) first.focus({ preventScroll: true });
    }, 300);
  }

  function close(restoreFocus, then) {
    if (!isOpen) { if (then) then(); return; }
    setState(false);
    unlockScroll();
    if (restoreFocus) burger.focus({ preventScroll: true });

    if (pushed) {
      pushed = false;
      pending = then || null;
      history.back();
      setTimeout(flush, 350); // fallback if popstate never fires
    } else if (then) {
      then();
    }
  }

  function go(href) {
    if (href.charAt(0) === '#') {
      var target = href.length > 1 && document.getElementById(href.slice(1));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = href;
    }
  }

  /* ---- events ---- */
  burger.addEventListener('click', function () { if (isOpen) close(true); else open(); });
  backdrop.addEventListener('click', function () { close(true); });

  nav.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    e.preventDefault();
    var href = link.getAttribute('href') || '';
    close(false, function () { go(href); });
  });

  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { close(true); return; }
    if (e.key !== 'Tab') return;

    var items = [burger].concat([].slice.call(nav.querySelectorAll('a, button')).filter(function (el) {
      return getComputedStyle(el).visibility !== 'hidden';
    }));
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  window.addEventListener('popstate', function () {
    if (isOpen) { pushed = false; close(false); }
    else flush();
  });

  window.matchMedia('(min-width: 1025px)').addEventListener('change', function (e) {
    if (e.matches) close(false);
  });

  /* ---- drag to close ---- */
  var drag = null;

  function endDrag(allowClose) {
    if (!drag) return;
    var d = drag;
    drag = null;
    if (!d.active) return;

    var speed = d.dx / Math.max(Date.now() - d.t, 1);
    var shouldClose = allowClose && (d.dx > nav.offsetWidth * 0.35 || speed > 0.6);

    nav.style.transition = '';
    backdrop.style.transition = '';
    nav.style.transform = '';
    backdrop.style.opacity = '';
    if (shouldClose) close(true);
  }

  nav.addEventListener('touchstart', function (e) {
    var t = e.touches[0];
    drag = { x: t.clientX, y: t.clientY, t: Date.now(), dx: 0, active: false, dead: false };
  }, { passive: true });

  nav.addEventListener('touchmove', function (e) {
    if (!drag || drag.dead) return;
    var t = e.touches[0];
    var dx = t.clientX - drag.x;
    var dy = t.clientY - drag.y;

    if (!drag.active) {
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { drag.dead = true; return; }
      if (dx < -8) { drag.dead = true; return; }
      if (dx <= 8) return;
      drag.active = true;
      nav.style.transition = 'none';
      backdrop.style.transition = 'none';
      nav.classList.add('animating');
    }

    drag.dx = Math.max(dx, 0);
    nav.style.transform = 'translateX(' + drag.dx + 'px)';
    backdrop.style.opacity = String(Math.max(1 - drag.dx / nav.offsetWidth, 0));
  }, { passive: true });

  nav.addEventListener('touchend', function () { endDrag(true); });
  nav.addEventListener('touchcancel', function () { endDrag(false); });
})();
