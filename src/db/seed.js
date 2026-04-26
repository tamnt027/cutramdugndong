import { getDb } from './client.js';
import { ensureSchema } from './schema.js';
import slugify from 'slugify';

// 3 bai viet duoc lay tu trang cu bancutramdungdong.com va mo rong them noi dung
const newsSeed = [
  {
    title: 'Giá cừ tràm ở TPHCM',
    cover: '/img/site/news/news-1.jpg',
    excerpt: 'Vựa cừ tràm Dũng Đông chuyên cung cấp cừ tràm, cừ bạch đàn, cừ dừa và lá dừa nước cho công trình tại TP.HCM. Giá dao động từ 10.000 - 15.000đ/cây tùy kích thước.',
    content: `<p>Vựa cừ tràm <strong>Dũng Đông</strong> chuyên cung cấp các sản phẩm gỗ xây dựng bao gồm cừ tràm, cừ bạch đàn, cừ dừa và lá dừa nước cho các công trình xây dựng và cầu đường tại TP.HCM cùng các tỉnh lân cận.</p>

<h3>Mức giá cừ tràm hiện nay</h3>
<p>Giá cừ tràm tại TPHCM hiện nay dao động từ <strong>10.000 - 15.000 đồng/cây</strong>, tùy thuộc vào đường kính và kích thước của sản phẩm. Giá có thể được điều chỉnh dựa trên vị trí công trình và khối lượng đặt hàng.</p>

<h3>Phân khúc giá theo loại cừ</h3>
<ul>
  <li><strong>Cừ tràm loại 1</strong> (4.0-4.5m, ĐK 10-12cm): mức giá cao hơn vì đã được tuyển chọn kỹ, thân thẳng đẹp.</li>
  <li><strong>Cừ tràm loại 2</strong> (3.0-3.5m, ĐK nhỏ): giá thấp hơn 30-40%, phù hợp công trình tạm.</li>
  <li><strong>Cừ bạch đàn</strong>: giá tương đương cừ tràm cùng kích thước, gỗ cứng hơn.</li>
  <li><strong>Cừ dừa</strong>: tính theo cây, đường kính lớn nên giá cao hơn cừ tràm.</li>
</ul>

<h3>Phạm vi phục vụ</h3>
<p>Công ty cung cấp cừ tràm cho các khu vực <strong>Hồ Chí Minh, Bình Dương, Đồng Nai, Long An</strong> và toàn bộ Đông Nam Bộ, Miền Tây. Miễn phí vận chuyển nội thành TP.HCM cho đơn từ 500 cây.</p>

<h3>Liên hệ báo giá</h3>
<ul>
  <li>Hotline: <strong>0909 866 929</strong></li>
  <li>Email: congtydungdong@gmail.com</li>
  <li>Địa chỉ: 5H11/1, ấp 17, Xã Tân Vĩnh Lộc, TP.HCM</li>
</ul>

<p>Gọi hotline hoặc gửi yêu cầu báo giá trên website để nhận báo giá chính xác trong vòng 30 phút.</p>`,
  },
  {
    title: 'Giá cừ tràm - Thông tin chi tiết và phân loại',
    cover: '/img/site/news/news-2.jpg',
    excerpt: 'Cừ tràm là cây tràm có thân thẳng dài, dùng để đóng cọc, gia cố nền móng trong xây dựng. Bài viết hướng dẫn phân biệt và chọn cừ tràm phù hợp với từng loại công trình.',
    content: `<p><strong>Cừ tràm</strong> là cây tràm có thân thẳng dài, được khai thác ở độ tuổi trưởng thành để sử dụng đóng cọc, gia cố nền móng trong xây dựng. Sản phẩm có nhiều kích thước và đường kính khác nhau tùy theo nhu cầu công trình.</p>

<h3>Đặc điểm cừ tràm chất lượng</h3>
<ul>
  <li><strong>Thân thẳng</strong>: không bị cong vênh, không xoắn ngọn.</li>
  <li><strong>Đường kính đồng đều</strong>: gốc 8-12cm cho cừ loại 1, ngọn 4-6cm.</li>
  <li><strong>Vỏ còn tươi</strong>: vỏ xanh hoặc nâu nhạt, chưa khô nứt.</li>
  <li><strong>Chiều dài chuẩn</strong>: 3.7-4.5m cho công trình nhà phố.</li>
  <li><strong>Không sâu mục</strong>: thân chắc, gõ vào nghe tiếng đặc.</li>
</ul>

<h3>Cam kết của Dũng Đông</h3>
<p>Công Ty TNHH Thương Mại Dũng Đông cung cấp cừ tràm với những đặc điểm:</p>
<ul>
  <li>Nhiều năm kinh nghiệm trong lĩnh vực cung cấp cừ tràm</li>
  <li>Đảm bảo chất lượng cao, tuyển chọn từ nguồn</li>
  <li>Đường kính lớn, chắc bền</li>
  <li>Giá cạnh tranh trên thị trường</li>
  <li>Cung ứng số lượng lớn, không phụ thuộc mùa khai thác</li>
  <li>Giao hàng tận nơi toàn TP.HCM và lân cận</li>
</ul>

<h3>Cách chọn cừ tràm cho từng công trình</h3>
<p>Mỗi loại công trình cần loại cừ tràm khác nhau:</p>
<ul>
  <li><strong>Nhà phố 2-4 tầng</strong>: cừ tràm loại 1 dài 4-4.5m, mật độ 25 cây/m².</li>
  <li><strong>Nhà cấp 4 nhỏ</strong>: cừ tràm loại 1 hoặc 2 dài 3.5-4m, mật độ 16 cây/m².</li>
  <li><strong>Kè bờ kênh, bờ ao</strong>: nên dùng cừ dừa thay vì cừ tràm vì chịu nước tốt hơn.</li>
  <li><strong>Đà giáo, cốp pha</strong>: cừ bạch đàn hoặc cừ tràm loại 2 đủ dùng.</li>
</ul>

<h3>Sản phẩm liên quan</h3>
<p>Ngoài cừ tràm, Dũng Đông còn cung cấp <strong>cừ bạch đàn, cừ dừa, lá dừa nước</strong> cho mọi nhu cầu xây dựng và trang trí.</p>

<h3>Liên hệ tư vấn</h3>
<ul>
  <li>Địa chỉ: 5H11/1, ấp 17, Xã Tân Vĩnh Lộc, TP.HCM</li>
  <li>Hotline: <strong>0909 866 929</strong></li>
  <li>Email: congtydungdong@gmail.com</li>
</ul>`,
  },
  {
    title: 'Giá cừ tràm năm 2023 tại TPHCM - Cập nhật mới nhất',
    cover: '/img/site/news/news-3.jpg',
    excerpt: 'Giá cừ tràm thô năm 2023 tại TPHCM dao động từ 8.000 - 15.000 đồng/cây, chưa bao gồm chi phí đóng cọc. Chiết khấu lên đến 10% cho khách hàng mua số lượng lớn.',
    content: `<p>Công ty TNHH Thương Mại <strong>Dũng Đông</strong> chuyên cung cấp cừ tràm xây dựng tại TPHCM với hơn 20 năm kinh nghiệm. Bài viết này tổng hợp thông tin giá cừ tràm cập nhật mới nhất tại TP.HCM năm 2023.</p>

<h3>Giá bán cừ tràm năm 2023</h3>
<p>Giá cừ tràm thô trong năm 2023 dao động từ <strong>8.000 đến 15.000 đồng/cây</strong>, chưa bao gồm chi phí đóng cọc. Mức giá thay đổi tùy theo:</p>
<ul>
  <li>Đường kính cây (gốc và ngọn)</li>
  <li>Chiều dài thực tế</li>
  <li>Loại 1 hoặc loại 2</li>
  <li>Vị trí giao hàng</li>
  <li>Số lượng đặt mua</li>
</ul>

<h3>Bảng tham khảo nhanh</h3>
<table>
  <tr><th>Loại cừ tràm</th><th>Quy cách</th><th>Khoảng giá tham khảo</th></tr>
  <tr><td>Loại 1 cao cấp</td><td>4-4.5m, ĐK 10-12cm</td><td>13.000 - 15.000đ/cây</td></tr>
  <tr><td>Loại 1 phổ thông</td><td>3.7-4m, ĐK 8-10cm</td><td>10.000 - 13.000đ/cây</td></tr>
  <tr><td>Loại 2</td><td>3-3.5m</td><td>8.000 - 10.000đ/cây</td></tr>
</table>

<h3>Chính sách giá ưu đãi</h3>
<p>Công ty áp dụng các chính sách ưu đãi để khách hàng được giá tốt nhất:</p>
<ul>
  <li><strong>Chiết khấu theo số lượng</strong>: lên đến 10% trên tổng hóa đơn cho khách hàng mua số lượng lớn (từ 1.000 cây).</li>
  <li><strong>Miễn phí vận chuyển</strong> nội thành TP.HCM cho đơn từ 500 cây.</li>
  <li><strong>Giá càng rẻ khi đặt mua số lượng lớn</strong>, đặc biệt là đơn nhà thầu.</li>
  <li>Chi phí đóng cọc phụ thuộc vào vị trí và nền đất thi công, thường thỏa thuận trực tiếp với đội thi công.</li>
</ul>

<h3>Sản phẩm và dịch vụ</h3>
<p>Công ty cung cấp các loại sản phẩm gỗ gồm: <strong>cừ tràm, cừ bạch đàn, cừ dừa, lá dừa nước</strong>. Bên cạnh đó là dịch vụ:</p>
<ul>
  <li>Tư vấn loại cừ và mật độ đóng phù hợp công trình</li>
  <li>Vận chuyển tận công trình</li>
  <li>Bốc dỡ tại chỗ với cẩu chuyên dụng</li>
  <li>Liên kết đội thi công đóng ép cừ tràm trực tiếp tại công trình</li>
</ul>

<h3>Liên hệ báo giá nhanh</h3>
<p>Để có giá chính xác cho công trình của bạn, vui lòng liên hệ:</p>
<ul>
  <li>Hotline: <strong>0909 866 929</strong> (zalo cùng số)</li>
  <li>Email: congtydungdong@gmail.com</li>
  <li>Địa chỉ: 5H11/1, ấp 17, Xã Tân Vĩnh Lộc, TP.HCM</li>
</ul>

<blockquote>Báo giá miễn phí trong vòng 30 phút sau khi nhận được yêu cầu của khách.</blockquote>`,
  },
];

