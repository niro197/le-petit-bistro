const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('b').textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('b').textContent = 'Ouvrir le menu';
  }));
}
