import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { ensureSchema } from './db/schema.js';
import { products } from './data/products.js';

import publicRoutes from './routes/public.js';
import contactRoutes from './routes/contact.js';
import adminRoutes from './routes/admin.js';
import seoRoutes from './routes/seo.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', 1);

app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '7d' }));

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8, // 8 gio
    },
  })
);

// Bien dung chung cho tat ca template
app.use((req, res, next) => {
  res.locals.company = config.company;
  res.locals.siteUrl = config.siteUrl;
  res.locals.products = products;
  res.locals.currentPath = req.path;
  res.locals.year = new Date().getFullYear();
  res.locals.flash = req.session?.flash || null;
  if (req.session) req.session.flash = null;
  next();
});

app.use('/', publicRoutes);
app.use('/lien-he', contactRoutes);
app.use('/admin', adminRoutes);
app.use('/', seoRoutes);

app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Không tìm thấy trang' });
});

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).render('pages/500', { title: 'Lỗi máy chủ', error: config.env === 'development' ? err : null });
});

(async () => {
  try {
    await ensureSchema();
  } catch (err) {
    console.error('[startup] DB schema error:', err.message);
  }
  app.listen(config.port, () => {
    console.log(`[server] http://localhost:${config.port} (${config.env})`);
  });
})();
