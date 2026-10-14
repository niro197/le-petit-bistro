const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('b').textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelector('b').textContent = 'Ouvrir le menu';
    });
  });
}

const cards = [...document.querySelectorAll('.project-card')];
document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    cards.forEach((card) => {
      const shouldHide = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
      card.classList.toggle('is-hidden', shouldHide);
    });
  });
});

const projectData = {
  bistro: { type: 'Site vitrine', title: 'Le Petit Bistro', description: 'Une présence chaleureuse pour un lieu qui reçoit, avec carte, réservation et commande à emporter.', includes: 'Structure one-page, direction visuelle, carte interactive et formulaire de réservation.' },
  atelier: { type: 'Identité de marque', title: 'Atelier Matière', description: 'Une identité sensible pour un savoir-faire précis, pensée pour fonctionner en ligne et sur les supports imprimés.', includes: 'Système de couleurs, typographies, logo de départ et page de présentation.' },
  nord: { type: 'Boutique en ligne', title: 'Nord & Forme', description: 'Une vitrine e-commerce calme et orientée conversion, pour présenter une collection sans distraire de l’achat.', includes: 'Page catalogue, fiches produits, panier de départ et parcours de demande.' },
  studio: { type: 'Portfolio', title: '[À REMPLACER : projet]', description: 'Un espace clair pour présenter un travail et recevoir des demandes qualifiées.', includes: 'Galerie de projets, filtres, modal de présentation et contact.' }
};

const modal = document.querySelector('#project-modal');
const modalTitle = document.querySelector('#modal-title');
const modalType = document.querySelector('#modal-type');
const modalDescription = document.querySelector('#modal-description');
const modalIncludes = document.querySelector('#modal-includes');
const modalCta = document.querySelector('#modal-cta');

function closeModal() {
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-project-open]').forEach((button) => {
  button.addEventListener('click', () => {
    const data = projectData[button.dataset.projectOpen];
    if (!data || !modal) return;
    modalType.textContent = data.type;
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;
    modalIncludes.textContent = data.includes;
    modalCta.href = '#contact';
    modal.hidden = false;
    document.querySelector('.modal-close').focus();
  });
});

document.querySelectorAll('[data-modal-close]').forEach((item) => item.addEventListener('click', closeModal));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

const form = document.querySelector('#contact-form');
const status = document.querySelector('#contact-status');

if (form && status) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    status.textContent = 'Votre demande est prête à être envoyée. Branchez Formspree pour recevoir les projets.';
    const button = form.querySelector('button');
    button.textContent = 'Demande enregistrée';
    button.disabled = true;
    form.querySelectorAll('input, select, textarea').forEach((field) => { field.disabled = true; });
  });
}
