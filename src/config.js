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

  company: (() => {
    const hotlines = [
      {
        name: required('COMPANY_HOTLINE_NAME', 'A. Chào'),
        number: required('COMPANY_HOTLINE', '0931226969'),
        display: required('COMPANY_HOTLINE_DISPLAY', '0931 226 969'),
      },
    ];
    if (process.env.COMPANY_HOTLINE_2) {
      hotlines.push({
        name: process.env.COMPANY_HOTLINE_2_NAME || '',
        number: process.env.COMPANY_HOTLINE_2,
        display: process.env.COMPANY_HOTLINE_2_DISPLAY || process.env.COMPANY_HOTLINE_2,
      });
    } else {
      // default: keep so cu lam so phu (A. Dung)
      hotlines.push({ name: 'A. Dũng', number: '0909866929', display: '0909 866 929' });
    }
    return {
      name: required('COMPANY_NAME', 'Công ty TNHH Thương Mại Dũng Đông'),
      hotlines,
      // Backwards-compat: hotline + hotlineDisplay luon tro vao so chinh
      hotline: hotlines[0].number,
      hotlineDisplay: hotlines[0].display,
      email: required('COMPANY_EMAIL', 'congtydungdong@gmail.com'),
      address: required('COMPANY_ADDRESS', '5H11/1, ấp 17, Xã Tân Vĩnh Lộc, TP.HCM'),
      zalo: required('COMPANY_ZALO', hotlines[0].number),
      facebook: required('COMPANY_FACEBOOK', 'https://facebook.com/'),
      map: {
        // Vua cu tram Dung Dong - 10.7913204, 106.5139166
        embedUrl: required(
          'COMPANY_MAP_EMBED_URL',
          'https://maps.google.com/maps?q=10.7913204,106.5139166&hl=vi&z=17&output=embed'
        ),
        link: required('COMPANY_MAP_LINK', 'https://maps.app.goo.gl/89FqViYZcsPS6Rrg8'),
      },
    };
  })(),
};
