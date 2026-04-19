export const categories = [
  { 
    id: 'phones', 
    name: 'Phones', 
    icon: 'Smartphone',
    subcategories: ['iPhones', 'Samsung Galaxy', 'Google Pixel', 'Xiaomi', 'Oppo', 'Tecno', 'Infinix', 'Ex-UK Used']
  },
  { 
    id: 'tablets', 
    name: 'Tablets', 
    icon: 'Tablet',
    subcategories: ['iPads', 'Android Tablets', 'Kids Tablets']
  },
  { 
    id: 'computing', 
    name: 'Computing', 
    icon: 'Laptop',
    subcategories: ['MacBooks', 'Laptops', 'iMacs']
  },
  { 
    id: 'audio', 
    name: 'Audio', 
    icon: 'Speaker',
    subcategories: ['Earbuds', 'Headphones', 'Speakers']
  },
  { 
    id: 'wearables', 
    name: 'Wearables', 
    icon: 'Watch',
    subcategories: ['Smartwatches', 'Smart Bands']
  },
  { 
    id: 'gaming', 
    name: 'Gaming', 
    icon: 'Gamepad2',
    subcategories: ['PS5', 'Xbox', 'Nintendo', 'Accessories']
  },
  { 
    id: 'entertainment', 
    name: 'Entertainment', 
    icon: 'Monitor',
    subcategories: ['TV Sticks', 'Projectors']
  },
  { 
    id: 'accessories', 
    name: 'Accessories', 
    icon: 'Headphones',
    subcategories: ['Chargers & Cables', 'Power Banks', 'Cases & Screen', 'Storage']
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: 'Camera',
    subcategories: ['Cameras', 'Lens', 'Drones', 'Gimbals']
  }
];

export const brands = [
  'Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Tecno', 'Infinix', 'Sony', 'JBL', 'Google', 'Anker', 'SanDisk', 'Logitech', 'Keychron', 'UGREEN', 'Razer', 'Bose', 'Sennheiser', 'Marshall', 'Beats', 'Garmin', 'Huawei', 'Amazfit', 'Fitbit', 'Casio', 'Suunto', 'Lenovo', 'Microsoft', 'Amazon', 'HP', 'ASUS', 'Acer', 'MSI', 'Nintendo', 'Valve', 'SteelSeries', 'Oraimo'
];

export const heroBanners = [
  {
    id: 1,
    title: 'iPhone 17 Pro Max',
    subtitle: 'The future of mobile innovation is here.',
    bg: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop',
    link: '/shop?brand=apple'
  },
  {
    id: 2,
    title: 'Samsung Galaxy S25 Ultra',
    subtitle: 'Redefining what a smartphone can do.',
    bg: 'https://images.unsplash.com/photo-1706148332115-46fdbfbabd4a?q=80&w=1200&auto=format&fit=crop',
    link: '/shop?brand=samsung'
  },
  {
    id: 3,
    title: 'PlayStation 5 Slim',
    subtitle: 'New look. Same power.',
    bg: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1200&auto=format&fit=crop',
    link: '/shop?category=gaming'
  }
];

