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

const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-status');
if (contactForm && contactStatus) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    contactStatus.textContent = 'Votre demande est prête à être envoyée. Branchez Formspree pour recevoir les messages.';
    const button = contactForm.querySelector('button');
    button.textContent = 'Demande enregistrée';
    button.disabled = true;
    contactForm.querySelectorAll('input, select, textarea').forEach((field) => { field.disabled = true; });
  });
}
