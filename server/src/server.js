import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import Stripe from 'stripe';
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, '..');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_missing');
const app = express();
const port = Number(process.env.PORT || 8787);
const ttlSeconds = Number(process.env.DOWNLOAD_TTL_SECONDS || 86400);
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || '';
const adminSessionSecret = process.env.ADMIN_SESSION_SECRET || '';
const adminSessionTtlSeconds = 8 * 60 * 60;
const adminSessions = new Map();
const zipPath = path.resolve(serverRoot, process.env.DOWNLOAD_ZIP_PATH || '../packs/ui-components.zip');
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map((origin) => origin.trim()).filter(Boolean);
const allowedProducts = new Set([
  'ui-gradient-button', 'soft-button-set', 'aurora-card', 'glass-profile-card', 'product-card-kit',
  'motion-hero', 'split-hero', 'pricing-table', 'comparison-table', 'dashboard-shell', 'stats-widget',
  'form-contact', 'checkout-form', 'nav-mega-menu', 'mobile-tab-bar', 'badge-system', 'testimonial-block',
  'aurora-background', 'footer-system'
]);

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn('Stripe non configuré : STRIPE_SECRET_KEY et STRIPE_WEBHOOK_SECRET sont requis.');
}

fs.mkdirSync(path.join(serverRoot, 'data'), { recursive: true });
const db = new Database(path.join(serverRoot, 'data', 'orders.sqlite'));
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS orders (
  session_id TEXT PRIMARY KEY,
  payment_link_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  customer_email TEXT,
  payment_status TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  downloaded_at INTEGER,
  amount_total INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'usd'
)`);
const columns = db.prepare('PRAGMA table_info(orders)').all().map((column) => column.name);
if (!columns.includes('amount_total')) db.exec("ALTER TABLE orders ADD COLUMN amount_total INTEGER DEFAULT 0");
if (!columns.includes('currency')) db.exec("ALTER TABLE orders ADD COLUMN currency TEXT DEFAULT 'usd'");
const saveOrder = db.prepare(`INSERT INTO orders (session_id, payment_link_id, product_id, customer_email, payment_status, created_at, expires_at, amount_total, currency)
  VALUES (@session_id, @payment_link_id, @product_id, @customer_email, @payment_status, @created_at, @expires_at, @amount_total, @currency)
  ON CONFLICT(session_id) DO UPDATE SET payment_status=excluded.payment_status, customer_email=excluded.customer_email, expires_at=excluded.expires_at, amount_total=excluded.amount_total, currency=excluded.currency`);
const findOrder = db.prepare('SELECT * FROM orders WHERE session_id = ?');
const markDownloaded = db.prepare('UPDATE orders SET downloaded_at = ? WHERE session_id = ?');

app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error('Origin non autorisée'));
} }));

// Important : ce middleware doit rester avant express.json() pour conserver le corps brut Stripe.
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('Signature webhook invalide:', error.message);
    return res.status(400).send('Webhook signature invalide');
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object;
      if (session.payment_status !== 'paid' || !session.payment_link) return res.json({ received: true });
      const paymentLink = await stripe.paymentLinks.retrieve(session.payment_link);
      const productId = paymentLink.metadata?.catalogue_id;
      if (!allowedProducts.has(productId)) return res.status(400).send('Produit non autorisé');
      const now = Math.floor(Date.now() / 1000);
      saveOrder.run({
        session_id: session.id,
        payment_link_id: session.payment_link,
        product_id: productId,
        customer_email: session.customer_details?.email || null,
        payment_status: session.payment_status,
        created_at: now,
        expires_at: now + ttlSeconds,
        amount_total: session.amount_total || 0,
        currency: session.currency || 'usd'
      });
    }
    return res.json({ received: true });
  } catch (error) {
    console.error('Erreur de traitement webhook:', error);
    return res.status(500).send('Erreur interne');
  }
});

app.use(express.json({ limit: '50kb' }));
app.get('/health', (_req, res) => res.json({ ok: true, service: 'studio-projets-download-api' }));

function requireAdmin(req, res, next) {
  if (!adminPasswordHash || !adminSessionSecret) return res.status(503).json({ error: 'Authentification admin non configurée sur le serveur.' });
  const authorization = String(req.headers.authorization || '');
  const sessionToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const session = adminSessions.get(sessionToken);
  if (!session || session.expiresAt < Date.now()) {
    adminSessions.delete(sessionToken);
    return res.status(401).json({ error: 'Session administrateur expirée ou invalide.' });
  }
  return next();
}

function passwordMatches(password, storedHash) {
  const [algorithm, saltHex, keyHex] = storedHash.split('$');
  if (algorithm !== 'scrypt' || !saltHex || !keyHex) return false;
  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(keyHex, 'hex');
  const actual = crypto.scryptSync(password, salt, expected.length, { N: 16384, r: 8, p: 1 });
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function createAdminSession() {
  const randomPart = crypto.randomBytes(32).toString('hex');
  const signature = crypto.createHmac('sha256', adminSessionSecret).update(randomPart).digest('hex');
  const token = `${randomPart}.${signature}`;
  adminSessions.set(token, { expiresAt: Date.now() + adminSessionTtlSeconds * 1000 });
  return token;
}

const adminLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: 'draft-8', legacyHeaders: false });
const adminLoginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-8', legacyHeaders: false });
app.post('/api/admin/login', adminLoginLimiter, async (req, res) => {
  if (!adminPasswordHash || !adminSessionSecret) return res.status(503).json({ error: 'Authentification admin non configurée.' });
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!password || password.length > 200 || !passwordMatches(password, adminPasswordHash)) return res.status(401).json({ error: 'Mot de passe incorrect.' });
  return res.json({ token: createAdminSession(), expires_in: adminSessionTtlSeconds });
});

app.get('/api/admin/stats', adminLimiter, requireAdmin, (_req, res) => {
  const paid = db.prepare("SELECT COUNT(*) AS count, COALESCE(SUM(amount_total), 0) AS revenue FROM orders WHERE payment_status = 'paid'").get();
  const downloads = db.prepare('SELECT COUNT(*) AS count FROM orders WHERE downloaded_at IS NOT NULL').get();
  const productRows = db.prepare("SELECT product_id, COUNT(*) AS sales, COALESCE(SUM(amount_total), 0) AS revenue, SUM(CASE WHEN downloaded_at IS NOT NULL THEN 1 ELSE 0 END) AS downloads FROM orders WHERE payment_status = 'paid' GROUP BY product_id ORDER BY sales DESC, revenue DESC").all();
  const recentRows = db.prepare('SELECT session_id, product_id, customer_email, payment_status, amount_total, currency, created_at, downloaded_at FROM orders ORDER BY created_at DESC LIMIT 50').all();
  return res.json({
    generated_at: new Date().toISOString(),
    summary: { sales: paid.count, revenue_cents: paid.revenue, downloads: downloads.count },
    by_product: productRows,
    recent: recentRows
  });
});

const downloadLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false });
app.get('/api/download', downloadLimiter, async (req, res) => {
  const sessionId = String(req.query.session_id || '');
  if (!/^cs_(test_|live_)?[A-Za-z0-9]+$/.test(sessionId)) return res.status(400).json({ error: 'Session Stripe invalide.' });

  try {
    let order = findOrder.get(sessionId);
    // Le webhook peut arriver quelques secondes après la redirection : on vérifie alors Stripe directement.
    if (!order) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== 'paid' || !session.payment_link) return res.status(402).json({ error: 'Paiement non confirmé.' });
      const paymentLink = await stripe.paymentLinks.retrieve(session.payment_link);
      const productId = paymentLink.metadata?.catalogue_id;
      if (!allowedProducts.has(productId)) return res.status(403).json({ error: 'Produit non autorisé.' });
      const now = Math.floor(Date.now() / 1000);
      saveOrder.run({ session_id: session.id, payment_link_id: session.payment_link, product_id: productId, customer_email: session.customer_details?.email || null, payment_status: session.payment_status, created_at: now, expires_at: now + ttlSeconds, amount_total: session.amount_total || 0, currency: session.currency || 'usd' });
      order = findOrder.get(sessionId);
    }
    if (order.payment_status !== 'paid') return res.status(402).json({ error: 'Paiement non confirmé.' });
    if (order.expires_at < Math.floor(Date.now() / 1000)) return res.status(410).json({ error: 'Ce lien de téléchargement a expiré.' });
    if (!fs.existsSync(zipPath)) return res.status(500).json({ error: 'Pack ZIP indisponible sur le serveur.' });
    markDownloaded.run(Math.floor(Date.now() / 1000), sessionId);
    res.download(zipPath, `studio-projets-${order.product_id}.zip`);
  } catch (error) {
    console.error('Erreur téléchargement:', error);
    return res.status(500).json({ error: 'Impossible de préparer le téléchargement.' });
  }
});

app.use((_error, _req, res, _next) => res.status(403).json({ error: 'Requête refusée.' }));
app.listen(port, () => console.log(`API Studio Projet démarrée sur http://localhost:${port}`));
