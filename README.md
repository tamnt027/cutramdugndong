# Website Cừ Tràm Dũng Đông

Website giới thiệu và bán cừ tràm, cừ bạch đàn, cừ dừa, lá dừa nước cho **Công ty TNHH Thương Mại Dũng Đông** — phong cách truyền thống, tin cậy, mobile-first responsive, có CMS để chủ shop tự thêm tin tức / hoạt động / xem yêu cầu báo giá.

## Tech stack

- **Node.js 20+ / Express + EJS** (server-side render — SEO tốt cho từ khóa "cừ tràm")
- **Tailwind CSS** via CDN (không cần build step)
- **Turso (libSQL)** — database SQLite phân tán, free forever, persistent
- **Cloudinary** — host ảnh miễn phí 25GB
- **Nodemailer** — gửi email khi có yêu cầu báo giá (tùy chọn)

## Tính năng

### Public site
- Trang chủ, Giới thiệu, Sản phẩm (4 loại), Dịch vụ, Hoạt động, Tin tức, Liên hệ
- Chi tiết từng loại cừ với thông số, ứng dụng, ưu điểm, bảng giá
- Form yêu cầu báo giá có chống spam (honeypot)
- Floating buttons: Gọi nhanh, Zalo, Messenger
- Lightbox ảnh, lazy loading, mobile menu
- SEO: meta tags, Open Graph, sitemap.xml, robots.txt, schema.org LocalBusiness

### Admin panel (`/admin`)
- Đăng nhập bằng env `ADMIN_USERNAME` + `ADMIN_PASSWORD`
- CRUD bài viết tin tức (có upload ảnh bìa)
- CRUD ảnh hoạt động công trình
- Xem & xử lý các yêu cầu báo giá

---

## Chạy local (dev)

```bash
npm install
cp .env.example .env
# Sửa .env theo nhu cầu (tối thiểu chỉ cần SESSION_SECRET, ADMIN_PASSWORD)
npm run db:seed   # tạo schema + dữ liệu mẫu
npm run dev       # chạy server với watch
```

Mở `http://localhost:3000` và `http://localhost:3000/admin/login` (mặc định: admin / admin123).

> Khi chưa có Turso, app dùng SQLite file `data/app.db`. Đủ để dev nhưng **không dùng được trên Render free** (filesystem ephemeral).

---

## Deploy lên Render.com (free)

### Bước 1: Tạo Turso database (free, persistent forever)
1. Đăng ký https://turso.tech (login bằng GitHub)
2. Tạo database mới: nhấn **Create Database** → đặt tên `cutram-dungdong` → region gần nhất (ví dụ Singapore)
3. Vào tab **Connect** → copy:
   - `Database URL` (dạng `libsql://xxxxx.turso.io`)
   - `Auth Token` (nhấn **Create Token**)

### Bước 2: Tạo Cloudinary account (free 25GB)
1. Đăng ký https://cloudinary.com
2. Vào Dashboard → copy 3 giá trị: **Cloud name**, **API Key**, **API Secret**

### Bước 3: Push code lên GitHub
```bash
git init
git add .
git commit -m "Initial"
git remote add origin git@github.com:tamnt027/cutramdugndong.git
git push -u origin main
```

### Bước 4: Deploy lên Render
1. Vào https://render.com → đăng ký bằng GitHub
2. **New +** → **Blueprint** → chọn repo vừa push
3. Render đọc `render.yaml`, hỏi các env var có `sync: false` — điền:
   - `SITE_URL` = `https://<tên-app>.onrender.com` (sau khi tạo xong sẽ biết URL)
   - `ADMIN_PASSWORD` = mật khẩu admin mạnh
   - `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` = từ bước 1
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` = từ bước 2
   - SMTP_* = bỏ trống nếu chưa cần email (yêu cầu báo giá vẫn lưu trong DB)
4. **Apply** → đợi build (~2 phút) → app live

### Bước 5: Khởi tạo dữ liệu mẫu (tùy chọn, làm 1 lần)
Vào tab **Shell** trên Render service:
```bash
npm run db:seed
```

---

## Cấu trúc thư mục

```
.
├── public/                    # static assets (CSS, JS, ảnh)
├── src/
│   ├── config.js              # đọc env vars
│   ├── server.js              # entry Express
│   ├── db/
│   │   ├── client.js          # Turso/SQLite client
│   │   ├── schema.js          # tạo tables
│   │   ├── init.js            # script init schema
│   │   └── seed.js            # script seed dữ liệu mẫu
│   ├── data/
│   │   └── products.js        # 4 loại cừ (data tĩnh)
│   ├── routes/
│   │   ├── public.js          # routes trang public
│   │   ├── contact.js         # form liên hệ
│   │   ├── admin.js           # admin panel + CRUD
│   │   └── seo.js             # robots.txt, sitemap.xml, healthz
│   └── views/                 # EJS templates
│       ├── partials/          # header, footer, head, foot, ...
│       ├── pages/             # home, about, products, ...
│       └── admin/             # admin views
├── .env.example
├── package.json
├── render.yaml                # config deploy Render
└── README.md
```

---

## Lưu ý quan trọng về Render free tier

- **Cold start**: app sleep sau 15 phút không có request, lần truy cập tiếp theo sẽ chậm 30-60s. Để tránh: dùng cron-job.org ping `/healthz` mỗi 10 phút (miễn phí).
- **Filesystem ephemeral**: phải dùng Turso, KHÔNG được dùng SQLite local trên production.
- **750 giờ/tháng**: free tier đủ chạy 1 service liên tục.

## Cập nhật thông tin liên hệ / hotline

Sửa các env var bắt đầu bằng `COMPANY_*` trên Render dashboard → Restart service. Không cần đổi code.

## License

Proprietary - Công ty TNHH Thương Mại Dũng Đông.
