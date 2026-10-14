const productGrid = document.querySelector('#product-grid');
const filterBar = document.querySelector('#product-filters');
const searchInput = document.querySelector('#product-search');
const resultLabel = document.querySelector('#catalog-result');
const cartItems = document.querySelector('#cart-items');
const cartCount = document.querySelector('#cart-count');
const cartCta = document.querySelector('#cart-cta');
const cartNote = document.querySelector('.cart-note');
const cartTotal = document.querySelector('#cart-total');
const cart = [];
let products = [];
let activeCategory = 'all';
let searchTerm = '';

const previewMarkup = {
  'gradient-button': '<div class="shop-preview preview-gradient"><span>Hover me</span><i></i><i></i></div>',
  'aurora-card': '<div class="shop-preview preview-aurora"><div><small>COMPONENT 02</small><strong>Aurora<br>Card</strong></div><i></i></div>',
  'motion-hero': '<div class="shop-preview preview-motion"><small>NEW COLLECTION</small><strong>Make it<br>move.</strong><span>Discover</span><i></i></div>'
};

function renderFilters() {
  const categories = ['Toutes les catégories', ...new Set(products.map((product) => product.category))];
  filterBar.innerHTML = categories.map((category, index) => `<button class="filter-button${index === 0 ? ' is-active' : ''}" type="button" data-category="${index === 0 ? 'all' : category}">${category}</button>`).join('');
  filterBar.querySelectorAll('.filter-button').forEach((button) => button.addEventListener('click', () => {
    activeCategory = button.dataset.category;
    filterBar.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    renderProducts();
  }));
}

function renderProducts() {
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase('fr');
  const visible = products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const searchable = `${product.name} ${product.category} ${product.description} ${product.deliverables.join(' ')}`.toLocaleLowerCase('fr');
    return matchesCategory && (!normalizedSearch || searchable.includes(normalizedSearch));
  });
  if (resultLabel) resultLabel.textContent = `${visible.length} produit${visible.length > 1 ? 's' : ''} affiché${visible.length > 1 ? 's' : ''} sur ${products.length}`;
  productGrid.innerHTML = visible.length ? visible.map((product) => {
    const canBuy = Boolean(product.stripe_payment_link);
    return `<article class="shop-product" data-product-id="${product.id}">${previewMarkup[product.preview] || ''}<div class="shop-product-body"><span class="product-category">${product.category}</span><h3>${product.name}</h3><p>${product.description}</p><div class="product-meta"><strong>${product.price_label}</strong><div class="product-actions"><a class="buy-product${canBuy ? '' : ' is-pending'}" ${canBuy ? `href="checkout.html?product=${encodeURIComponent(product.id)}"` : 'aria-disabled="true"'}>${canBuy ? 'Acheter' : 'Stripe à configurer'}</a><button type="button" class="add-to-cart" data-add-product="${product.id}">Ajouter</button></div></div><details><summary>Ce qui est inclus <span>+</span></summary><ul>${product.deliverables.map((item) => `<li>${item}</li>`).join('')}</ul></details></div></article>`;
  }).join('') : '<p class="catalog-error">Aucun produit ne correspond à cette recherche.</p>';
  productGrid.querySelectorAll('[data-add-product]').forEach((button) => button.addEventListener('click', () => addToCart(button.dataset.addProduct)));
}

searchInput?.addEventListener('input', () => {
  searchTerm = searchInput.value;
  renderProducts();
});

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  const line = cart.find((item) => item.id === id);
  if (line) line.quantity += 1;
  else cart.push({ id: product.id, name: product.name, priceLabel: product.price_label, priceUsd: product.price_usd, quantity: 1, paymentLink: product.stripe_payment_link });
  renderCart();
}

function renderCart() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + (Number(item.priceUsd) || 0) * item.quantity, 0);
  cartCount.textContent = `${totalItems} produit${totalItems > 1 ? 's' : ''}`;
  if (cartTotal) cartTotal.textContent = cart.length ? `$${totalPrice}` : '$0';
  cartCta.disabled = cart.length === 0;
  if (!cart.length) {
    cartItems.innerHTML = '<p class="cart-empty">Votre sélection est vide.<br>Ajoutez un produit pour commencer.</p>';
    return;
  }
  cartItems.innerHTML = cart.map((item, index) => `<div class="cart-line"><div><strong>${item.name}</strong><small>${item.priceLabel}</small><div class="cart-controls"><button type="button" data-cart-action="minus" data-index="${index}" aria-label="Retirer une unité">−</button><span>${item.quantity}</span><button type="button" data-cart-action="plus" data-index="${index}" aria-label="Ajouter une unité">+</button></div></div><button class="remove-line" type="button" data-cart-action="remove" data-index="${index}">Retirer</button></div>`).join('');
}

cartItems?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-cart-action]');
  if (!button) return;
  const index = Number(button.dataset.index);
  const line = cart[index];
  if (!line) return;
  if (button.dataset.cartAction === 'plus') line.quantity += 1;
  if (button.dataset.cartAction === 'minus') line.quantity -= 1;
  if (button.dataset.cartAction === 'remove' || line.quantity <= 0) cart.splice(index, 1);
  renderCart();
});

cartCta?.addEventListener('click', () => {
  if (cart.length !== 1 || cart[0].quantity !== 1) {
    cartNote.textContent = 'Pour payer directement, sélectionnez un seul produit à la fois. Un lien Stripe unique sera ensuite ouvert.';
    return;
  }
  const product = cart[0];
  if (!product.paymentLink) {
    cartNote.textContent = 'Le lien Stripe de ce produit doit encore être configuré dans catalogue/produits.json.';
    return;
  }
  window.location.href = `checkout.html?product=${encodeURIComponent(product.id)}`;
});

async function loadCatalog() {
  try {
    const response = await fetch('catalogue/produits.json');
    if (!response.ok) throw new Error('Catalogue indisponible');
    const data = await response.json();
    products = data.products || [];
    renderFilters();
    renderProducts();
    renderCart();
  } catch (error) {
    productGrid.innerHTML = '<p class="catalog-error">Le catalogue n’a pas pu être chargé. Vérifiez que le site est ouvert depuis un hébergement web.</p>';
  }
}

loadCatalog();
