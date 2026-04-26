import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import slugify from 'slugify';
import { getDb } from '../db/client.js';
import { config } from '../config.js';

const router = Router();

if (config.cloudinary.enabled) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});

function uploadToCloudinary(buffer, folder = 'cutram') {
  return new Promise((resolve, reject) => {
    if (!config.cloudinary.enabled) {
      return reject(new Error('Cloudinary chưa được cấu hình. Vui lòng đặt CLOUDINARY_* env vars.'));
    }
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', transformation: [{ quality: 'auto:good', fetch_format: 'auto' }] },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session?.admin) return next();
  return res.redirect('/admin/login');
}

// Page wrapper
function adminLayout(res, body, opts = {}) {
  res.render('admin/layout', {
    title: opts.title || 'Quản trị',
    pageTitle: opts.pageTitle || 'Quản trị',
    section: opts.section || '',
    body,
    flash: opts.flash || null,
  });
}

// Login
router.get('/login', (req, res) => {
  if (req.session?.admin) return res.redirect('/admin');
  res.render('admin/login', { title: 'Đăng nhập', error: req.query.error || null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === config.admin.username && password === config.admin.password) {
    req.session.admin = { username };
    return res.redirect('/admin');
  }
  res.redirect('/admin/login?error=1');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// Dashboard
router.get('/', requireAuth, async (req, res) => {
  const db = getDb();
  const [news, acts, contacts, unread] = await Promise.all([
    db.execute('SELECT COUNT(*) as c FROM news'),
    db.execute('SELECT COUNT(*) as c FROM activities'),
    db.execute('SELECT COUNT(*) as c FROM contacts'),
    db.execute('SELECT COUNT(*) as c FROM contacts WHERE handled = 0'),
  ]);
  res.render('admin/dashboard', {
    title: 'Tổng quan',
    section: 'dashboard',
    stats: {
      news: Number(news.rows[0].c),
      activities: Number(acts.rows[0].c),
      contacts: Number(contacts.rows[0].c),
      unread: Number(unread.rows[0].c),
    },
    cloudinaryEnabled: config.cloudinary.enabled,
    tursoEnabled: !!config.turso.url,
  });
});

// === NEWS ===
router.get('/news', requireAuth, async (req, res) => {
  const db = getDb();
  const result = await db.execute('SELECT id, slug, title, published, created_at FROM news ORDER BY created_at DESC');
  res.render('admin/news-list', { title: 'Tin tức', section: 'news', items: result.rows });
});

router.get('/news/new', requireAuth, (req, res) => {
  res.render('admin/news-form', { title: 'Thêm bài viết', section: 'news', item: null, cloudinaryEnabled: config.cloudinary.enabled });
});

router.get('/news/:id/edit', requireAuth, async (req, res, next) => {
  const db = getDb();
  const result = await db.execute({ sql: 'SELECT * FROM news WHERE id = ?', args: [req.params.id] });
  if (!result.rows.length) return next();
  res.render('admin/news-form', { title: 'Sửa bài viết', section: 'news', item: result.rows[0], cloudinaryEnabled: config.cloudinary.enabled });
});

router.post('/news', requireAuth, upload.single('cover'), async (req, res) => {
  try {
    const { title, excerpt, content, published } = req.body;
    if (!title || !content) {
      req.session.flash = { message: 'Tiêu đề và nội dung là bắt buộc.' };
      return res.redirect('/admin/news/new');
    }
    let coverUrl = null;
    if (req.file) {
      const r = await uploadToCloudinary(req.file.buffer, 'cutram/news');
      coverUrl = r.secure_url;
    }
    const slug = slugify(title, { lower: true, strict: true, locale: 'vi' }) + '-' + Date.now().toString(36);
    const db = getDb();
    await db.execute({
      sql: 'INSERT INTO news (slug, title, excerpt, content, cover_url, published) VALUES (?, ?, ?, ?, ?, ?)',
      args: [slug, title, excerpt || '', content, coverUrl, published ? 1 : 0],
    });
    req.session.flash = { message: 'Đã thêm bài viết.' };
    res.redirect('/admin/news');
  } catch (err) {
    console.error(err);
    req.session.flash = { message: 'Lỗi: ' + err.message };
    res.redirect('/admin/news/new');
  }
});

router.post('/news/:id', requireAuth, upload.single('cover'), async (req, res) => {
  try {
    const { title, excerpt, content, published } = req.body;
    const db = getDb();
    let coverUrl;
    if (req.file) {
      const r = await uploadToCloudinary(req.file.buffer, 'cutram/news');
      coverUrl = r.secure_url;
    }
    if (coverUrl) {
      await db.execute({
        sql: "UPDATE news SET title=?, excerpt=?, content=?, cover_url=?, published=?, updated_at=datetime('now') WHERE id=?",
        args: [title, excerpt || '', content, coverUrl, published ? 1 : 0, req.params.id],
      });
    } else {
      await db.execute({
        sql: "UPDATE news SET title=?, excerpt=?, content=?, published=?, updated_at=datetime('now') WHERE id=?",
        args: [title, excerpt || '', content, published ? 1 : 0, req.params.id],
      });
    }
    req.session.flash = { message: 'Đã cập nhật.' };
    res.redirect('/admin/news');
  } catch (err) {
    console.error(err);
    req.session.flash = { message: 'Lỗi: ' + err.message };
    res.redirect('/admin/news');
  }
});

router.post('/news/:id/delete', requireAuth, async (req, res) => {
  const db = getDb();
  await db.execute({ sql: 'DELETE FROM news WHERE id = ?', args: [req.params.id] });
  req.session.flash = { message: 'Đã xóa bài viết.' };
  res.redirect('/admin/news');
});

// === ACTIVITIES ===
router.get('/activities', requireAuth, async (req, res) => {
  const db = getDb();
  const result = await db.execute('SELECT * FROM activities ORDER BY sort_order DESC, created_at DESC');
  res.render('admin/activities-list', { title: 'Hoạt động', section: 'activities', items: result.rows });
});

router.get('/activities/new', requireAuth, (req, res) => {
  res.render('admin/activity-form', { title: 'Thêm hoạt động', section: 'activities', item: null, cloudinaryEnabled: config.cloudinary.enabled });
});

router.post('/activities', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, location, image_url } = req.body;
    let url = image_url || '';
    if (req.file) {
      const r = await uploadToCloudinary(req.file.buffer, 'cutram/activities');
      url = r.secure_url;
    }
    if (!title || !url) {
      req.session.flash = { message: 'Cần tiêu đề và ảnh.' };
      return res.redirect('/admin/activities/new');
    }
    const db = getDb();
    await db.execute({
      sql: 'INSERT INTO activities (title, description, image_url, location) VALUES (?, ?, ?, ?)',
      args: [title, description || '', url, location || ''],
    });
    req.session.flash = { message: 'Đã thêm hoạt động.' };
    res.redirect('/admin/activities');
  } catch (err) {
    console.error(err);
    req.session.flash = { message: 'Lỗi: ' + err.message };
    res.redirect('/admin/activities/new');
  }
});

router.post('/activities/:id/delete', requireAuth, async (req, res) => {
  const db = getDb();
  await db.execute({ sql: 'DELETE FROM activities WHERE id = ?', args: [req.params.id] });
  req.session.flash = { message: 'Đã xóa.' };
  res.redirect('/admin/activities');
});

// === CONTACTS ===
router.get('/contacts', requireAuth, async (req, res) => {
  const db = getDb();
  const result = await db.execute('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 200');
  res.render('admin/contacts-list', { title: 'Yêu cầu báo giá', section: 'contacts', items: result.rows });
});

router.post('/contacts/:id/handled', requireAuth, async (req, res) => {
  const db = getDb();
  await db.execute({ sql: 'UPDATE contacts SET handled = 1 WHERE id = ?', args: [req.params.id] });
  res.redirect('/admin/contacts');
});

router.post('/contacts/:id/delete', requireAuth, async (req, res) => {
  const db = getDb();
  await db.execute({ sql: 'DELETE FROM contacts WHERE id = ?', args: [req.params.id] });
  req.session.flash = { message: 'Đã xóa.' };
  res.redirect('/admin/contacts');
});

export default router;
