import { Router } from 'express';
import nodemailer from 'nodemailer';
import { getDb } from '../db/client.js';
import { config } from '../config.js';
import { products } from '../data/products.js';

const router = Router();

let transporter = null;
function getTransporter() {
  if (!config.mail.enabled) return null;
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.port === 465,
    auth: { user: config.mail.user, pass: config.mail.pass },
  });
  return transporter;
}

router.get('/', (req, res) => {
  res.render('pages/contact', {
    title: 'Liên hệ - Yêu cầu báo giá',
    description: 'Liên hệ Dũng Đông để được tư vấn và báo giá cừ tràm, cừ bạch đàn, cừ dừa, lá dừa nước. Hotline 0909 866 929.',
    selectedProduct: req.query.product || '',
    success: req.query.success === '1',
  });
});

router.post('/', async (req, res) => {
  const { name, phone, email, product, quantity, message, website } = req.body || {};

  // Honeypot anti-spam
  if (website) return res.redirect('/lien-he?success=1');

  if (!name || !phone || !/^[\d\s+\-().]{8,20}$/.test(phone)) {
    req.session.flash = { message: 'Vui lòng nhập họ tên và số điện thoại hợp lệ.' };
    return res.redirect('/lien-he');
  }

  try {
    const db = getDb();
    await db.execute({
      sql: 'INSERT INTO contacts (name, phone, email, product, quantity, message) VALUES (?, ?, ?, ?, ?, ?)',
      args: [name.trim().slice(0, 100), phone.trim().slice(0, 30), (email || '').trim().slice(0, 100), (product || '').slice(0, 100), (quantity || '').slice(0, 100), (message || '').slice(0, 2000)],
    });

    const tx = getTransporter();
    if (tx) {
      const productLabel = products.find((p) => p.slug === product)?.name || product || '(không chọn)';
      tx.sendMail({
        from: config.mail.from,
        to: config.mail.to,
        replyTo: email || undefined,
        subject: `[Yêu cầu báo giá] ${name} - ${productLabel}`,
        text: `Khách hàng: ${name}\nĐiện thoại: ${phone}\nEmail: ${email || '-'}\nSản phẩm: ${productLabel}\nSố lượng: ${quantity || '-'}\n\nNội dung:\n${message || '-'}`,
      }).catch((err) => console.error('[mail] send error:', err.message));
    }

    req.session.flash = { message: 'Cảm ơn bạn! Chúng tôi sẽ liên hệ trong thời gian sớm nhất.' };
    res.redirect('/lien-he?success=1');
  } catch (err) {
    console.error('[contact] error:', err);
    req.session.flash = { message: 'Có lỗi xảy ra. Vui lòng gọi hotline ' + config.company.hotlineDisplay };
    res.redirect('/lien-he');
  }
});

export default router;