const activitiesSeed = [
  { title: 'Bãi cừ tràm Dũng Đông tại Bình Chánh', description: 'Kho hàng cừ tràm số lượng lớn, sẵn sàng giao đi các công trình.', image_url: '/img/site/activities/yard-1.jpg', location: 'Bình Chánh, TP.HCM' },
  { title: 'Cung cấp cừ tràm loại 1', description: 'Lô cừ tràm loại 1 thân thẳng, đường kính đồng đều, đã tuyển chọn kỹ.', image_url: '/img/site/activities/yard-9.jpg', location: 'TP.HCM' },
  { title: 'Tập kết cừ tràm tại bãi', description: 'Cừ tràm được phân loại và bó gọn theo kích thước trước khi giao.', image_url: '/img/site/activities/yard-2.jpg', location: 'Tân Vĩnh Lộc' },
  { title: 'Giao cừ tràm cho công trình', description: 'Xe tải chuyên dụng vận chuyển cừ tràm tới công trình khách hàng.', image_url: '/img/site/activities/yard-3.jpg', location: 'Quận 7, TP.HCM' },
  { title: 'Đóng cừ tràm gia cố nền móng', description: 'Đội thi công đóng cừ tràm cho công trình nhà phố mật độ 25 cây/m².', image_url: '/img/site/activities/yard-4.jpg', location: 'Bình Dương' },
  { title: 'Cừ tràm loại 2 cho công trình tạm', description: 'Cừ tràm loại 2 phục vụ các công trình hàng rào, kè tạm.', image_url: '/img/site/activities/yard-7.jpg', location: 'Long An' },
  { title: 'Bốc dỡ cừ tại công trình', description: 'Hỗ trợ bốc dỡ cừ tràm tại chân công trình, kiểm hàng trước khi nhận.', image_url: '/img/site/activities/yard-5.jpg', location: 'Đồng Nai' },
  { title: 'Khu vực phân loại cừ', description: 'Cừ tràm được phân loại theo đường kính và độ thẳng trước khi xuất bãi.', image_url: '/img/site/activities/yard-6.jpg', location: 'TP.HCM' },
  { title: 'Cừ tràm tại bãi Dũng Đông', description: 'Số lượng lớn cừ tràm các kích cỡ luôn có sẵn tại bãi.', image_url: '/img/site/activities/yard-8.jpg', location: 'Bình Chánh, TP.HCM' },
  { title: 'Cừ tràm chuẩn bị giao đi', description: 'Lô cừ tràm đã được tuyển chọn, bó gọn, sẵn sàng lên xe.', image_url: '/img/site/activities/yard-10.jpg', location: 'TP.HCM' },
  { title: 'Hoạt động bán hàng tại bãi', description: 'Khách hàng đến tham quan và lựa chọn cừ trực tiếp tại bãi.', image_url: '/img/site/activities/yard-11.jpg', location: 'Tân Vĩnh Lộc' },
  { title: 'Cừ tràm xếp gọn theo lô', description: 'Cừ tràm được xếp gọn gàng theo lô, dễ kiểm đếm và xuất hàng.', image_url: '/img/site/activities/yard-12.jpg', location: 'TP.HCM' },
];

async function run() {
  await ensureSchema();
  const db = getDb();

  const existing = await db.execute('SELECT COUNT(*) as c FROM news');
  const existingActs = await db.execute('SELECT COUNT(*) as c FROM activities');

  if (existing.rows[0].c > 0 || existingActs.rows[0].c > 0) {
    console.log('[seed] Existing data found. Clearing news + activities...');
    await db.execute('DELETE FROM news');
    await db.execute('DELETE FROM activities');
  }

  for (const n of newsSeed) {
    const slug = slugify(n.title, { lower: true, strict: true, locale: 'vi' });
    await db.execute({
      sql: 'INSERT INTO news (slug, title, excerpt, content, cover_url, published) VALUES (?, ?, ?, ?, ?, 1)',
      args: [slug, n.title, n.excerpt, n.content, n.cover || null],
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
