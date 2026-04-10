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
  }
];

export const brands = [
  'Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Tecno', 'Infinix', 'Sony', 'JBL', 'Google', 'Anker', 'SanDisk', 'Logitech', 'Keychron', 'UGREEN', 'Razer', 'Bose', 'Sennheiser', 'Marshall', 'Beats', 'Garmin', 'Huawei', 'Amazfit', 'Fitbit', 'Casio', 'Suunto', 'Lenovo', 'Microsoft', 'Amazon', 'HP', 'ASUS', 'Acer', 'MSI', 'Nintendo', 'Valve', 'SteelSeries', 'Oraimo'
];

export const heroBanners = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max',
    subtitle: 'Titanium. So strong. So light. So Pro.',
    bg: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop',
    link: '/shop?brand=apple'
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24 Ultra',
    subtitle: 'Galaxy AI is here',
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
    name: 'iPhone 15 Pro Max 256GB',
    brand: 'Apple',
    category: 'phones',
    subcategory: 'iPhones',
    price: 210000,
    oldPrice: 225000,
    image: 'https://images.unsplash.com/photo-1695048132868-c116de0d12ec?q=80&w=800&auto=format&fit=crop',
    isNew: true,
    rating: 4.9,
    reviews: 312,
    condition: 'New',
    flags: { isHotDeal: true, isFeatured: true },
    specs: ['A17 Pro Chip', '48MP Camera', '6.7" XDR Display']
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'phones',
    subcategory: 'Samsung Galaxy',
    price: 185000,
    oldPrice: 195000,
    image: 'https://images.unsplash.com/photo-1707227155313-2edbd5ebc982?q=80&w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800&auto=format&fit=crop',
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
    id: 'p6',
    name: 'Tecno Camon 30 Premier',
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
    name: 'Infinix Note 40 Pro',
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
    image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?q=80&w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1611186871348-b1ec696e5237?q=80&w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?q=80&w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop',
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
  }
];
