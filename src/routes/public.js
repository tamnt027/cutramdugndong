import { Router } from 'express';
import { getDb } from '../db/client.js';
import { products, productsBySlug } from '../data/products.js';
import { config } from '../config.js';

const router = Router();

// Trang chu
router.get('/', async (req, res) => {
  const db = getDb();
  const [news, activities] = await Promise.all([
    db.execute('SELECT id, slug, title, excerpt, cover_url, created_at FROM news WHERE published = 1 ORDER BY created_at DESC LIMIT 3'),
    db.execute('SELECT id, title, image_url, location FROM activities ORDER BY sort_order DESC, created_at DESC LIMIT 6'),
  ]);

  res.render('pages/home', {
    title: '',
    description: 'Công ty Dũng Đông chuyên cung cấp cừ tràm, cừ bạch đàn, cừ dừa, lá dừa nước cho công trình xây dựng tại TP.HCM và các tỉnh lân cận. Hơn 20 năm kinh nghiệm, giá cạnh tranh.',
    news: news.rows,
    activities: activities.rows,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: config.company.name,
      image: config.siteUrl + '/img/og-default.svg',
      telephone: config.company.hotline,
      email: config.company.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: config.company.address,
        addressLocality: 'TP.HCM',
        addressCountry: 'VN',
      },
      url: config.siteUrl,
      priceRange: '$$',
    },
  });
});

router.get('/gioi-thieu', (req, res) => {
  res.render('pages/about', {
    title: 'Giới thiệu',
    description: 'Công ty TNHH Thương Mại Dũng Đông - hơn 20 năm kinh nghiệm cung cấp cừ tràm, cừ bạch đàn, cừ dừa và lá dừa nước với phương châm UY TÍN - CHẤT LƯỢNG - GIÁ HỢP LÝ.',
  });
});

router.get('/san-pham', (req, res) => {
  res.render('pages/products', {
    title: 'Sản phẩm',
    description: 'Danh mục sản phẩm cừ tràm, cừ bạch đàn, cừ dừa, lá dừa nước - đầy đủ kích thước, chất lượng tuyển chọn.',
  });
});

router.get('/san-pham/:slug', (req, res, next) => {
  const product = productsBySlug[req.params.slug];
  if (!product) return next();
  res.render('pages/product-detail', {
    title: product.name,
    description: product.short,
    product,
    ogImage: product.cover,
  });
});

router.get('/dich-vu', (req, res) => {
  res.render('pages/services', {
    title: 'Dịch vụ',
    description: 'Dịch vụ tư vấn, thiết kế phương án đóng cừ, vận chuyển, bốc dỡ, thi công cừ tràm cho công trình.',
  });
});

router.get('/hoat-dong', async (req, res) => {
  const db = getDb();
  const result = await db.execute('SELECT * FROM activities ORDER BY sort_order DESC, created_at DESC');
  res.render('pages/activities', {
    title: 'Hoạt động công trình',
    description: 'Hình ảnh các công trình thực tế Dũng Đông đã cung cấp cừ tràm, cừ bạch đàn, cừ dừa.',
    activities: result.rows,
  });
});

router.get('/tin-tuc', async (req, res) => {
  const db = getDb();
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const perPage = 9;
  const offset = (page - 1) * perPage;

  const [list, count] = await Promise.all([
    db.execute({
      sql: 'SELECT id, slug, title, excerpt, cover_url, created_at FROM news WHERE published = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?',
      args: [perPage, offset],
    }),
    db.execute('SELECT COUNT(*) as c FROM news WHERE published = 1'),
  ]);

  const total = Number(count.rows[0].c);
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  res.render('pages/news', {
    title: 'Tin tức',
    description: 'Tin tức về cừ tràm, hướng dẫn chọn cừ, bảng giá cập nhật và các bài viết liên quan đến gia cố nền móng.',
    posts: list.rows,
    page,
    totalPages,
  });
});

router.get('/tin-tuc/:slug', async (req, res, next) => {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM news WHERE slug = ? AND published = 1 LIMIT 1',
    args: [req.params.slug],
  });
  if (!result.rows.length) return next();
  const post = result.rows[0];

  const related = await db.execute({
    sql: 'SELECT id, slug, title, cover_url FROM news WHERE published = 1 AND id != ? ORDER BY created_at DESC LIMIT 3',
    args: [post.id],
  });

  res.render('pages/news-detail', {
    title: post.title,
    description: post.excerpt || post.title,
    ogImage: post.cover_url,
    post,
    related: related.rows,
  });
});

export default router;
