import 'dotenv/config';

const required = (key, fallback) => {
  const v = process.env[key];
  if (v && v.trim()) return v.trim();
  return fallback;
};

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  siteUrl: required('SITE_URL', 'http://localhost:3000'),
  sessionSecret: required('SESSION_SECRET', 'dev-secret-change-me'),

  admin: {
    username: required('ADMIN_USERNAME', 'admin'),
    password: required('ADMIN_PASSWORD', 'admin123'),
  },

  turso: {
    url: process.env.TURSO_DATABASE_URL || '',
    token: process.env.TURSO_AUTH_TOKEN || '',
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    enabled: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
  },

  mail: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: required('MAIL_FROM', 'noreply@example.com'),
    to: required('MAIL_TO', 'congtydungdong@gmail.com'),
    enabled: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
  },

  company: {
    name: required('COMPANY_NAME', 'Công ty TNHH Thương Mại Dũng Đông'),
    hotline: required('COMPANY_HOTLINE', '0909866929'),
    hotlineDisplay: required('COMPANY_HOTLINE_DISPLAY', '0909 866 929'),
    email: required('COMPANY_EMAIL', 'congtydungdong@gmail.com'),
    address: required('COMPANY_ADDRESS', '5H11/1, ấp 17, Xã Tân Vĩnh Lộc, TP.HCM'),
    zalo: required('COMPANY_ZALO', '0909866929'),
    facebook: required('COMPANY_FACEBOOK', 'https://facebook.com/'),
  },
};
