import { Router } from 'express';
import { getDb } from '../db/client.js';
import { products } from '../data/products.js';
import { config } from '../config.js';

const router = Router();

router.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${config.siteUrl}/sitemap.xml
`);
});

router.get('/sitemap.xml', async (req, res) => {
  const db = getDb();
  const news = await db.execute('SELECT slug, updated_at FROM news WHERE published = 1 ORDER BY updated_at DESC');

  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/gioi-thieu', priority: '0.8', changefreq: 'monthly' },
    { loc: '/san-pham', priority: '0.9', changefreq: 'monthly' },
    { loc: '/dich-vu', priority: '0.7', changefreq: 'monthly' },
    { loc: '/hoat-dong', priority: '0.7', changefreq: 'weekly' },
    { loc: '/tin-tuc', priority: '0.8', changefreq: 'weekly' },
    { loc: '/lien-he', priority: '0.8', changefreq: 'monthly' },
    ...products.map((p) => ({ loc: `/san-pham/${p.slug}`, priority: '0.9', changefreq: 'monthly' })),
    ...news.rows.map((n) => ({ loc: `/tin-tuc/${n.slug}`, priority: '0.6', changefreq: 'monthly', lastmod: n.updated_at })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${config.siteUrl}${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  res.type('application/xml').send(xml);
});

router.get('/healthz', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

export default router;
