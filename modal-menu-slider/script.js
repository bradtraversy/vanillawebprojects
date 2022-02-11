const toggle = document.getElementById('toggle');
const close = document.getElementById('close');
const open = document.getElementById('open');
const modal = document.getElementById('modal');
const navbar = document.getElementById('navbar');

// Hide nav on click outside of toggle or nav
document.body.addEventListener('click', e => {
  document.body.classList.contains('show-nav') &&
  e.target != nav &&
  !nav.contains(e.target) &&
  e.target != toggle &&
  !toggle.contains(e.target)
    ? document.body.classList.toggle('show-nav')
    : false;
});

// Toggle nav
toggle.addEventListener('click', () => {
  document.body.classList.toggle('show-nav');
});

// Show modal
open.addEventListener('click', () => modal.classList.add('show-modal'));

// Hide modal
close.addEventListener('click', () => modal.classList.remove('show-modal'));

// Hide modal on outside click
window.addEventListener('click', e =>
  e.target == modal ? modal.classList.remove('show-modal') : false
);
