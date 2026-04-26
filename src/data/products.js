// Du lieu san pham tinh - 4 loai chinh, hiem khi thay doi
// Anh dung Unsplash placeholder, sau co the thay bang anh that

export const products = [
  {
    slug: 'cu-tram',
    name: 'Cừ tràm',
    tagline: 'Gia cố nền móng - tuổi thọ 60+ năm',
    short: 'Cừ tràm loại 1 tuyển chọn, dài 3.7-4.5m, đường kính gốc 8-12cm. Thân thẳng, vỏ tươi, đảm bảo chất lượng cho công trình nhà phố, nhà xưởng.',
    cover: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1448630360428-65456885c650?w=1200&q=80',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80',
      'https://images.unsplash.com/photo-1590725140246-20acdee442be?w=1200&q=80',
    ],
    specs: [
      { label: 'Chiều dài', value: '3.7m - 4.5m' },
      { label: 'Đường kính gốc', value: '8 - 12 cm' },
      { label: 'Đường kính ngọn', value: '4 - 6 cm' },
      { label: 'Độ tươi', value: 'Vỏ còn xanh, mới khai thác' },
      { label: 'Đơn vị', value: 'Cây / m³' },
    ],
    pricing: [
      { type: 'Cừ tràm loại 1', size: '4.0 - 4.5m, ĐK 10-12cm', unit: 'cây', note: 'Liên hệ' },
      { type: 'Cừ tràm loại 1', size: '3.7 - 4.0m, ĐK 8-10cm', unit: 'cây', note: 'Liên hệ' },
      { type: 'Cừ tràm loại 2', size: '3.0 - 3.5m', unit: 'cây', note: 'Liên hệ' },
    ],
    applications: [
      'Gia cố nền móng nhà phố, nhà cấp 4',
      'Móng cọc cho nhà xưởng quy mô vừa',
      'Đóng kè bờ ao, bờ kênh chống sạt lở',
      'Làm đà giáo, cốp pha trong xây dựng',
    ],
    advantages: [
      'Bền trên 60 năm khi đóng vào nền đất ngập nước',
      'Thi công nhanh, không cần máy móc lớn',
      'Chi phí thấp hơn 30-50% so với cọc bê tông',
      'Phù hợp địa hình hẻm nhỏ, xe lớn không vào được',
    ],
  },
  {
    slug: 'cu-bach-dan',
    name: 'Cừ bạch đàn',
    tagline: 'Cứng cáp - giá rẻ - giao số lượng lớn',
    short: 'Cừ bạch đàn các loại 3-6m, thân thẳng, gỗ cứng. Phù hợp công trình cần độ cứng cao, làm cọc chống, cọc xây dựng tạm.',
    cover: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=1200&q=80',
      'https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=1200&q=80',
    ],
    specs: [
      { label: 'Chiều dài', value: '3m - 6m' },
      { label: 'Đường kính gốc', value: '8 - 15 cm' },
      { label: 'Loại gỗ', value: 'Bạch đàn trắng / đỏ' },
      { label: 'Đơn vị', value: 'Cây / m³' },
    ],
    pricing: [
      { type: 'Cừ bạch đàn 3m', size: 'ĐK 8-10cm', unit: 'cây', note: 'Liên hệ' },
      { type: 'Cừ bạch đàn 4-5m', size: 'ĐK 10-12cm', unit: 'cây', note: 'Liên hệ' },
      { type: 'Cừ bạch đàn 6m', size: 'ĐK 12-15cm', unit: 'cây', note: 'Liên hệ' },
    ],
    applications: [
      'Cọc chống cho công trình tạm',
      'Cốp pha, đà giáo',
      'Cọc neo, cọc tiêu',
      'Hàng rào, công trình nông nghiệp',
    ],
    advantages: [
      'Gỗ cứng, chịu lực tốt hơn cừ tràm',
      'Giá thành phải chăng',
      'Cung cấp được số lượng lớn, giao trong ngày',
      'Miễn phí vận chuyển nội thành TP.HCM',
    ],
  },
  {
    slug: 'cu-dua',
    name: 'Cừ dừa',
    tagline: 'Bền nước - chuyên kè bờ',
    short: 'Cừ dừa dài 5m, 6m, 7m, 8m. Thân thẳng đặc trưng, chống mục nước cực tốt, là lựa chọn số 1 cho kè bờ kênh, ao nuôi thủy sản.',
    cover: 'https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
      'https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=1200&q=80',
    ],
    specs: [
      { label: 'Chiều dài', value: '5m / 6m / 7m / 8m' },
      { label: 'Đường kính', value: '15 - 25 cm' },
      { label: 'Đặc tính', value: 'Chịu nước, chống mục cực tốt' },
      { label: 'Đơn vị', value: 'Cây' },
    ],
    pricing: [
      { type: 'Cừ dừa 5m', size: 'ĐK 15-18cm', unit: 'cây', note: 'Liên hệ' },
      { type: 'Cừ dừa 6m', size: 'ĐK 18-20cm', unit: 'cây', note: 'Liên hệ' },
      { type: 'Cừ dừa 7m', size: 'ĐK 20-22cm', unit: 'cây', note: 'Liên hệ' },
      { type: 'Cừ dừa 8m', size: 'ĐK 22-25cm', unit: 'cây', note: 'Liên hệ' },
    ],
    applications: [
      'Kè bờ kênh, bờ sông chống sạt lở',
      'Kè ao nuôi tôm, cá',
      'Cọc móng công trình ven sông',
      'Cọc trang trí nhà hàng, resort sinh thái',
    ],
    advantages: [
      'Tuổi thọ rất cao trong môi trường nước',
      'Đường kính lớn, chịu lực ngang tốt',
      'Vận chuyển và thi công bằng cẩu chuyên dụng',
      'Cung cấp đủ size theo yêu cầu công trình',
    ],
  },
  {
    slug: 'la-dua-nuoc',
    name: 'Lá dừa nước',
    tagline: 'Mái lá truyền thống - mát mẻ tự nhiên',
    short: 'Lá dừa nước tươi, bền màu, dùng lợp mái nhà chòi, quán cà phê sân vườn, khu du lịch sinh thái. Giao tận nơi toàn TP.HCM và lân cận.',
    cover: 'https://images.unsplash.com/photo-1510629389923-69aedf07c5e7?w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=1200&q=80',
      'https://images.unsplash.com/photo-1505159940484-eb2b9f2588e2?w=1200&q=80',
    ],
    specs: [
      { label: 'Chiều dài lá', value: '1.5m - 2m' },
      { label: 'Đóng bó', value: 'Bó tiêu chuẩn 50 lá' },
      { label: 'Tuổi thọ mái', value: '3 - 5 năm' },
      { label: 'Đơn vị', value: 'Bó / tấm' },
    ],
    pricing: [
      { type: 'Lá dừa nước tươi', size: 'Bó 50 lá', unit: 'bó', note: 'Liên hệ' },
      { type: 'Tấm lá đã chầm', size: '1m x 2m', unit: 'tấm', note: 'Liên hệ' },
    ],
    applications: [
      'Lợp mái nhà chòi, nhà sàn',
      'Lợp quán cà phê, nhà hàng sân vườn',
      'Khu du lịch sinh thái, resort',
      'Trang trí sự kiện theo phong cách miền Tây',
    ],
    advantages: [
      'Mát mẻ tự nhiên hơn mái tôn 5-7°C',
      'Thân thiện môi trường',
      'Giá rẻ, dễ thi công',
      'Tạo không gian truyền thống, gần gũi',
    ],
  },
];

export const productsBySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
