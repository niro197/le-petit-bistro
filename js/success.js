const successCard = document.querySelector('.success-card');
const downloadButton = document.querySelector('#download-button');
const downloadStatus = document.querySelector('#download-status');
const sessionId = new URLSearchParams(window.location.search).get('session_id');
const configuredApi = successCard?.dataset.apiBase || '';
const apiBase = configuredApi.startsWith('http') ? configuredApi.replace(/\/$/, '') : '';

if (!sessionId || !apiBase) {
  downloadButton.textContent = 'API de téléchargement à configurer';
  downloadStatus.textContent = 'Ajoutez l’URL HTTPS de votre serveur dans data-api-base sur success.html.';
} else {
  const downloadUrl = `${apiBase}/api/download?session_id=${encodeURIComponent(sessionId)}`;
  downloadButton.href = downloadUrl;
  downloadButton.removeAttribute('aria-disabled');
  downloadButton.textContent = 'Télécharger mon pack ZIP';
  downloadStatus.textContent = 'Le serveur vérifiera la session Stripe au moment du téléchargement.';
}
