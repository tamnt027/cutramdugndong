import { getDb } from './client.js';
import { ensureSchema } from './schema.js';
import slugify from 'slugify';

const newsSeed = [
  {
    title: 'Ứng dụng cừ tràm trong gia cố nền móng nhà phố',
    excerpt: 'Cừ tràm vẫn là giải pháp gia cố nền đất yếu được nhiều nhà thầu lựa chọn nhờ chi phí hợp lý và độ bền cao trong môi trường ngập nước.',
    content: `<p>Trong hơn 20 năm cung cấp cừ tràm cho các công trình tại TP.HCM và khu vực Nam Bộ, chúng tôi nhận thấy cừ tràm vẫn là lựa chọn hàng đầu cho việc gia cố nền móng nhà phố, nhà cấp 4 và các công trình dân dụng quy mô vừa.</p>
<h3>Vì sao chọn cừ tràm?</h3>
<ul>
  <li>Chi phí thấp hơn 30-50% so với cọc bê tông cốt thép cho cùng tải trọng nhỏ.</li>
  <li>Khi đóng vào nền đất sét yếu ngập nước, cừ tràm gần như không bị mục, tuổi thọ có thể trên 60 năm.</li>
  <li>Thi công nhanh, không cần máy móc lớn, phù hợp các con hẻm nhỏ.</li>
</ul>
<h3>Mật độ đóng cừ phổ biến</h3>
<p>Mật độ thường gặp là 16, 25 hoặc 36 cây/m² tùy vào tải trọng công trình và đặc điểm địa chất. Với nhà phố 3-4 tầng trên nền đất yếu, mật độ 25 cây/m² là phương án cân bằng giữa chi phí và độ an toàn.</p>`,
  },
  {
    title: 'Phân biệt cừ tràm loại 1, loại 2 và cách chọn đúng',
    excerpt: 'Không phải cây cừ tràm nào cũng giống nhau. Hiểu đúng phân loại giúp bạn không bị đội giá và đảm bảo chất lượng công trình.',
    content: `<p>Trên thị trường hiện nay cừ tràm thường được phân loại theo đường kính gốc, độ thẳng và độ tươi của cây. Bài viết này giúp chủ đầu tư và nhà thầu chọn đúng loại cho từng nhu cầu.</p>
<h3>Cừ tràm loại 1</h3>
<p>Đường kính gốc 8-12cm, dài 4-4.5m, thân thẳng, vỏ còn tươi, không cong vênh. Đây là loại được tuyển chọn cho công trình nhà phố, nhà xưởng nhỏ.</p>
<h3>Cừ tràm loại 2</h3>
<p>Đường kính 6-8cm, có thể hơi cong nhẹ, thường dùng cho công trình tạm, kè bờ, hàng rào.</p>
<h3>Lưu ý khi mua</h3>
<ul>
  <li>Yêu cầu xem hàng tận nơi hoặc ảnh thực tế trước khi đặt cọc.</li>
  <li>Hỏi rõ đơn vị tính: cây hay m³, tránh nhầm lẫn khi so giá.</li>
  <li>Thoả thuận rõ phí vận chuyển và phí bốc dỡ tại công trình.</li>
</ul>`,
  },
  {
    title: 'Báo giá cừ tràm tháng này tại TP.HCM và các tỉnh lân cận',
    excerpt: 'Tham khảo nhanh khoảng giá cừ tràm, cừ bạch đàn, cừ dừa và lá dừa nước cập nhật mới nhất, áp dụng cho khu vực TP.HCM, Bình Dương, Long An, Đồng Nai.',
    content: `<p>Bảng giá dưới đây mang tính tham khảo, giá thực tế phụ thuộc vào số lượng, kích thước và vị trí giao hàng. Vui lòng gọi hotline để nhận báo giá chính xác trong ngày.</p>
<table>
  <tr><th>Sản phẩm</th><th>Quy cách</th><th>Giá tham khảo</th></tr>
  <tr><td>Cừ tràm loại 1</td><td>4.0 - 4.5m, ĐK 8-12cm</td><td>Liên hệ</td></tr>
  <tr><td>Cừ bạch đàn</td><td>3 - 6m</td><td>Liên hệ</td></tr>
  <tr><td>Cừ dừa</td><td>5 - 8m</td><td>Liên hệ</td></tr>
  <tr><td>Lá dừa nước</td><td>Bó tiêu chuẩn</td><td>Liên hệ</td></tr>
</table>
<p>Miễn phí vận chuyển nội thành TP.HCM với đơn từ 500 cây. Hỗ trợ giao trong ngày.</p>`,
  },
];

const activitiesSeed = [
  { title: 'Cung cấp cừ tràm công trình nhà phố Quận 7', description: 'Đóng cừ gia cố nền móng nhà 4 tầng, mật độ 25 cây/m².', image_url: 'https://images.unsplash.com/photo-1590725140246-20acdee442be?w=1200&q=80', location: 'Quận 7, TP.HCM' },
  { title: 'Giao cừ bạch đàn xưởng Bình Dương', description: 'Lô 2.000 cây cừ bạch đàn dài 5m cho xưởng cơ khí.', image_url: 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=1200&q=80', location: 'Thuận An, Bình Dương' },
  { title: 'Đóng cừ kè bờ kênh Long An', description: 'Thi công kè bờ kênh dài 120m bằng cừ dừa 6m.', image_url: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=1200&q=80', location: 'Bến Lức, Long An' },
  { title: 'Giao lá dừa nước lợp nhà mái', description: 'Cung cấp lá dừa nước cho khu du lịch sinh thái.', image_url: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=1200&q=80', location: 'Củ Chi, TP.HCM' },
  { title: 'Cừ tràm công trình Đồng Nai', description: 'Đóng cừ móng nhà xưởng diện tích 800m².', image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80', location: 'Biên Hòa, Đồng Nai' },
  { title: 'Cừ dừa kè ao nuôi tôm Tây Ninh', description: 'Hỗ trợ kè bờ ao 0.5ha bằng cừ dừa 7m.', image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80', location: 'Trảng Bàng, Tây Ninh' },
];

async function run() {
  await ensureSchema();
  const db = getDb();

  const existing = await db.execute('SELECT COUNT(*) as c FROM news');
  if (existing.rows[0].c > 0) {
    console.log('[seed] Data already exists, skipping');
    return;
  }

  for (const n of newsSeed) {
    const slug = slugify(n.title, { lower: true, strict: true, locale: 'vi' });
    await db.execute({
      sql: 'INSERT INTO news (slug, title, excerpt, content, published) VALUES (?, ?, ?, ?, 1)',
      args: [slug, n.title, n.excerpt, n.content],
    });
  }

  for (const a of activitiesSeed) {
    await db.execute({
      sql: 'INSERT INTO activities (title, description, image_url, location) VALUES (?, ?, ?, ?)',
      args: [a.title, a.description, a.image_url, a.location],
    });
  }

  console.log('[seed] Inserted', newsSeed.length, 'news +', activitiesSeed.length, 'activities');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