export const products = [
  // --- PHONES ---
  {
    id: 'p1',
    name: 'iPhone 17 Pro Max',
    brand: 'Apple',
    category: 'phones',
    subcategory: 'iPhones',
    price: 210000,
    oldPrice: 225000,
    image: 'https://i.pinimg.com/736x/9a/cd/80/9acd80fde83863f692d3349470013137.jpg',
    isNew: true,
    rating: 4.9,
    reviews: 312,
    condition: 'New',
    flags: { isHotDeal: true, isFeatured: true },
    specs: ['A17 Pro Chip', '48MP Camera', '6.7" XDR Display']
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S25 Ultra',
    brand: 'Samsung',
    category: 'phones',
    subcategory: 'Samsung Galaxy',
    price: 185000,
    oldPrice: 195000,
    image: 'https://i.pinimg.com/736x/d8/e6/9f/d8e69f9b36b7a2cf0a3add6d0d83498a.jpg',
    isNew: true,
    rating: 4.8,
    reviews: 124,
    condition: 'New',
    flags: { isHotDeal: true, isFeatured: true },
    specs: ['Snapdragon 8 Gen 3', '200MP Camera', 'S-Pen Included']
  },
  {
    id: 'p3',
    name: 'Google Pixel 8 Pro',
    brand: 'Google',
    category: 'phones',
    subcategory: 'Google Pixel',
    price: 145000,
    image: 'https://i.pinimg.com/736x/8e/5e/19/8e5e19f0c3be60523a5227cee7de13ec.jpg',
    isNew: true,
    rating: 4.7,
    reviews: 88,
    condition: 'New',
    flags: { isNewArrival: true },
    specs: ['Tensor G3', 'Best-in-class Camera', 'AI integration']
  },
  {
    id: 'p4',
    name: 'iPhone 13 128GB (Ex-UK)',
    brand: 'Apple',
    category: 'phones',
    subcategory: 'Ex-UK Used',
    price: 85000,
    oldPrice: 95000,
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=800&auto=format&fit=crop',
    isNew: false,
    rating: 4.6,
    reviews: 56,
    condition: 'Ex-UK Used',
    flags: { isOffer: true },
    specs: ['Grade A', 'Battery 90%+', '6 Months Warranty']
  },
  {
    id: 'p5',
    name: 'Xiaomi 14 Ultra',
    brand: 'Xiaomi',
    category: 'phones',
    subcategory: 'Xiaomi',
    price: 165000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    rating: 4.8,
    reviews: 42,
    condition: 'New',
    specs: ['Leica Optics', 'Snapdragon 8 Gen 3', '90W Fast Charging']
  },
  {
    id: 'p10',
    name: 'Xiaomi 17 Pro',
    brand: 'Xiaomi',
    category: 'phones',
    subcategory: 'Xiaomi',
    price: 95000,
    oldPrice: 105000,
    image: 'https://i.pinimg.com/1200x/74/da/de/74dade62789f9ad72bf6ea604ede8aa4.jpg',
    isNew: true,
    flags: { isHotDeal: true },
    specs: ['Leica Next-Gen Optics', 'Snapdragon 8 Gen 4', '120W HyperCharge']
  },
  {
    id: 'p6',
    name: 'Tecno Camon 40 Pro',
    brand: 'Tecno',
    category: 'phones',
    subcategory: 'Tecno',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    condition: 'New',
    specs: ['512GB Storage', '12GB RAM', 'PolarAce Imaging']
  },
  {
    id: 'p7',
    name: 'Oppo Reno 11 5G',
    brand: 'Oppo',
    category: 'phones',
    subcategory: 'Oppo',
    price: 68000,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    condition: 'New',
    specs: ['32MP Telephoto', 'Dimensity 7050', '67W SUPERVOOC']
  },
  {
    id: 'p8',
    name: 'Infinix Note 50 Pro+',
    brand: 'Infinix',
    category: 'phones',
    subcategory: 'Infinix',
    price: 42000,
    image: 'https://images.unsplash.com/photo-1565849906461-0e443530e24c?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    condition: 'New',
    specs: ['70W Multi-Speed FastCharge', '120Hz Curved AMOLED']
  },

  // --- TABLETS ---
  {
    id: 't1',
    name: 'iPad Pro M2 12.9" 256GB',
    brand: 'Apple',
    category: 'tablets',
    subcategory: 'iPads',
    price: 215000,
    image: 'https://i.pinimg.com/736x/ab/1d/74/ab1d7409d927a3b8146d210a16fd7afb.jpg',
    isNew: true,
    condition: 'New',
    flags: { isFeatured: true },
    specs: ['Liquid Retina XDR', 'Apple M2 Chip', 'Apple Pencil Hover']
  },
  {
    id: 't2',
    name: 'Samsung Galaxy Tab S9 Ultra',
    brand: 'Samsung',
    category: 'tablets',
    subcategory: 'Android Tablets',
    price: 165000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    condition: 'New',
    specs: ['14.6" Dynamic AMOLED', 'Snapdragon 8 Gen 2', 'IP68 Water Resistance']
  },
  {
    id: 't3',
    name: 'ElimuTab Kids Tablet',
    brand: 'ElimuTab',
    category: 'tablets',
    subcategory: 'Kids Tablets',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    condition: 'New',
    specs: ['Parental Control', 'Educational Content', 'Durable Case']
  },

  // --- COMPUTING ---
  {
    id: 'c1',
    name: 'MacBook Air M3 13"',
    brand: 'Apple',
    category: 'computing',
    subcategory: 'MacBooks',
    price: 185000,
    image: 'https://i.pinimg.com/736x/f1/46/76/f146768d0ed21c5b0710ab5982dc9a52.jpg',
    isNew: true,
    condition: 'New',
    flags: { isHotDeal: true },
    specs: ['M3 Chip', '8-Core GPU', '18 Hours Battery Life']
  },
  {
    id: 'c2',
    name: 'HP Spectre x360 14',
    brand: 'HP',
    category: 'computing',
    subcategory: 'Laptops',
    price: 225000,
    image: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    condition: 'New',
    specs: ['Intel Core Ultra 7', '2.8K OLED Touch', '2-in-1 Design']
  },

  // --- AUDIO ---
  {
    id: 'a1',
    name: 'AirPods Pro Gen 2 (USB-C)',
    brand: 'Apple',
    category: 'audio',
    subcategory: 'Earbuds',
    price: 38000,
    image: 'https://i.pinimg.com/736x/0c/70/88/0c70889624de9327adac6b4899ba6b6d.jpg',
    isNew: true,
    condition: 'New',
    specs: ['H2 Chip', 'Active Noise Cancellation', 'Find My integration']
  },
  {
    id: 'a2',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    category: 'audio',
    subcategory: 'Headphones',
    price: 49500,
    image: 'https://i.pinimg.com/736x/ea/f3/1f/eaf31fd791f9a630fd2863f87e887e4e.jpg',
    isNew: true,
    condition: 'New',
    specs: ['Industry-leading ANC', 'Multi-point connection', '30h Battery']
  },
  {
    id: 'a3',
    name: 'JBL PartyBox 110',
    brand: 'JBL',
    category: 'audio',
    subcategory: 'Speakers',
    price: 65000,
    image: 'https://i.pinimg.com/736x/5e/5b/2b/5e5b2b7bc73f75f5518946f763c18a0f.jpg',
    isNew: true,
    condition: 'New',
    specs: ['160W Sound', 'Pulsing RGB Lights', 'IPX4 Splashproof']
  },

  // --- WEARABLES ---
  {
    id: 'w1',
    name: 'Apple Watch Ultra 2',
    brand: 'Apple',
    category: 'wearables',
    subcategory: 'Smartwatches',
    price: 135000,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    condition: 'New',
    specs: ['Titanium Case', 'Dual-frequency GPS', '36-hour Battery']
  },
  {
    id: 'w2',
    name: 'Oraimo Watch 4 Plus',
    brand: 'Oraimo',
    category: 'wearables',
    subcategory: 'Smartwatches',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    condition: 'New',
    specs: ['Bluetooth Calling', '100+ Sports Modes', '2.01" HD Screen']
  },

  // --- GAMING ---
  {
    id: 'g1',
    name: 'PS5 Slim Console',
    brand: 'Sony',
    category: 'gaming',
    subcategory: 'PS5',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    condition: 'New',
    flags: { isBestseller: true },
    specs: ['1TB SSD', 'Ray Tracing', 'Up to 120fps']
  },
  {
    id: 'g2',
    name: 'Nintendo Switch OLED',
    brand: 'Nintendo',
    category: 'gaming',
    subcategory: 'Nintendo',
    price: 52000,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    condition: 'New',
    specs: ['7" OLED Screen', '64GB Storage', 'Wired LAN Port']
  },

  // --- ENTERTAINMENT ---
  {
    id: 'e1',
    name: 'Xiaomi Mi TV Stick 4K',
    brand: 'Xiaomi',
    category: 'entertainment',
    subcategory: 'TV Sticks',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1557825835-70d06733c734?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    condition: 'New',
    specs: ['Android TV 11', 'Dolby Atmos', 'Built-in Chromecast']
  },
  {
    id: 'e2',
    name: 'Anker Nebula Capsule 3',
    brand: 'Anker',
    category: 'entertainment',
    subcategory: 'Projectors',
    price: 115000,
    image: 'https://images.unsplash.com/photo-1517604101540-719f4a086b72?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    condition: 'New',
    specs: ['1080p Resolution', 'Laser Light Source', 'built-in battery']
  },

  // --- ACCESSORIES ---
  {
    id: 'ac1',
    name: 'Apple 20W USB-C Brick',
    brand: 'Apple',
    category: 'accessories',
    subcategory: 'Chargers & Cables',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    condition: 'New',
    specs: ['Fast Charging', 'Safe & Reliable', 'Original Box']
  },
  {
    id: 'ac2',
    name: 'Oraimo 20000mAh Power Bank',
    brand: 'Oraimo',
    category: 'accessories',
    subcategory: 'Power Banks',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    condition: 'New',
    specs: ['20W PD Fast Charging', 'Dual Output', 'High-speed Recharge']
  },
  {
    id: 'xd1',
    name: 'Xiaomi 15T Pro 5G',
    brand: 'Xiaomi',
    category: 'phones',
    subcategory: 'Xiaomi',
    price: 93000,
    oldPrice: 95000,
    image: 'https://i.pinimg.com/736x/0a/fd/30/0afd30aa2840b9d7fb3c3d27e5a7cdb8.jpg',
    isNew: true,
    flags: { isHotDeal: true },
    specs: ['Snapdragon 8 Gen 4', '144Hz AMOLED', '120W Charging']
  },
  {
    id: 'xd2',
    name: 'Xiaomi Redmi 15 4G',
    brand: 'Redmi',
    category: 'phones',
    subcategory: 'Xiaomi',
    price: 19600,
    oldPrice: 22500,
    image: 'https://i.pinimg.com/1200x/b2/0a/b1/b20ab16322239271eb7af2cf2e9c0f64.jpg',
    isNew: true,
    specs: ['6.7" OLED', '5000mAh Battery', '50MP Triple Camera']
  },
  {
    id: 'xd3',
    name: 'Xiaomi Poco F7',
    brand: 'Poco',
    category: 'phones',
    subcategory: 'Xiaomi',
    price: 62000,
    oldPrice: 68500,
    image: 'https://i.pinimg.com/736x/fd/36/33/fd3633f05f926a2a343e6cdbe070d2fc.jpg',
    isNew: true,
    specs: ['Gaming Beast', 'Dimensity 9300+', '1.5K Flow AMOLED']
  },
  {
    id: 'xd4',
    name: 'Redmi 15C 4G',
    brand: 'Redmi',
    category: 'phones',
    subcategory: 'Xiaomi',
    price: 14800,
    oldPrice: 18400,
    image: 'https://i.pinimg.com/736x/94/78/db/9478dbacacc0ecdfdf10457424c33f47.jpg',
    isNew: true,
    specs: ['Budget King', 'Reliable Battery', 'Smooth Performance']
  },
  {
    id: 'xd5',
    name: 'Redmi Note 15 4G',
    brand: 'Redmi',
    category: 'phones',
    subcategory: 'Xiaomi',
    price: 24500,
    oldPrice: 28000,
    image: 'https://i.pinimg.com/736x/45/9b/7a/459b7aa2a17310557dad416842242896.jpg',
    isNew: true,
    specs: ['New Gen', 'Solid Display', 'Fast Charging']
  },
  {
    id: 'xd6',
    name: 'Redmi Note 15 Pro 4G',
    brand: 'Redmi',
    category: 'phones',
    subcategory: 'Xiaomi',
    price: 34900,
    oldPrice: 39500,
    image: 'https://i.pinimg.com/1200x/53/f2/c3/53f2c3ff18f4bf5e1f879f530e6db359.jpg',
    isNew: true,
    specs: ['Pro Camera', 'Premium Design', 'OLED']
  },
  {
    id: 'xd7',
    name: 'Redmi Note 15 Pro 5G',
    brand: 'Redmi',
    category: 'phones',
    subcategory: 'Xiaomi',
    price: 48000,
    oldPrice: 52000,
    image: 'https://i.pinimg.com/736x/39/3f/cd/393fcd595e56e9c6ebeb247f95861180.jpg',
    isNew: true,
    specs: ['Ultra Fast 5G', 'Crystal Res Display', 'HyperCharge']
  },
  {
    id: 'xd8',
    name: 'Redmi Note 15 Pro Plus 5G',
    brand: 'Redmi',
    category: 'phones',
    subcategory: 'Xiaomi',
    price: 61000,
    oldPrice: 65000,
    image: 'https://i.pinimg.com/736x/72/cb/94/72cb9426d8f34783649481c65e3ce47a.jpg',
    isNew: true,
    specs: ['The Ultimate Note', 'Curved Display', '200MP Master Camera']
  },
  {
    id: 'cc1',
    name: 'Sony ZV-E10 II Mirrorless Camera',
    brand: 'Sony',
    category: 'photography',
    subcategory: 'Cameras',
    price: 115000,
    image: 'https://i.pinimg.com/736x/8d/62/11/8d62111166a9388df6f38aa4b3ce57c7.jpg',
    isNew: true,
    specs: ['4K 60p', 'E-mount', 'Creator Focused']
  },
  {
    id: 'cc2',
    name: 'DJI RS 3 Mini Gimbal',
    brand: 'DJI',
    category: 'photography',
    subcategory: 'Gimbals',
    price: 45000,
    image: 'https://i.pinimg.com/736x/7d/5a/2d/7d5a2d64f0f08933b9b6574c8b2a3a3a.jpg',
    isNew: true,
    specs: ['Lightweight', '2kg Payload', 'Bluetooth Shutter']
  },
  {
    id: 'od1',
    name: 'Oppo Reno15 F 5G',
    brand: 'Oppo',
    category: 'smartphones',
    subcategory: 'Oppo',
    price: 56000,
    oldPrice: 60000,
    image: 'https://i.pinimg.com/736x/4d/a2/10/4da2108f7a7fa7c98316acb68d1e2313.jpg',
    isNew: true,
    specs: ['Diamond Glow Design', '64MP AI Camera', '33W Flash Charge']
  },
  {
    id: 'od2',
    name: 'Oppo A6x 4G',
    brand: 'Oppo',
    category: 'smartphones',
    subcategory: 'Oppo',
    price: 15000,
    oldPrice: 18000,
    image: 'https://i.pinimg.com/736x/c8/54/ff/c854ff91668663fbef19ab3ff152e7ac.jpg',
    isNew: true,
    specs: ['5000mAh Battery', '90Hz Display', 'Expandable Storage']
  },
  {
    id: 'od3',
    name: 'Oppo Find X9',
    brand: 'Oppo',
    category: 'smartphones',
    subcategory: 'Oppo',
    price: 125000,
    oldPrice: 130000,
    image: 'https://i.pinimg.com/1200x/e7/d3/12/e7d3123976ce74406398af2a3097c7f1.jpg',
    isHotDeal: true,
    specs: ['1 Billion Color Display', 'Hasselblad Camera', 'Snapdragon 8 Gen 4']
  },
  {
    id: 'od4',
    name: 'Oppo Reno15 Pro',
    brand: 'Oppo',
    category: 'smartphones',
    subcategory: 'Oppo',
    price: 80500,
    oldPrice: 84999,
    image: 'https://i.pinimg.com/1200x/5a/1d/26/5a1d26f95a3368ac4d11627aad8d87e2.jpg',
    isNew: true,
    specs: ['MariSilicon X', '80W SuperVOOC', 'Portrait Expert']
  },
  {
    id: 'od5',
    name: 'Oppo Reno15 5G',
    brand: 'Oppo',
    category: 'smartphones',
    subcategory: 'Oppo',
    price: 69500,
    oldPrice: 74999,
    image: 'https://i.pinimg.com/736x/4d/a2/10/4da2108f7a7fa7c98316acb68d1e2313.jpg',
    isNew: true,
    specs: ['Diamond Glow Design', '50MP Sony Camera', '67W Flash Charge']
  },
  {
    id: 'od6',
    name: 'Oppo A6 Pro 4G',
    brand: 'Oppo',
    category: 'smartphones',
    subcategory: 'Oppo',
    price: 35000,
    oldPrice: 37000,
    image: 'https://i.pinimg.com/1200x/46/18/03/4618038a3cda02972828384c4f755e4c.jpg',
    isNew: true,
    specs: ['Glow Design', '33W SuperVOOC', '90Hz AMOLED']
  },
  {
    id: 'od7',
    name: 'Oppo A6 Pro 5G',
    brand: 'Oppo',
    category: 'smartphones',
    subcategory: 'Oppo',
    price: 42000,
    oldPrice: 44500,
    image: 'https://i.pinimg.com/736x/8e/7c/77/8e7c77724035346bd24d4551cc176650.jpg',
    isNew: true,
    specs: ['Snapdragon 5G', 'Ultra-Slim Body', 'NFC Enabled']
  },
  {
    id: 'od8',
    name: 'Oppo Reno14 F 5G',
    brand: 'Oppo',
    category: 'smartphones',
    subcategory: 'Oppo',
    price: 55000,
    oldPrice: 65000,
    image: 'https://i.pinimg.com/1200x/ab/ee/52/abee52c52429628d717537e84d297d18.jpg',
    isHotDeal: true,
    specs: ['AI Portrait Expert', 'Ultra Clear Display', 'Lag-free Exp']
  },
  {
    id: 'in1',
    name: 'Infinix Smart 20',
    brand: 'Infinix',
    category: 'smartphones',
    subcategory: 'Infinix',
    price: 14300,
    oldPrice: 15500,
    image: 'https://i.pinimg.com/736x/bc/04/13/bc0413c8fa37aed8e889bb10a4a4126f.jpg',
    isNew: true,
    specs: ['6.6" Interactive Punch-Hole', 'Up to 8GB RAM', '5000mAh Battery']
  },
  {
    id: 'in2',
    name: 'Infinix Note 60 Pro 5G',
    brand: 'Infinix',
    category: 'smartphones',
    subcategory: 'Infinix',
    price: 41000,
    oldPrice: 42000,
    image: 'https://i.pinimg.com/736x/96/dd/97/96dd973b4b048e34a7a289453338f9ba.jpg',
    isNew: true,
    specs: ['Dimensity 8020', '144Hz AMOLED Display', '68W Fast Charge']
  },
  {
    id: 'in3',
    name: 'Infinix Note Edge 5G',
    brand: 'Infinix',
    category: 'smartphones',
    subcategory: 'Infinix',
    price: 32000,
    oldPrice: 33000,
    image: 'https://i.pinimg.com/736x/29/db/a0/29dba0a326c222d17ad7804238b6c8b0.jpg',
    isHotDeal: true,
    specs: ['Cuved AMOLED', '108MP Master Triple Camera', 'Silk Green Finish']
  },
  {
    id: 'in4',
    name: 'Infinix GT 30 Pro',
    brand: 'Infinix',
    category: 'smartphones',
    subcategory: 'Infinix',
    price: 37500,
    oldPrice: 40999,
    image: 'https://i.pinimg.com/736x/81/cf/bc/81cfbc9cd6fe1d2ab2794f809ee7a65d.jpg',
    isNew: true,
    specs: ['Mecha Design', 'Gaming Processor', 'Vapor Chamber Cooling']
  },
  {
    id: 'in5',
    name: 'Infinix Hot 60 Pro Plus',
    brand: 'Infinix',
    category: 'smartphones',
    subcategory: 'Infinix',
    price: 27500,
    oldPrice: 28500,
    image: 'https://i.pinimg.com/736x/17/e2/aa/17e2aa34a94ec3b1c634e1706ee6c152.jpg',
    isHotDeal: true,
    specs: ['Ultra Slim Design', '120Hz Refresh Rate', 'High-Res Audio']
  },
  {
    id: 'in6',
    name: 'Infinix Hot 60i 4G',
    brand: 'Infinix',
    category: 'smartphones',
    subcategory: 'Infinix',
    price: 14500,
    oldPrice: 17800,
    image: 'https://i.pinimg.com/736x/c5/fb/6b/c5fb6b96ee154a58cf5bdaf20dd81274.jpg',
    isNew: true,
    specs: ['Glossy Design', 'Expandable Storage', 'Clear Selfie Camera']
  },
  {
    id: 'in7',
    name: 'Infinix Smart 10',
    brand: 'Infinix',
    category: 'smartphones',
    subcategory: 'Infinix',
    price: 11300,
    oldPrice: 12000,
    image: 'https://i.pinimg.com/736x/eb/ed/01/ebed01d4b93187565b472cb3d11f5fe8.jpg',
    isNew: true,
    specs: ['Budget Champion', 'Huge Display', 'Long Battery Life']
  },
  {
    id: 'in8',
    name: 'Infinix Note 50 Pro 4G',
    brand: 'Infinix',
    category: 'smartphones',
    subcategory: 'Infinix',
    price: 30000,
    oldPrice: 32400,
    image: 'https://i.pinimg.com/1200x/ab/ee/52/abee52c52429628d717537e84d297d18.jpg',
    isNew: true,
    specs: ['AMOLED Clarity', 'Fast Charging', 'Stereo Speakers']
  },
  {
    id: 'nd1',
    name: 'Nothing Phone 4 (a) Pro',
    brand: 'Nothing',
    category: 'smartphones',
    subcategory: 'Nothing',
    price: 0,
    oldPrice: 0,
    image: 'https://i.pinimg.com/736x/47/dd/d5/47ddd54a929fc0bead7ba92208a14536.jpg',
    status: 'out_of_stock',
    isNew: true,
    specs: ['Next-Gen Glyph', 'Pro Camera System', 'Nothing OS 3.0']
  },
  {
    id: 'nd2',
    name: 'Nothing Phone 4 (a) 5G',
    brand: 'Nothing',
    category: 'smartphones',
    subcategory: 'Nothing',
    price: 52000,
    oldPrice: 0,
    image: 'https://i.pinimg.com/1200x/ab/80/77/ab80772773f3d01a9febc4359737b7e0.jpg',
    isNew: true,
    specs: ['5G Connectivity', 'Transparent Design', 'Fast Performance']
  },
  {
    id: 'nd3',
    name: 'Nothing phone 3A Lite',
    brand: 'Nothing',
    category: 'smartphones',
    subcategory: 'Nothing',
    price: 36000,
    oldPrice: 0,
    image: 'https://www.phoneplacekenya.com/wp-content/uploads/2025/11/Nothing-phone-3A-Lite.webp',
    isNew: true,
    specs: ['Essential Glyph', 'Lightweight Build', 'Battery Focused']
  },
  {
    id: 'nd4',
    name: 'Nothing Phone (3)',
    brand: 'Nothing',
    category: 'smartphones',
    subcategory: 'Nothing',
    price: 85500,
    oldPrice: 0,
    image: 'https://www.phoneplacekenya.com/wp-content/uploads/2025/10/Nothing-Phone-3.jpg',
    isHotDeal: true,
    isNew: true,
    specs: ['Flagship Dynamic Glyph', 'Advanced Optics', 'LTPO Display']
  },
  {
    id: 'nd5',
    name: 'Nothing Phone 3a',
    brand: 'Nothing',
    category: 'smartphones',
    subcategory: 'Nothing',
    price: 43000,
    oldPrice: 0,
    image: 'https://www.phoneplacekenya.com/wp-content/uploads/2025/02/Nothing-Phone-3a-b.jpg',
    isNew: true,
    specs: ['Balanced Performance', 'Iconic Aesthetics', 'Clean Software']
  },
  {
    id: 'nd6',
    name: 'Nothing Phone 3a Pro',
    brand: 'Nothing',
    category: 'smartphones',
    subcategory: 'Nothing',
    price: 60000,
    oldPrice: 63000,
    image: 'https://www.phoneplacekenya.com/wp-content/uploads/2025/02/Nothing-Phone-3a-Pro-a.jpg',
    isNew: true,
    specs: ['High Refresh Display', 'Premium Sensor', 'Enhanced Glyph']
  },
  {
    id: 'nd7',
    name: 'Nothing Phone 2a Plus',
    brand: 'Nothing',
    category: 'smartphones',
    subcategory: 'Nothing',
    price: 49000,
    oldPrice: 51000,
    image: 'https://www.phoneplacekenya.com/wp-content/uploads/2024/08/Nothing-Phone-2a-Plus-a.jpg',
    isNew: true,
    specs: ['Extra Performance', 'Distinct Back Panel', 'Optimized Battery']
  },
  {
    id: 'nd8',
    name: 'Nothing CMF Phone 1',
    brand: 'Nothing',
    category: 'smartphones',
    subcategory: 'Nothing',
    price: 32000,
    oldPrice: 34000,
    image: 'https://www.phoneplacekenya.com/wp-content/uploads/2024/07/Nothing-CMF-Phone-1-a.jpg',
    isNew: true,
    specs: ['Playful Design', 'Modular Accessories', 'Solid Foundation']
  }
];
