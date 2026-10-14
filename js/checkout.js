const params = new URLSearchParams(window.location.search);
const productId = params.get('product');
const title = document.querySelector('#checkout-title');
const description = document.querySelector('#checkout-description');
const productBox = document.querySelector('#checkout-product');
const stripeButton = document.querySelector('#stripe-button');
const note = document.querySelector('#checkout-note');

async function prepareCheckout() {
  try {
    const response = await fetch('catalogue/produits.json');
    const data = await response.json();
    const product = data.products.find((item) => item.id === productId);
    if (!product) throw new Error('Produit introuvable');
    title.textContent = `Acheter ${product.name}`;
    description.textContent = product.description;
    productBox.innerHTML = `<strong>${product.price_label}</strong><span>${product.category}</span><ul>${product.deliverables.map((item) => `<li>${item}</li>`).join('')}</ul>`;
    if (product.stripe_payment_link) {
      stripeButton.href = product.stripe_payment_link;
      stripeButton.setAttribute('target', '_blank');
      stripeButton.setAttribute('rel', 'noopener');
      note.textContent = 'Après le paiement, Stripe doit rediriger vers success.html pour afficher le téléchargement.';
    } else {
      stripeButton.removeAttribute('href');
      stripeButton.setAttribute('aria-disabled', 'true');
      stripeButton.classList.add('is-pending');
      stripeButton.textContent = 'Lien Stripe à configurer';
      note.textContent = 'Ce produit a un prix, mais son Payment Link Stripe n’est pas encore renseigné dans catalogue/produits.json.';
    }
  } catch (error) {
    title.textContent = 'Produit introuvable';
    description.textContent = 'Retournez à la boutique pour sélectionner un produit disponible.';
    stripeButton.remove();
  }
}

prepareCheckout();
