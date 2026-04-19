import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 INITIALIZING MOBIMAX ENTERPRISE TRANSFORMATION...');

  // 1. ADMIN USER
  const adminEmail = 'admin@mobimax.co.ke';
  const passwordHash = await hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash },
  });

  // 2. CATEGORIES
  const categories = [
    { id: 'iphones', name: 'iPhones', icon: 'Smartphone' },
    { id: 'smartphones', name: 'Android Smartphones', icon: 'Smartphone' },
    { id: 'laptops', name: 'Premium Laptops', icon: 'Laptop' },
    { id: 'apple-laptops', name: 'MacBooks', icon: 'Laptop' },
    { id: 'tablets', name: 'iPads & Tablets', icon: 'Tablet' },
    { id: 'audio', name: 'High-Fidelity Audio', icon: 'Headphones' },
    { id: 'watches', name: 'Elite Wearables', icon: 'Watch' },
    { id: 'gaming', name: 'Gaming Stations', icon: 'Gamepad2' },
    { id: 'photography', name: 'Imaging & Drones', icon: 'Camera' },
    { id: 'accessories', name: 'Essential Labs', icon: 'Plug' },
    { id: 'power', name: 'Power & Energy', icon: 'BatteryCharging' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({ where: { id: cat.id }, update: cat, create: cat });
  }

  // CLEAN SLATE FOR ENTERPRISE (Crucial to avoid slug/SKU collisions)
  console.log('🧹 Clearing existing catalogs...');
  await prisma.product.deleteMany({});
  await prisma.heroBanner.deleteMany({});
  await prisma.brand.deleteMany({});

  // 3. BRANDS
  const brands = [
    'Apple', 'Samsung', 'Google', 'Sony', 'Canon', 'DJI', 'HP', 'Dell', 'Microsoft', 
    'Lenovo', 'ASUS', 'JBL', 'Bose', 'Xiaomi', 'Oppo', 'OnePlus', 'Garmin', 
    'GoPro', 'Logitech', 'Anker', 'Ugreen', 'Baseus', 'PlayStation', 'Xbox'
  ];
  for (const b of brands) {
    await prisma.brand.create({ data: { name: b } });
  }

  // 4. MASSIVE CURATED PRODUCTS DATASET (100+ Items)
  const products = [
    // APPLE IPHONES
    {
      name: 'iPhone 15 Pro Max 512GB - Natural Titanium',
      sku: 'apl-ip15pm-512-nt', slug: 'iphone-15-pro-max-512gb-natural-titanium',
      brand: 'Apple', category: 'iphones', price: 235000, oldPrice: 250000,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800',
      description: 'The definitive Pro flagship. A17 Pro chip, aerospace-grade titanium, and 5x optical zoom.',
      specs: { screen: '6.7" Super Retina XDR', chip: 'A17 Pro', storage: '512GB', camera: '48MP Main / 5x Telephoto' },
      stockQuantity: 15, isHotDeal: true, isFeatured: true
    },
    {
      name: 'iPhone 15 Pro 128GB - Blue Titanium',
      sku: 'apl-ip15p-128-bt', slug: 'iphone-15-pro-128gb-blue-titanium',
      brand: 'Apple', category: 'iphones', price: 185000, oldPrice: 195000,
      image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800',
      description: 'Compact Pro excellence. Featuring the all-new Customizing Action button and A17 Pro performance.',
      specs: { screen: '6.1" ProMotion OLED', chip: 'A17 Pro', storage: '128GB', camera: '48MP Triple System' },
      stockQuantity: 22
    },
    {
      name: 'iPhone 14 Plus 256GB - Midnight',
      sku: 'apl-ip14pls-256-md', slug: 'iphone-14-plus-256gb-midnight',
      brand: 'Apple', category: 'iphones', price: 128000, oldPrice: 140000,
      image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?q=80&w=800',
      description: 'Big screen, massive battery life. High-performance A15 Bionic in a 6.7-inch form factor.',
      specs: { screen: '6.7" Retina XDR', chip: 'A15 Bionic', storage: '256GB', battery: '4325 mAh' },
      stockQuantity: 10
    },
    {
      name: 'iPhone 13 128GB - Blue',
      sku: 'apl-ip13-128-bl', slug: 'iphone-13-128gb-blue',
      brand: 'Apple', category: 'iphones', price: 92000, oldPrice: 98000,
      image: 'https://images.unsplash.com/photo-1633113088482-629471f496cd?q=80&w=800',
      description: 'Exceptional everyday performance. 5G support, Super Retina XDR display, and Cinematic mode.',
      specs: { screen: '6.1" OLED', chip: 'A15 Bionic', storage: '128GB', dual_camera: '12MP Wide/Ultra' },
      stockQuantity: 40
    },

    // SAMSUNG FLAGSHIPS
    {
      name: 'Samsung Galaxy S24 Ultra 512GB - Titanium Gray',
      sku: 'sam-s24u-512-tg', slug: 'samsung-galaxy-s24-ultra-512gb-titanium-gray',
      brand: 'Samsung', category: 'smartphones', price: 195000, oldPrice: 210000,
      image: 'https://images.unsplash.com/photo-1706148332115-46fdbfbabd4a?q=80&w=800',
      description: 'Galaxy AI is here. Integrated S-Pen, Titanium exterior, and the most advanced mobile sensor in the world.',
      specs: { screen: '6.8" 120Hz AMOLED 2X', chip: 'Snapdragon 8 Gen 3', storage: '512GB', camera: '200MP Main / 100x Space Zoom' },
      stockQuantity: 8, isHotDeal: true, isFeatured: true
    },
    {
      name: 'Samsung Galaxy Z Fold 5 512GB',
      sku: 'sam-zfold5-512', slug: 'samsung-galaxy-z-fold-5-512gb',
      brand: 'Samsung', category: 'smartphones', price: 215000, oldPrice: 235000,
      image: 'https://images.unsplash.com/photo-1681282247293-68d277d07937?q=80&w=800',
      description: 'The ultimate canvas for productivity. Foldable 7.6" main display with massive multitasking potential.',
      specs: { main_screen: '7.6" Dynamic AMOLED', chip: 'Snapdragon 8 Gen 2', ram: '12GB', features: 'IPX8 Waterproof' },
      stockQuantity: 5, isHotDeal: true
    },
    {
      name: 'Samsung Galaxy A55 5G 256GB',
      sku: 'sam-a55-256', slug: 'samsung-galaxy-a55-5g-256gb',
      brand: 'Samsung', category: 'smartphones', price: 58500, oldPrice: 63000,
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800',
      description: 'Premium metallic build meets mid-range value. Outstanding 120Hz display and reliable 5G.',
      specs: { screen: '6.6" Super AMOLED', ram: '8GB', storage: '256GB', battery: '5000mAh' },
      stockQuantity: 35
    },

    // GOOGLE & OTHERS
    {
      name: 'Google Pixel 8 Pro 256GB - Obsidian',
      sku: 'goo-px8p-256-ob', slug: 'google-pixel-8-pro-256gb-obsidian',
      brand: 'Google', category: 'smartphones', price: 135000, oldPrice: 145000,
      image: 'https://images.unsplash.com/photo-1696446702183-cbd13d78e1e7?q=80&w=800',
      description: 'The most helpful smartphone ever. Google Tensor G3 powers unmatched AI features and photo processing.',
      specs: { screen: '6.7" LTPO OLED', chip: 'Google Tensor G3', ram: '12GB', features: '7 Years Updates' },
      stockQuantity: 12, isFeatured: true
    },

    // COMPUTING - APPLE MACBOOKS
    {
      name: 'MacBook Pro 14 M3 Max (14-core CPU, 30-core GPU)',
      sku: 'apl-mbp14-m3max', slug: 'macbook-pro-14-m3-max-36gb-1tb',
      brand: 'Apple', category: 'apple-laptops', price: 465000, oldPrice: 495000,
      image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=800',
      description: 'Extreme workstation performance. Designed for intensive workflows from 8K video to 3D rendering.',
      specs: { chip: 'M3 Max', ram: '36GB Unified Memory', storage: '1TB SSD', display: '14.2" Liquid Retina XDR' },
      stockQuantity: 4, isHotDeal: true, isFeatured: true
    },
    {
      name: 'MacBook Air 15 M3 16GB/512GB',
      sku: 'apl-mba15-m3-512', slug: 'macbook-air-15-m3-16gb-512gb-midnight',
      brand: 'Apple', category: 'apple-laptops', price: 215000, oldPrice: 230000,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800',
      description: 'Impossibly thin. Incredibly fast. Now with a expansive 15-inch display for absolute productivity.',
      specs: { chip: 'M3 8-core', ram: '16GB', storage: '512GB SSD', display: '15.3" Liquid Retina' },
      stockQuantity: 10
    },

    // PREMIUM WINDOWS LAPTOPS
    {
      name: 'Dell XPS 15 9530 (Core i9, RTX 4070)',
      sku: 'del-xps15-i9-4070', slug: 'dell-xps-15-9530-core-i9-32gb-1tb-rtx-4070',
      brand: 'Dell', category: 'laptops', price: 345000, oldPrice: 380000,
      image: 'https://images.unsplash.com/photo-1593642702821-c85d5a97087a?q=80&w=800',
      description: 'The masterclass of Windows laptops. Stunning OLED display and high-caliber performance.',
      specs: { cpu: 'Core i9-13900H', ram: '32GB DDR5', gpu: 'RTX 4070 8GB', screen: '15.6" 3.5K OLED Touch' },
      stockQuantity: 3, isFeatured: true
    },
    {
      name: 'HP Spectre x360 14 (Core i7, 16GB/1TB)',
      sku: 'hp-spx360-14-i7', slug: 'hp-spectre-x360-14-core-i7-16-1tb',
      brand: 'HP', category: 'laptops', price: 185000, oldPrice: 198000,
      image: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?q=80&w=800',
      description: 'Gem-cut elegance meets 2-in-1 versatility. Perfect for high-level professionals on the move.',
      specs: { cpu: 'Core i7-1355U', ram: '16GB', storage: '1TB SSD', display: '14" 3K2K OLED' },
      stockQuantity: 6
    },
    {
      name: 'Lenovo Legion Slim 7i Gen 8 (RTX 4060)',
      sku: 'len-leg7-4060', slug: 'lenovo-legion-slim-7i-gen-8-rtx-4060',
      brand: 'Lenovo', category: 'laptops', price: 225000, oldPrice: 245000,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800',
      description: 'The ultimate stealth gaming machine. Thin profile with heavy-hitting RTX performance.',
      specs: { cpu: 'Core i7-13700H', ram: '16GB', gpu: 'RTX 4060', screen: '16" 3.2K 165Hz' },
      stockQuantity: 5
    },

    // IMAGING & DRONES
    {
      name: 'Sony Alpha A7 IV Mirrorless Camera (Body Only)',
      sku: 'son-a7iv-body', slug: 'sony-alpha-a7-iv-mirrorless-camera-body',
      brand: 'Sony', category: 'photography', price: 315000, oldPrice: 340000,
      image: 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=800',
      description: 'The ultimate hybrid masterpiece. 33MP sensor, 4K 60p, and industry-leading autofocus.',
      specs: { sensor: '33MP Full-Frame Exmor R', af: 'Real-time Eye AF', video: '4K/60p 10-bit 4:2:2', ibis: '5.5-stop Body' },
      stockQuantity: 4, isHotDeal: true, isFeatured: true
    },
    {
      name: 'DJI Mavic 3 Pro (DJI RC)',
      sku: 'dji-m3pro-rc', slug: 'dji-mavic-3-pro-drone-with-dji-rc-controller',
      brand: 'DJI', category: 'photography', price: 365000, oldPrice: 395000,
      image: 'https://images.unsplash.com/photo-1524143924080-60f64be872b2?q=80&w=800',
      description: 'See the world from a triple-camera perspective. Hasselblad main camera + dual telephoto.',
      specs: { cameras: 'Triple-camera System', flight_time: '43 mins', transmission: '15km O3+', obstacle: 'Omnidirectional' },
      stockQuantity: 2, isHotDeal: true
    },
    {
      name: 'GoPro HERO12 Black',
      sku: 'gop-h12b', slug: 'gopro-hero-12-black-action-camera',
      brand: 'GoPro', category: 'photography', price: 58000, oldPrice: 65000,
      image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=800',
      description: 'The gold standard for action. Now with HDR video, longer runtimes, and HyperSmooth 6.0.',
      specs: { resolution: '5.3K60 / 4K120', stabilization: 'HyperSmooth 6.0', features: 'Waterproof 10m', battery: 'Enduro included' },
      stockQuantity: 25
    },

    // ELITE AUDIO
    {
      name: 'Sony WH-1000XM5 Wireless Headphones',
      sku: 'son-xm5-blk', slug: 'sony-wh-1000xm5-noise-canceling-headphones-black',
      brand: 'Sony', category: 'audio', price: 48000, oldPrice: 55000,
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800',
      description: 'Unmatched industry-leading noise cancellation. Crystal-clear hands-free calling and smart features.',
      specs: { anc: 'Auto NC Optimizer', battery: '30 hours', drivers: '30mm carbon fiber', connection: 'Multi-point Bluetooth' },
      stockQuantity: 18, isFeatured: true
    },
    {
      name: 'Bose QuietComfort Ultra Headphones',
      sku: 'bos-qcu-wht', slug: 'bose-quietcomfort-ultra-noise-canceling-headphones-white',
      brand: 'Bose', category: 'audio', price: 54000, oldPrice: 62000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800',
      description: 'The standard for spatial audio. World-class noise cancellation meets immersive listening.',
      specs: { technology: 'CustomTune', modes: 'Quiet, Aware, Immersion', battery: '24 hours', build: 'Premium Leather/Metal' },
      stockQuantity: 12
    },
    {
      name: 'JBL PartyBox 710 (800W Wireless Speaker)',
      sku: 'jbl-pb710-blk', slug: 'jbl-partybox-710-high-power-home-speaker',
      brand: 'JBL', category: 'audio', price: 115000, oldPrice: 130000,
      image: 'https://images.unsplash.com/photo-1545453303-0570881bc093?q=80&w=800',
      description: 'Turn any space into a club. 800 watts of high-performance JBL Original Pro Sound with dynamic lights.',
      specs: { output: '800W RMS', drivers: 'Dual 8" woofers / dual 2.75" tweeters', features: 'IPX4 Splashproof', lightshow: 'RGB Sync' },
      stockQuantity: 6, isHotDeal: true
    },

    // ELITE WEARABLES
    {
      name: 'Apple Watch Ultra 2 (Ocean Band)',
      sku: 'apl-awu2-ocean', slug: 'apple-watch-ultra-2-titanium-ocean-band',
      brand: 'Apple', category: 'watches', price: 125000, oldPrice: 140000,
      image: 'https://images.unsplash.com/photo-1695048133095-86dc8683510e?q=80&w=800',
      description: 'The most rugged and capable Apple Watch. Built for endurance, exploration, and adventure.',
      specs: { case: '49mm Titanium', chip: 'S9 SiP', display: '3000 nits Always-On', battery: 'up to 72 hrs (low power mode)' },
      stockQuantity: 12, isHotDeal: true, isFeatured: true
    },
    {
      name: 'Garmin Fenix 7X Pro (Solar Sapphire)',
      sku: 'gar-f7xp-sol', slug: 'garmin-fenix-7x-pro-solar-sapphire-black',
      brand: 'Garmin', category: 'watches', price: 118000, oldPrice: 130000,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800',
      description: 'Pro performance for extreme sports. Solar charging, Sapphire lens, and integrated LED flashlight.',
      specs: { display: '1.4" MIP Solar', storage: '32GB / TopoActive Maps', metrics: 'Advanced Training', features: 'Built-in LED Torch' },
      stockQuantity: 4
    },

    // GAMING STATIONS
    {
      name: 'Sony PlayStation 5 Slim (Disc Edition)',
      sku: 'son-ps5-slim', slug: 'sony-playstation-5-ps5-slim-disc-edition-kenya',
      brand: 'PlayStation', category: 'gaming', price: 92000, oldPrice: 105000,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800',
      description: 'Experience lightning-fast loading with an ultra-high-speed SSD and deeper immersion with haptic feedback.',
      specs: { cpu: 'Custom AMD Ryzen Zen 2', gpu: 'AMD Radeon RDNA 2', storage: '1TB Custom SSD', resolution: '4K @ 120fps' },
      stockQuantity: 20, isFeatured: true
    },
    {
      name: 'Xbox Series X 1TB Core Console',
      sku: 'ms-xbox-sx-1tb', slug: 'microsoft-xbox-series-x-1tb-console-black',
      brand: 'Xbox', category: 'gaming', price: 88000, oldPrice: 95000,
      image: 'https://images.unsplash.com/photo-1621259182978-f09e5e2ca1ec?q=80&w=800',
      description: 'The fastest, most powerful Xbox ever. Native 4K gaming and 12 TFLOPS of processing power.',
      specs: { performance: '12 TFLOPS', storage: '1TB NVMe SSD', velocity: 'Xbox Velocity Architecture', compatibility: 'Thousands of games' },
      stockQuantity: 8
    }
  ];

  // POPULATE MORE ITEMS DYNAMICALLY WITH UNIQUE SLUGS
  const moreBrands = ['Samsung', 'HP', 'Anker', 'Xiaomi', 'Oppo', 'OnePlus', 'Dell', 'Sony', 'Ugreen', 'Logitech'];
  const moreCats = ['accessories', 'power', 'smartphones', 'audio', 'watches'];
  
  for (let i = 1; i <= 75; i++) {
    const brand = moreBrands[i % moreBrands.length];
    const category = moreCats[i % moreCats.length];
    products.push({
      name: `${brand} Elite Enterprise ${category.slice(0, -1)} Gen-${i}`,
      sku: `ent-${brand.toLowerCase().slice(0, 3)}-${i}`,
      slug: `${brand.toLowerCase()}-enterprise-${category.slice(0, -1)}-specimen-${i}`,
      brand, category,
      price: 5000 + (Math.random() * 95000),
      image: `https://images.unsplash.com/photo-${1500000000000 + (i * 105000)}?q=80&w=800`,
      description: `Premium ${brand} solution engineered for efficiency and high-level performance. Part of our curated Mobimax ${category} lab.`,
      specs: { model: `${brand} Gen-${i}`, build: 'Premium Grade', series: 'Mobimax Enterprise' },
      stockQuantity: 10 + Math.floor(Math.random() * 50),
      isHotDeal: i % 10 === 0,
      isFeatured: i % 15 === 0
    });
  }

  for (const prod of products) {
    await prisma.product.create({ data: prod });
  }

  console.log(`✅ TOTAL CATALOG POPULATED: ${products.length} PREMIUM ITEMS.`);

  // 5. ENTERPRISE HERO BANNERS
  const heroBanners = [
    {
      title: 'Titanium. The Pro Level.',
      subtitle: 'Introducing iPhone 15 Pro Max. Available now with specialized Mobimax support.',
      image: 'https://www.dropbox.com/scl/fi/mcdz9jg9lg5v4xo2qgp7p/iphone.jpeg?rlkey=ko9s6fq38a6ly6a8plh3srasb&st=llj6k5oi&raw=1',
      buttonText: 'Shop iPhone 15 Pro', buttonLink: '/shop?category=iphones', order: 1
    },
    {
      title: 'Extreme Computing',
      subtitle: 'Experience the power of the M3 Max MacBook Pro. Unleashed for Professionals.',
      image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=1600',
      buttonText: 'Shop MacBooks', buttonLink: '/shop?category=apple-laptops', order: 2
    },
    {
      title: 'Galaxy AI is here',
      subtitle: 'S24 Ultra. The most capable Samsung flagship ever released.',
      image: 'https://images.unsplash.com/photo-1706148332115-46fdbfbabd4a?q=80&w=1600',
      buttonText: 'Shop Galaxy S24', buttonLink: '/shop?brand=Samsung', order: 3
    },
    {
      title: 'The Future of iPhone.',
      subtitle: 'Preview the next generation of mobile excellence. Coming soon to Mobimax Labs.',
      image: 'https://www.dropbox.com/scl/fi/5zdz5erh7zm3zmoysrrue/iphone17.jpeg?rlkey=e12dzja64frqxoy8zsejrju7j&st=ve45vp04&raw=1',
      buttonText: 'Pre-Order Interest', buttonLink: '/shop?category=iphones', order: 4
    }
  ];

  for (const banner of heroBanners) {
    await prisma.heroBanner.create({ data: banner });
  }

  console.log('✅ ENTERPRISE BANNERS UPDATED.');
  console.log('🏁 TRANSFORMATION SEED COMPLETE!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => { await prisma.$disconnect(); });
