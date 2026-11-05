/* FAQ  (one item open at a time) */

(function () {
  'use strict';

  var QUESTIONS = [
    'Why is it free?',
    'Do I need this if I’ve had my yearly medical check? What is the difference?',
    'Can I bring another person to the appointment?',
    'How long does it take?',
    'What if I have to cancel or if I’m not sure I’ll be able to make it?',
    'Do I need to bring anything with me?',
    'What if I don’t have insurance?',
    'Do the weight loss programs you offer work?',
    'What’s the catch?',
    'Will I have to exhaust myself in the gym to make it work?',
    'Where are you located?'
  ];
  var ANSWER = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  var CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9l7 7 7-7"/></svg>';

  var list = document.getElementById('faq-list');

  function buildItem(question, i) {
    var item = document.createElement('div');
    item.className = 'faq-item';
    item.innerHTML =
      '<h3 style="font:inherit;margin:0"><button class="faq-q" type="button" aria-expanded="false" ' +
      'aria-controls="faq-a' + i + '" id="faq-q' + i + '"><span></span>' + CHEVRON + '</button></h3>' +
      '<div class="faq-a" id="faq-a' + i + '" role="region" aria-labelledby="faq-q' + i + '"><div><p>' + ANSWER + '</p></div></div>';
    item.querySelector('span').textContent = question;
    return item;
  }

  function close(item) {
    item.classList.remove('open');
    item.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
  }

  QUESTIONS.forEach(function (q, i) { list.appendChild(buildItem(q, i)); });

  list.addEventListener('click', function (e) {
    var btn = e.target.closest('.faq-q');
    if (!btn) return;

    var item = btn.closest('.faq-item');
    var willOpen = !item.classList.contains('open');

    list.querySelectorAll('.faq-item.open').forEach(close);
    if (willOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
})();
