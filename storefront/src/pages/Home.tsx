import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ChevronRight,
  ChevronDown,
  Smartphone,
  Laptop,
  Watch,
  Gamepad2,
  Camera,
  Plug,
  Tablet,
  BatteryCharging,
  Heart,
} from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import BrandGrid from '../components/home/BrandGrid';
import CategoryIconBar from '../components/home/CategoryIconBar';
import { useFeaturedContent, useMetadata, useProducts } from '../hooks/useCatalog';
import { Product } from '@mobiplus/shared';

/* ── Hero Slider ── */
const HERO_SLIDES = [
  { src: '/galaxy.webp', alt: 'Samsung Galaxy', bg: '#0a0a0a', fit: 'cover' as const },
  { src: '/iphone17.webp', alt: 'iPhone 17', bg: '#010101', fit: 'contain' as const },
  { src: '/gaming.webp', alt: 'Gaming', bg: '#dde1e2', fit: 'contain' as const },
  { src: '/watch.webp', alt: 'Smartwatches', bg: '#dfe3e5', fit: 'contain' as const },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % HERO_SLIDES.length);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative w-full overflow-hidden select-none" style={{ height: 'clamp(220px, 38vw, 500px)' }}>
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 w-full h-full transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, background: slide.bg }}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="w-full h-full"
            style={{ objectFit: slide.fit, objectPosition: 'center' }}
            draggable={false}
          />
        </div>
      ))}

      {/* Prev / Next arrows */}
      <button onClick={prev} aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button onClick={next} aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Skeleton loader for product cards ── */
function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-60 bg-slate-100" />
      <div className="p-3.5 space-y-2">
        <div className="h-3 w-16 bg-slate-100 rounded" />
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-3/4 bg-slate-100 rounded" />
        <div className="h-5 w-24 bg-slate-100 rounded mt-3" />
        <div className="h-9 w-full bg-slate-100 rounded-lg mt-2" />
      </div>
    </div>
  );
}

/* ── Reusable section heading ── */
interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  viewAllLink?: string;
  viewAllLabel?: string;
  accent?: 'green' | 'red' | 'blue';
}
function SectionHeading({
  eyebrow,
  title,
  viewAllLink,
  viewAllLabel = 'View All',
  accent = 'green',
}: SectionHeadingProps) {
  const accentColor =
    accent === 'red'
      ? 'text-rose-500'
      : accent === 'blue'
      ? 'text-blue-600'
      : 'text-brand-green';
  const barColor =
    accent === 'red'
      ? 'bg-rose-500'
      : accent === 'blue'
      ? 'bg-blue-600'
      : 'bg-brand-green';

  return (
    <div className="flex items-end justify-between mb-6">
      <div className="flex items-start gap-3">
        <div className={`w-1 h-full min-h-[40px] rounded-full mt-0.5 shrink-0 ${barColor}`} />
        <div>
          {eyebrow && (
            <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${accentColor}`}>
              {eyebrow}
            </p>
          )}
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            {title}
          </h2>
        </div>
      </div>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="flex items-center gap-1 text-[12px] font-semibold text-slate-500 hover:text-brand-green transition-colors shrink-0 ml-4"
        >
          {viewAllLabel}
          <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}

/* ── Product row with loading state ── */
interface ProductRowProps {
  eyebrow?: string;
  title: string;
  viewAllLink?: string;
  viewAllLabel?: string;
  products: Product[];
  isLoading?: boolean;
  accent?: 'green' | 'red' | 'blue';
  maxItems?: number;
}
function ProductRow({
  eyebrow,
  title,
  viewAllLink,
  viewAllLabel,
  products,
  isLoading,
  accent,
  maxItems = 5,
}: ProductRowProps) {
  if (!isLoading && products.length === 0) return null;

  const sliced = products.slice(0, maxItems);

  return (
    <section className="py-8 md:py-10">
      <div className="container mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          viewAllLink={viewAllLink}
          viewAllLabel={viewAllLabel}
          accent={accent}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {isLoading
            ? Array.from({ length: maxItems }).map((_, i) => <CardSkeleton key={i} />)
            : sliced.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}

const CATEGORY_GROUPS = [
  {
    title: 'Smartphones',
    image: 'https://i.pinimg.com/736x/20/78/aa/2078aa60db3cb611f884774708b1a3d6.jpg',
    mainLink: '/shop?category=smartphones',
    items: [
      { name: 'Samsung Phones', link: '/shop?brand=samsung' },
      { name: 'iPhone', link: '/shop?brand=apple' },
      { name: 'Tecno Phones', link: '/shop?brand=tecno' },
      { name: 'Google Pixel Phones', link: '/shop?brand=google' },
    ],
  },
  {
    title: 'Gaming',
    image: 'https://i.pinimg.com/1200x/c4/d0/2a/c4d02a22d02d4d2b18e070f524f812db.jpg',
    mainLink: '/shop?category=gaming',
    items: [
      { name: 'Accessories', link: '/shop?category=gaming' },
      { name: 'Gaming Console', link: '/shop?category=gaming' },
      { name: 'Gaming Controllers', link: '/shop?category=gaming' },
      { name: 'Gaming Headsets', link: '/shop?category=gaming' },
    ],
  },
  {
    title: 'Audio',
    image: 'https://i.pinimg.com/736x/01/25/11/01251172996a8bb811c24441acbd5df9.jpg',
    mainLink: '/shop?category=audio',
    items: [
      { name: 'Buds', link: '/shop?category=audio' },
      { name: 'Headphones', link: '/shop?category=audio' },
      { name: 'Speakers', link: '/shop?category=audio' },
      { name: 'Soundbar', link: '/shop?category=audio' },
    ],
  },
  {
    title: 'Smartwatch',
    image: 'https://i.pinimg.com/736x/bc/05/cb/bc05cb334661ddb8243212efa40f0f30.jpg',
    mainLink: '/shop?category=wearables',
    items: [
      { name: 'Smartwatches', link: '/shop?category=wearables' },
      { name: 'Apple Watch', link: '/shop?brand=apple&category=wearables' },
      { name: 'Galaxy Watch', link: '/shop?brand=samsung&category=wearables' },
      { name: 'Smart Bands', link: '/shop?category=wearables' },
    ],
  },
  {
    title: 'Accessories',
    image: 'https://i.pinimg.com/1200x/75/72/9f/75729f59addf4bb47a78548a6d763079.jpg',
    mainLink: '/shop?category=accessories',
    items: [
      { name: 'Apple Accessories', link: '/shop?brand=apple' },
      { name: 'Samsung Accessories', link: '/shop?brand=samsung' },
      { name: 'Chargers', link: '/shop?category=accessories' },
      { name: 'Powerbank', link: '/shop?category=accessories' },
    ],
  },
  {
    title: 'Storage',
    image: 'https://i.pinimg.com/1200x/38/ae/7c/38ae7c46463eaa171ee1d78577e14b63.jpg',
    mainLink: '/shop?category=accessories' ,
    items: [
      { name: 'Flash Drives', link: '/shop?category=accessories' },
      { name: 'Hard Drives', link: '/shop?category=accessories' },
      { name: 'Memory Cards', link: '/shop?category=accessories' },
      { name: 'USB Hubs', link: '/shop?category=accessories' },
    ],
  },
];

const XIAOMI_DEALS: Product[] = [
  {
    id: 'xd1',
    name: 'Xiaomi 15T Pro 5G',
    brand: 'Xiaomi',
    category: 'smartphones',
    price: 93000,
    oldPrice: 95000,
    image: 'https://i.pinimg.com/736x/0a/fd/30/0afd30aa2840b9d7fb3c3d27e5a7cdb8.jpg',
    status: 'published',
    specs: {
      RAM: '12GB',
      'Internal Storage': '256GB',
      Display: '6.67" AMOLED, 144Hz',
      OS: 'Android 15, HyperOS 2',
      Chipset: 'Dimensity 9300+',
      'Main Camera': '200MP + 50MP + 12MP',
      'Selfie Lens': '32MP',
      Network: '5G, Wi-Fi 7, Bluetooth 5.4, USB-C 3.2, NFC',
      Battery: '5000mAh, 120W',
      Colorways: 'Titan Black, Titan Grey, Titan Blue',
    },
  },
  {
    id: 'xd2',
    name: 'Xiaomi Redmi 15 4G',
    brand: 'Redmi',
    category: 'smartphones',
    price: 19600,
    oldPrice: 22500,
    image: 'https://i.pinimg.com/1200x/b2/0a/b1/b20ab16322239271eb7af2cf2e9c0f64.jpg',
    status: 'published',
    specs: {
      RAM: '6GB / 8GB',
      'Internal Storage': '128GB / 256GB',
      Display: '6.67" AMOLED, 90Hz',
      OS: 'Android 14, HyperOS',
      Chipset: 'Mediatek Helio G91 Ultra',
      'Main Camera': '50MP + Auxiliary Lens',
      'Selfie Lens': '8MP',
      Network: 'Wi-Fi 5, Bluetooth 5.0, USB-C, NFC',
      Battery: '5030mAh, 33W',
      Colorways: 'Midnight Black, Sparkle Gold, Sage Green',
    },
  },
  {
    id: 'xd3',
    name: 'Xiaomi Poco F7',
    brand: 'Poco',
    category: 'smartphones',
    price: 62000,
    oldPrice: 68500,
    image: 'https://i.pinimg.com/736x/fd/36/33/fd3633f05f926a2a343e6cdbe070d2fc.jpg',
    status: 'published',
    specs: {
      RAM: '8GB / 12GB',
      'Internal Storage': '256GB',
      Display: '6.67" AMOLED, 120Hz',
      OS: 'Android 15, HyperOS 2',
      Chipset: 'Snapdragon 8s Gen 4',
      'Main Camera': '50MP + 8MP',
      'Selfie Lens': '20MP',
      Network: '5G, Wi-Fi 6E, Bluetooth 5.4, USB-C, NFC',
      Battery: '5000mAh, 90W',
      Colorways: 'Black, Blue, White',
    },
  },
  {
    id: 'xd4',
    name: 'Redmi 15C 4G',
    brand: 'Xiaomi',
    category: 'smartphones',
    price: 14800,
    oldPrice: 18400,
    image: 'https://i.pinimg.com/736x/94/78/db/9478dbacacc0ecdfdf10457424c33f47.jpg',
    status: 'published',
    isHotDeal: true,
    specs: {
      RAM: '4GB / 6GB',
      'Internal Storage': '128GB',
      Display: '6.88" IPS LCD, 90Hz',
      OS: 'Android 14, HyperOS',
      Chipset: 'Mediatek Helio G81 Ultra',
      'Main Camera': '50MP + AI Lens',
      'Selfie Lens': '5MP',
      Network: 'Wi-Fi 5, Bluetooth 5.0, USB-C',
      Battery: '5160mAh, 18W',
      Colorways: 'Midnight Black, Glacier White, Sage Green',
    },
  },
  {
    id: 'xd5',
    name: 'Redmi Note 15 4G',
    brand: 'Redmi',
    category: 'smartphones',
    price: 24500,
    oldPrice: 28000,
    image: 'https://i.pinimg.com/736x/45/9b/7a/459b7aa2a17310557dad416842242896.jpg',
    status: 'published',
    specs: {
      RAM: '8GB',
      'Internal Storage': '256GB',
      Display: '6.77" AMOLED',
      OS: 'Android 15, up to 4 major Android upgrades, HyperOS 2',
      Chipset: 'Mediatek Helio G100 Ultra (6 nm)',
      'Main Camera': '108MP + Auxiliary Lens',
      'Selfie Lens': '20MP',
      Network: 'Wi-Fi, Bluetooth v5.3, USB Type-C 2.0, NFC',
      Battery: '6000mAh, 33W',
      Colorways: 'Black, Forest Green, Glacier Blue, Purple',
    },
  },
  {
    id: 'xd6',
    name: 'Redmi Note 15 Pro 4G',
    brand: 'Redmi',
    category: 'smartphones',
    price: 34900,
    oldPrice: 39500,
    image: 'https://i.pinimg.com/1200x/53/f2/c3/53f2c3ff18f4bf5e1f879f530e6db359.jpg',
    status: 'published',
    specs: {
      RAM: '8GB / 12GB',
      'Internal Storage': '256GB',
      Display: '6.77" AMOLED, 120Hz',
      OS: 'Android 15, HyperOS 2',
      Chipset: 'Mediatek Helio G100 Ultra',
      'Main Camera': '200MP + Auxiliary Lens',
      'Selfie Lens': '20MP',
      Network: 'Wi-Fi 6, Bluetooth 5.3, USB Type-C 2.0, NFC',
      Battery: '5500mAh, 45W',
      Colorways: 'Midnight Black, Silver, Forest Green',
    },
  },
  {
    id: 'xd7',
    name: 'Redmi Note 15 Pro 5G',
    brand: 'Redmi',
    category: 'smartphones',
    price: 48000,
    oldPrice: 52000,
    image: 'https://i.pinimg.com/736x/39/3f/cd/393fcd595e56e9c6ebeb247f95861180.jpg',
    status: 'published',
    specs: {
      RAM: '8GB / 12GB',
      'Internal Storage': '256GB',
      Display: '6.67" AMOLED, 144Hz',
      OS: 'Android 15, HyperOS 2',
      Chipset: 'Dimensity 7300 Ultra',
      'Main Camera': '200MP + 8MP',
      'Selfie Lens': '20MP',
      Network: '5G, Wi-Fi 6E, Bluetooth 5.3, USB-C, NFC',
      Battery: '5500mAh, 45W',
      Colorways: 'Midnight Black, Glacier Blue',
    },
  },
  {
    id: 'xd8',
    name: 'Redmi Note 15 Pro Plus 5G',
    brand: 'Redmi',
    category: 'smartphones',
    price: 61000,
    oldPrice: 65000,
    image: 'https://i.pinimg.com/736x/72/cb/94/72cb9426d8f34783649481c65e3ce47a.jpg',
    status: 'published',
    specs: {
      RAM: '12GB',
      'Internal Storage': '512GB',
      Display: '6.77" AMOLED, 144Hz',
      OS: 'Android 15, HyperOS 2',
      Chipset: 'Dimensity 8350 Ultra',
      'Main Camera': '200MP + 8MP + 2MP',
      'Selfie Lens': '20MP',
      Network: '5G, Wi-Fi 7, Bluetooth 5.4, USB-C, NFC',
      Battery: '6200mAh, 90W',
      Colorways: 'Black, Silver, Glacier Blue',
    },
  },
];

const OPPO_DEALS: Product[] = [
  {
    id: 'od1',
    name: 'Oppo Reno15 F 5G',
    brand: 'Oppo',
    category: 'smartphones',
    price: 56000,
    oldPrice: 60000,
    image: 'https://i.pinimg.com/736x/4d/a2/10/4da2108f7a7fa7c98316acb68d1e2313.jpg',
    status: 'published',
    specs: {
      RAM: '8GB',
      'Internal Storage': '256GB',
      Display: '6.7" AMOLED, 120Hz',
      OS: 'Android 15, ColorOS 15',
      Chipset: 'Dimensity 7300',
      'Main Camera': '50MP + 2MP',
      'Selfie Lens': '16MP',
      Network: '5G, Wi-Fi 6, Bluetooth 5.4, USB-C, NFC',
      Battery: '5000mAh, 45W',
      Colorways: 'Midnight Black, Ivory White',
    },
  },
  {
    id: 'od2',
    name: 'Oppo A6x 4G',
    brand: 'Oppo',
    category: 'smartphones',
    price: 15000,
    oldPrice: 18000,
    image: 'https://i.pinimg.com/736x/c8/54/ff/c854ff91668663fbef19ab3ff152e7ac.jpg',
    status: 'published',
    specs: {
      RAM: '6GB / 8GB',
      'Internal Storage': '128GB',
      Display: '6.72" IPS LCD, 90Hz',
      OS: 'Android 14, ColorOS 14',
      Chipset: 'Mediatek Helio G85',
      'Main Camera': '50MP + 2MP',
      'Selfie Lens': '8MP',
      Network: 'Wi-Fi 5, Bluetooth 5.0, USB-C',
      Battery: '5000mAh, 33W',
      Colorways: 'Starry Black, Dawn Gold',
    },
  },
  {
    id: 'od3',
    name: 'Oppo Find X9',
    brand: 'Oppo',
    category: 'smartphones',
    price: 125000,
    oldPrice: 130000,
    image: 'https://i.pinimg.com/1200x/e7/d3/12/e7d3123976ce74406398af2a3097c7f1.jpg',
    status: 'published',
    isHotDeal: true,
    specs: {
      RAM: '16GB',
      'Internal Storage': '512GB',
      Display: '6.78" AMOLED, 120Hz',
      OS: 'Android 15, ColorOS 15',
      Chipset: 'Snapdragon 8 Elite',
      'Main Camera': '50MP + 50MP + 50MP',
      'Selfie Lens': '50MP',
      Network: '5G, Wi-Fi 7, Bluetooth 5.4, USB-C 3.2, NFC',
      Battery: '5910mAh, 80W',
      Colorways: 'Haze Black, Pearl White',
    },
  },
  {
    id: 'od4',
    name: 'Oppo Reno15 Pro',
    brand: 'Oppo',
    category: 'smartphones',
    price: 80500,
    oldPrice: 84999,
    image: 'https://i.pinimg.com/1200x/5a/1d/26/5a1d26f95a3368ac4d11627aad8d87e2.jpg',
    status: 'published',
    specs: {
      RAM: '12GB',
      'Internal Storage': '256GB',
      Display: '6.83" AMOLED, 120Hz',
      OS: 'Android 15, ColorOS 15',
      Chipset: 'Dimensity 8350',
      'Main Camera': '50MP + 50MP + 8MP',
      'Selfie Lens': '50MP',
      Network: '5G, Wi-Fi 7, Bluetooth 5.4, USB-C, NFC',
      Battery: '5800mAh, 80W',
      Colorways: 'Black, White, Champagne Gold',
    },
  },
  {
    id: 'od5',
    name: 'Oppo Reno15 5G',
    brand: 'Oppo',
    category: 'smartphones',
    price: 69500,
    oldPrice: 74999,
    image: 'https://i.pinimg.com/736x/4d/a2/10/4da2108f7a7fa7c98316acb68d1e2313.jpg',
    status: 'published',
    specs: {
      RAM: '8GB / 12GB',
      'Internal Storage': '256GB',
      Display: '6.7" AMOLED, 120Hz',
      OS: 'Android 15, ColorOS 15',
      Chipset: 'Dimensity 7300 Ultra',
      'Main Camera': '50MP + 8MP',
      'Selfie Lens': '32MP',
      Network: '5G, Wi-Fi 6E, Bluetooth 5.4, USB-C, NFC',
      Battery: '5600mAh, 45W',
      Colorways: 'Obsidian Black, Moonlight Silver',
    },
  },
  {
    id: 'od6',
    name: 'Oppo A6 Pro 4G',
    brand: 'Oppo',
    category: 'smartphones',
    price: 35000,
    oldPrice: 37000,
    image: 'https://i.pinimg.com/1200x/46/18/03/4618038a3cda02972828384c4f755e4c.jpg',
    status: 'published',
    specs: {
      RAM: '8GB',
      'Internal Storage': '256GB',
      Display: '6.7" AMOLED, 90Hz',
      OS: 'Android 14, ColorOS 14',
      Chipset: 'Mediatek Helio G99',
      'Main Camera': '64MP + 2MP',
      'Selfie Lens': '16MP',
      Network: 'Wi-Fi 5, Bluetooth 5.3, USB-C, NFC',
      Battery: '5000mAh, 33W',
      Colorways: 'Midnight Black, Gold, Forest Green',
    },
  },
  {
    id: 'od7',
    name: 'Oppo A6 Pro 5G',
    brand: 'Oppo',
    category: 'smartphones',
    price: 42000,
    oldPrice: 44500,
    image: 'https://i.pinimg.com/736x/8e/7c/77/8e7c77724035346bd24d4551cc176650.jpg',
    status: 'published',
    specs: {
      RAM: '8GB / 12GB',
      'Internal Storage': '256GB',
      Display: '6.7" AMOLED, 120Hz',
      OS: 'Android 15, ColorOS 15',
      Chipset: 'Dimensity 6300',
      'Main Camera': '64MP + 2MP',
      'Selfie Lens': '16MP',
      Network: '5G, Wi-Fi 6, Bluetooth 5.3, USB-C, NFC',
      Battery: '5000mAh, 45W',
      Colorways: 'Midnight Black, Silver, Sage Green',
    },
  },
  {
    id: 'od8',
    name: 'Oppo Reno14 F 5G',
    brand: 'Oppo',
    category: 'smartphones',
    price: 55000,
    oldPrice: 65000,
    image: 'https://i.pinimg.com/1200x/ab/ee/52/abee52c52429628d717537e84d297d18.jpg',
    status: 'published',
    isHotDeal: true,
    specs: {
      RAM: '8GB',
      'Internal Storage': '256GB',
      Display: '6.67" AMOLED, 120Hz',
      OS: 'Android 14, ColorOS 14',
      Chipset: 'Dimensity 6300',
      'Main Camera': '50MP + 2MP',
      'Selfie Lens': '16MP',
      Network: '5G, Wi-Fi 6, Bluetooth 5.3, USB-C, NFC',
      Battery: '5000mAh, 45W',
      Colorways: 'Midnight Black, Dreamy Purple, Island Green',
    },
  },
];

const INFINIX_DEALS: Product[] = [
  {
    id: 'in1',
    name: 'Infinix Smart 20',
    brand: 'Infinix',
    category: 'smartphones',
    price: 14300,
    oldPrice: 15500,
    image: 'https://i.pinimg.com/736x/bc/04/13/bc0413c8fa37aed8e889bb10a4a4126f.jpg',
    status: 'published',
    specs: {
      RAM: '4GB / 6GB',
      'Internal Storage': '64GB / 128GB',
      Display: '6.67" IPS LCD, 90Hz',
      OS: 'Android 14, XOS 14',
      Chipset: 'Unisoc T606',
      'Main Camera': '13MP + AI Lens',
      'Selfie Lens': '8MP',
      Network: 'Wi-Fi 5, Bluetooth 5.0, USB-C',
      Battery: '5000mAh, 18W',
      Colorways: 'Cyber Black, Glacier Blue, Lime Green',
    },
  },
  {
    id: 'in2',
    name: 'Infinix Note 60 Pro 5G',
    brand: 'Infinix',
    category: 'smartphones',
    price: 41000,
    oldPrice: 42000,
    image: 'https://i.pinimg.com/736x/96/dd/97/96dd973b4b048e34a7a289453338f9ba.jpg',
    status: 'published',
    specs: {
      RAM: '8GB / 12GB',
      'Internal Storage': '256GB',
      Display: '6.78" AMOLED, 144Hz',
      OS: 'Android 15, XOS 15',
      Chipset: 'Dimensity 7300 Ultimate',
      'Main Camera': '108MP + 2MP + AI',
      'Selfie Lens': '32MP',
      Network: '5G, Wi-Fi 6, Bluetooth 5.3, USB-C, NFC',
      Battery: '5000mAh, 45W',
      Colorways: 'Midnight Black, Dreamy Violet, Starlight Silver',
    },
  },
  {
    id: 'in3',
    name: 'Infinix Note Edge 5G',
    brand: 'Infinix',
    category: 'smartphones',
    price: 32000,
    oldPrice: 33000,
    image: 'https://i.pinimg.com/736x/29/db/a0/29dba0a326c222d17ad7804238b6c8b0.jpg',
    status: 'published',
    isHotDeal: true,
    specs: {
      RAM: '8GB / 12GB',
      'Internal Storage': '256GB',
      Display: '6.78" AMOLED, 144Hz, Curved',
      OS: 'Android 15, XOS 15',
      Chipset: 'Dimensity 7300 Ultra',
      'Main Camera': '108MP + 2MP',
      'Selfie Lens': '32MP',
      Network: '5G, Wi-Fi 6E, Bluetooth 5.4, USB-C, NFC',
      Battery: '5000mAh, 45W',
      Colorways: 'Midnight Black, Pearl White, Gold',
    },
  },
  {
    id: 'in4',
    name: 'Infinix GT 30 Pro',
    brand: 'Infinix',
    category: 'smartphones',
    price: 37500,
    oldPrice: 40999,
    image: 'https://i.pinimg.com/736x/81/cf/bc/81cfbc9cd6fe1d2ab2794f809ee7a65d.jpg',
    status: 'published',
    specs: {
      RAM: '12GB',
      'Internal Storage': '256GB',
      Display: '6.78" AMOLED, 144Hz',
      OS: 'Android 15, XOS 15',
      Chipset: 'Dimensity 8350 Gaming Edition',
      'Main Camera': '64MP + 13MP + 2MP',
      'Selfie Lens': '32MP',
      Network: '5G, Wi-Fi 7, Bluetooth 5.4, USB-C, NFC',
      Battery: '5000mAh, 45W',
      Colorways: 'Dark Matter, Starlight Silver, Gunmetal',
    },
  },
  {
    id: 'in5',
    name: 'Infinix Hot 60 Pro Plus',
    brand: 'Infinix',
    category: 'smartphones',
    price: 27500,
    oldPrice: 28500,
    image: 'https://i.pinimg.com/736x/17/e2/aa/17e2aa34a94ec3b1c634e1706ee6c152.jpg',
    status: 'published',
    isHotDeal: true,
    specs: {
      RAM: '8GB',
      'Internal Storage': '256GB',
      Display: '6.78" AMOLED, 120Hz',
      OS: 'Android 15, XOS 15',
      Chipset: 'Mediatek Helio G100 Ultra',
      'Main Camera': '50MP + 2MP',
      'Selfie Lens': '16MP',
      Network: 'Wi-Fi 5, Bluetooth 5.0, USB-C',
      Battery: '5000mAh, 33W',
      Colorways: 'Midnight Black, Ivory White, Horizon Gold',
    },
  },
  {
    id: 'in6',
    name: 'Infinix Hot 60i 4G',
    brand: 'Infinix',
    category: 'smartphones',
    price: 14500,
    oldPrice: 17800,
    image: 'https://i.pinimg.com/736x/c5/fb/6b/c5fb6b96ee154a58cf5bdaf20dd81274.jpg',
    status: 'published',
    specs: {
      RAM: '4GB / 6GB',
      'Internal Storage': '128GB',
      Display: '6.67" IPS LCD, 90Hz',
      OS: 'Android 14, XOS 14',
      Chipset: 'Mediatek Helio G81 Ultra',
      'Main Camera': '50MP + AI Lens',
      'Selfie Lens': '8MP',
      Network: 'Wi-Fi 5, Bluetooth 5.0, USB-C',
      Battery: '5000mAh, 18W',
      Colorways: 'Midnight Black, Horizon Gold, Dreamy Purple',
    },
  },
  {
    id: 'in7',
    name: 'Infinix Smart 10',
    brand: 'Infinix',
    category: 'smartphones',
    price: 11300,
    oldPrice: 12000,
    image: 'https://i.pinimg.com/736x/eb/ed/01/ebed01d4b93187565b472cb3d11f5fe8.jpg',
    status: 'published',
    specs: {
      RAM: '3GB / 4GB',
      'Internal Storage': '64GB',
      Display: '6.56" IPS LCD',
      OS: 'Android 14 Go, XOS 14',
      Chipset: 'Unisoc SC9863A',
      'Main Camera': '13MP + AI Lens',
      'Selfie Lens': '5MP',
      Network: 'Wi-Fi 4, Bluetooth 4.2, USB-C',
      Battery: '5000mAh, 10W',
      Colorways: 'Obsidian Black, Glacier Blue, Lime Green',
    },
  },
  {
    id: 'in8',
    name: 'Infinix Note 50 Pro 4G',
    brand: 'Infinix',
    category: 'smartphones',
    price: 30000,
    oldPrice: 32400,
    image: 'https://i.pinimg.com/1200x/ab/ee/52/abee52c52429628d717537e84d297d18.jpg',
    status: 'published',
    specs: {
      RAM: '8GB / 12GB',
      'Internal Storage': '256GB',
      Display: '6.78" AMOLED, 120Hz',
      OS: 'Android 15, XOS 15',
      Chipset: 'Mediatek Helio G100 Ultra',
      'Main Camera': '108MP + 2MP',
      'Selfie Lens': '32MP',
      Network: 'Wi-Fi 6, Bluetooth 5.3, USB-C, NFC',
      Battery: '5000mAh, 45W',
      Colorways: 'Zebrawood Edition, Midnight Black, Dreamy Violet',
    },
  },
];
 
const NOTHING_DEALS: Product[] = [
  {
    id: 'nd1',
    name: 'Nothing Phone 4 (a) Pro',
    brand: 'Nothing',
    category: 'smartphones',
    price: 0,
    oldPrice: 0,
    image: 'https://i.pinimg.com/736x/47/dd/d5/47ddd54a929fc0bead7ba92208a14536.jpg',
    status: 'out_of_stock',
    specs: {
      RAM: '12GB',
      'Internal Storage': '256GB',
      Display: '6.77" AMOLED, 120Hz',
      OS: 'Android 15, Nothing OS 3.2',
      Chipset: 'Snapdragon 7s Gen 4',
      'Main Camera': '50MP + 50MP',
      'Selfie Lens': '32MP',
      Network: '5G, Wi-Fi 6E, Bluetooth 5.4, USB-C, NFC',
      Battery: '5200mAh, 65W',
      Colorways: 'Black, White',
    },
  },
  {
    id: 'nd2',
    name: 'Nothing Phone 4 (a) 5G',
    brand: 'Nothing',
    category: 'smartphones',
    price: 52000,
    oldPrice: 0,
    image: 'https://i.pinimg.com/1200x/ab/80/77/ab80772773f3d01a9febc4359737b7e0.jpg',
    status: 'published',
    specs: {
      RAM: '8GB / 12GB',
      'Internal Storage': '256GB',
      Display: '6.77" AMOLED, 120Hz',
      OS: 'Android 15, Nothing OS 3.2',
      Chipset: 'Dimensity 7300 Pro',
      'Main Camera': '50MP + 50MP',
      'Selfie Lens': '32MP',
      Network: '5G, Wi-Fi 6E, Bluetooth 5.3, USB-C, NFC',
      Battery: '5000mAh, 50W',
      Colorways: 'Black, White',
    },
  },
  {
    id: 'nd3',
    name: 'Nothing phone 3A Lite',
    brand: 'Nothing',
    category: 'smartphones',
    price: 36000,
    oldPrice: 0,
    image: 'https://www.phoneplacekenya.com/wp-content/uploads/2025/11/Nothing-phone-3A-Lite.webp',
    status: 'published',
    specs: {
      RAM: '6GB / 8GB',
      'Internal Storage': '128GB',
      Display: '6.77" AMOLED, 120Hz',
      OS: 'Android 15, Nothing OS 3.1',
      Chipset: 'Snapdragon 7s Gen 3',
      'Main Camera': '50MP + 8MP',
      'Selfie Lens': '16MP',
      Network: '5G, Wi-Fi 6, Bluetooth 5.3, USB-C, NFC',
      Battery: '5000mAh, 45W',
      Colorways: 'White, Black, Lime Green',
    },
  },
  {
    id: 'nd4',
    name: 'Nothing Phone (3)',
    brand: 'Nothing',
    category: 'smartphones',
    price: 85500,
    oldPrice: 0,
    image: 'https://www.phoneplacekenya.com/wp-content/uploads/2025/10/Nothing-Phone-3.jpg',
    status: 'published',
    isHotDeal: true,
    specs: {
      RAM: '12GB / 16GB',
      'Internal Storage': '256GB / 512GB',
      Display: '6.77" LTPO AMOLED, 1-120Hz',
      OS: 'Android 15, Nothing OS 3.0',
      Chipset: 'Snapdragon 8s Gen 4',
      'Main Camera': '50MP + 50MP + 50MP',
      'Selfie Lens': '50MP',
      Network: '5G, Wi-Fi 7, Bluetooth 5.4, USB-C 3.2, NFC',
      Battery: '5150mAh, 65W',
      Colorways: 'Black, White, Olive Green',
    },
  },
  {
    id: 'nd5',
    name: 'Nothing Phone 3a',
    brand: 'Nothing',
    category: 'smartphones',
    price: 43000,
    oldPrice: 0,
    image: 'https://www.phoneplacekenya.com/wp-content/uploads/2025/02/Nothing-Phone-3a-b.jpg',
    status: 'published',
    specs: {
      RAM: '8GB / 12GB',
      'Internal Storage': '128GB / 256GB',
      Display: '6.77" AMOLED, 120Hz',
      OS: 'Android 15, Nothing OS 3.1',
      Chipset: 'Snapdragon 7s Gen 3',
      'Main Camera': '50MP + 50MP + 8MP',
      'Selfie Lens': '32MP',
      Network: '5G, Wi-Fi 6, Bluetooth 5.3, USB-C, NFC',
      Battery: '5000mAh, 50W',
      Colorways: 'White, Black, Blue',
    },
  },
  {
    id: 'nd6',
    name: 'Nothing Phone 3a Pro',
    brand: 'Nothing',
    category: 'smartphones',
    price: 60000,
    oldPrice: 63000,
    image: 'https://www.phoneplacekenya.com/wp-content/uploads/2025/02/Nothing-Phone-3a-Pro-a.jpg',
    status: 'published',
    specs: {
      RAM: '12GB',
      'Internal Storage': '256GB',
      Display: '6.77" AMOLED, 120Hz',
      OS: 'Android 15, Nothing OS 3.1',
      Chipset: 'Snapdragon 7s Gen 3',
      'Main Camera': '50MP + 50MP + 50MP',
      'Selfie Lens': '32MP',
      Network: '5G, Wi-Fi 6E, Bluetooth 5.3, USB-C, NFC',
      Battery: '5000mAh, 50W',
      Colorways: 'Black, White',
    },
  },
  {
    id: 'nd7',
    name: 'Nothing Phone 2a Plus',
    brand: 'Nothing',
    category: 'smartphones',
    price: 49000,
    oldPrice: 51000,
    image: 'https://www.phoneplacekenya.com/wp-content/uploads/2024/08/Nothing-Phone-2a-Plus-a.jpg',
    status: 'published',
    specs: {
      RAM: '12GB',
      'Internal Storage': '256GB',
      Display: '6.7" AMOLED, 120Hz',
      OS: 'Android 14, Nothing OS 2.6',
      Chipset: 'Dimensity 7350 Pro',
      'Main Camera': '50MP + 50MP',
      'Selfie Lens': '50MP',
      Network: '5G, Wi-Fi 6E, Bluetooth 5.3, USB-C, NFC',
      Battery: '5000mAh, 45W',
      Colorways: 'Black, White',
    },
  },
  {
    id: 'nd8',
    name: 'Nothing CMF Phone 1',
    brand: 'Nothing',
    category: 'smartphones',
    price: 32000,
    oldPrice: 34000,
    image: 'https://www.phoneplacekenya.com/wp-content/uploads/2024/07/Nothing-CMF-Phone-1-a.jpg',
    status: 'published',
    specs: {
      RAM: '8GB',
      'Internal Storage': '128GB / 256GB',
      Display: '6.67" AMOLED, 120Hz',
      OS: 'Android 14, Nothing OS 2.6',
      Chipset: 'Dimensity 7300 Pro',
      'Main Camera': '50MP + 2MP',
      'Selfie Lens': '16MP',
      Network: '5G, Wi-Fi 6, Bluetooth 5.3, USB-C, NFC',
      Battery: '5000mAh, 33W',
      Colorways: 'Black, White, Blue, Orange',
    },
  },
];

const FALLBACK_DEALS: Product[] = [
  {
    id: 'fd1',
    name: 'iPhone 17 Pro Max',
    brand: 'Apple',
    category: 'iphones',
    price: 210000,
    oldPrice: 225000,
    image: 'https://i.pinimg.com/736x/9a/cd/80/9acd80fde83863f692d3349470013137.jpg',
    status: 'published',
    isHotDeal: true,
  },
  {
    id: 'fd2',
    name: 'Samsung Galaxy S25 Ultra',
    brand: 'Samsung',
    category: 'phones',
    price: 185000,
    oldPrice: 195000,
    image: 'https://i.pinimg.com/736x/d8/e6/9f/d8e69f9b36b7a2cf0a3add6d0d83498a.jpg',
    status: 'published',
    isHotDeal: true,
  },
  {
    id: 'fd5',
    name: 'Infinix Note 50 Pro+',
    brand: 'Infinix',
    category: 'smartphones',
    price: 185000,
    oldPrice: 200000,
    image: 'https://i.pinimg.com/736x/f1/46/76/f146768d0ed21c5b0710ab5982dc9a52.jpg',
    status: 'published',
    isHotDeal: true,
  },
  {
    id: 'fd6',
    name: 'Tecno Camon 40 Pro',
    brand: 'Tecno',
    category: 'smartphones',
    price: 38000,
    oldPrice: 42000,
    image: 'https://i.pinimg.com/736x/0c/70/88/0c70889624de9327adac6b4899ba6b6d.jpg',
    status: 'published',
    isHotDeal: true,
  },
  {
    id: 'fd7',
    name: 'Xiaomi 17 Pro',
    brand: 'Xiaomi',
    category: 'smartphones',
    price: 95000,
    oldPrice: 105000,
    image: 'https://i.pinimg.com/1200x/74/da/de/74dade62789f9ad72bf6ea604ede8aa4.jpg',
    status: 'published',
    isHotDeal: true,
  },
] as any;

/* ═══════════════════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════════════════════ */
function XiaomiDealCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const discount = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
  const unavailable = !product.price || product.status === 'out_of_stock';

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-3 group hover:shadow-xl transition-all duration-300">
      <Link to={`/product/${product.id}`} state={{ product }} className="relative aspect-square mb-2 block">
        {discount > 0 && (
          <div className="absolute top-0 left-0 flex flex-col gap-1 z-10">
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase">
              Offer
            </span>
            {product.isHotDeal && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase">
                Hot
              </span>
            )}
          </div>
        )}
        <div className="absolute top-0 right-0 w-8 h-8 bg-white/90 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-rose-500 z-10">
          <Heart size={14} />
        </div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="flex-1">
        <Link to={`/product/${product.id}`} state={{ product }}>
          <h3 className="text-[14px] font-bold text-slate-900 leading-tight mb-0.5 hover:text-brand-green transition-colors">{product.name}</h3>
        </Link>
        <p className="text-[11px] text-slate-400 font-semibold">{product.brand}</p>
        <div className="flex items-center gap-2 mt-3">
          {unavailable ? (
            <span className="text-slate-400 text-[12px] font-semibold">Coming Soon</span>
          ) : (
            <>
              <span className="text-rose-600 font-bold text-base">
                KSh {product.price.toLocaleString()}
              </span>
              {product.oldPrice && product.oldPrice > 0 && (
                <span className="text-slate-400 line-through text-[11px]">
                  KSh {product.oldPrice.toLocaleString()}
                </span>
              )}
            </>
          )}
        </div>
      </div>
      <button
        onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
        disabled={unavailable}
        className="mt-4 w-full py-2.5 border border-brand-green text-slate-900 text-[12px] font-bold rounded bg-white hover:bg-brand-green hover:text-white transition-all uppercase tracking-wide disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-900"
      >
        {unavailable ? 'Out of Stock' : 'Buy Now'}
      </button>
    </div>
  );
}

export default function Home() {
  const { data: featuredData, isLoading: isFeaturedLoading } = useFeaturedContent();
  const { data: metadata, isLoading: isMetaLoading } = useMetadata();
  const { data: allProducts = [], isLoading: isAllLoading } = useProducts();

  const { featured = [], hotDeals = [] } = featuredData || {};
  const { brands = [] } = metadata || {};

  const isLoading = isFeaturedLoading || isMetaLoading;

  /* Brand/category filtered rows */
  const iPhoneProducts = allProducts.filter(
    (p) => p.category === 'iphones' || (p.brand === 'Apple' && p.category !== 'apple-laptops')
  );
  const samsungProducts = allProducts.filter((p) => p.brand === 'Samsung');
  const laptopProducts = allProducts.filter(
    (p) => p.category === 'laptops' || p.category === 'apple-laptops'
  );
  const androidProducts = allProducts.filter(
    (p) => p.category === 'smartphones' && p.brand !== 'Apple'
  );
  const accessoryProducts = allProducts.filter((p) =>
    ['accessories', 'audio', 'powerbanks', 'protection'].includes(p.category)
  );

  return (
    <div className="bg-white min-h-screen">

      {/* ══ Hero Slider ══════════════════════════════════════ */}
      <HeroSlider />

      {/* ══ Category icon bar ══════════════════════════════ */}
      <CategoryIconBar />

      {/* ══ USP / Trust strip ══════════════════════════════ */}
      <section className="bg-white border-b border-slate-100 py-5">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[
              {
                icon: Truck,
                title: 'Fast Delivery',
                desc: 'Nairobi same day · Countrywide 24h',
                color: 'text-brand-green',
                bg: 'bg-brand-green/10',
              },
              {
                icon: ShieldCheck,
                title: 'Genuine Products',
                desc: 'All items 100% authentic',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
              },
              {
                icon: RotateCcw,
                title: '7-Day Returns',
                desc: 'Easy hassle-free exchange',
                color: 'text-violet-600',
                bg: 'bg-violet-50',
              },
              {
                icon: Headphones,
                title: 'Expert Support',
                desc: 'Mon–Sat, 8am–8pm',
                color: 'text-amber-600',
                bg: 'bg-amber-50',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}
                >
                  <item.icon size={18} className={item.color} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-900 leading-tight">{item.title}</p>
                  <p className="text-[11px] text-slate-500 leading-tight hidden sm:block">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Hot Deals ══════════════════════════════════════ */}
      <section className="py-8 md:py-10 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between mb-6">
            <div className="flex items-start gap-3">
              <div className="w-1 min-h-[40px] rounded-full bg-rose-500 shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-1 text-rose-500 flex items-center gap-1.5">
                  <Zap size={11} fill="currentColor" />
                  Limited Time
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  Hot Deals
                </h2>
              </div>
            </div>
            <Link
              to="/deals"
              className="flex items-center gap-1 text-[12px] font-semibold text-slate-500 hover:text-rose-500 transition-colors shrink-0 ml-4"
            >
              See all deals
              <ChevronRight size={14} />
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
              {(hotDeals.length > 0 ? hotDeals : FALLBACK_DEALS).slice(0, 6).map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 3} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ Category Highlights Grid ════════════════════════ */}
      <section className="py-12 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading title="Shop by Category" accent="green" />
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORY_GROUPS.map((group) => (
              <div
                key={group.title}
                className="group bg-slate-50 rounded-2xl p-6 flex items-start gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                {/* Left side: Image */}
                <div className="w-2/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={group.image}
                    alt={group.title}
                    className="max-h-[120px] w-auto object-contain mix-blend-multiply"
                  />
                </div>

                {/* Right side: Content */}
                <div className="w-3/5 flex flex-col gap-3 py-1">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none mb-1">
                    {group.title}
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    {group.items.map((item) => (
                      <Link
                        key={item.name}
                        to={item.link}
                        className="text-[13px] text-slate-600 hover:text-brand-green transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <Link
                    to={group.mainLink}
                    className="mt-1 text-[13px] font-bold text-brand-green flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Shop More <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Xiaomi Deals Section ═════════════════════════════ */}
      <section className="py-12 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8 border-b-2 border-brand-green/30 pb-3">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Xiaomi Deals</h2>
            <Link to="/shop?brand=xiaomi" className="text-[13px] font-semibold text-slate-500 hover:text-brand-green transition-colors">
              View all Xiaomi <ChevronRight size={14} className="inline" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {XIAOMI_DEALS.map((product) => (
              <XiaomiDealCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ Oppo Deals Section ═══════════════════════════════ */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8 border-b-2 border-brand-green/30 pb-3">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Oppo Deals</h2>
            <Link to="/shop?brand=oppo" className="text-[13px] font-semibold text-slate-500 hover:text-brand-green transition-colors">
              View all Oppo <ChevronRight size={14} className="inline" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OPPO_DEALS.map((product) => (
              <XiaomiDealCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ Infinix Deals Section ════════════════════════════ */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8 border-b-2 border-brand-green/30 pb-3">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Infinix Deals</h2>
            <Link to="/shop?brand=infinix" className="text-[13px] font-semibold text-slate-500 hover:text-brand-green transition-colors">
              View all Infinix <ChevronRight size={14} className="inline" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INFINIX_DEALS.map((product) => (
              <XiaomiDealCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
 
      {/* ══ Nothing Deals Section ═════════════════════════════ */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-8 border-b-2 border-brand-green/30 pb-3">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Nothing Deals</h2>
            <Link to="/shop?brand=nothing" className="text-[13px] font-semibold text-slate-500 hover:text-brand-green transition-colors">
              View all Nothing <ChevronRight size={14} className="inline" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {NOTHING_DEALS.map((product) => (
              <XiaomiDealCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>


      {/* ══ Featured Products ════════════════════════════════ */}
      <ProductRow
        eyebrow="Handpicked"
        title="Featured Products"
        viewAllLink="/shop"
        viewAllLabel="View All"
        products={featured}
        isLoading={isLoading}
        maxItems={5}
      />

      {/* ══ iPhone Deals row ═════════════════════════════════ */}
      {(iPhoneProducts.length > 0 || isAllLoading) && (
        <section className="py-8 md:py-10 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex items-end justify-between mb-6">
              <div className="flex items-start gap-3">
                <div className="w-1 min-h-[40px] rounded-full bg-slate-900 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-1 text-slate-500">
                    Apple
                  </p>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                    iPhone Deals
                  </h2>
                </div>
              </div>
              <Link
                to="/shop?category=iphones"
                className="flex items-center gap-1 text-[12px] font-semibold text-slate-500 hover:text-brand-green transition-colors shrink-0 ml-4"
              >
                All iPhones <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {isAllLoading
                ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
                : iPhoneProducts.slice(0, 5).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ Samsung row ══════════════════════════════════════ */}
      <ProductRow
        eyebrow="Samsung"
        title="Galaxy Collection"
        viewAllLink="/shop?brand=samsung"
        viewAllLabel="All Samsung"
        products={samsungProducts}
        isLoading={isAllLoading}
        accent="blue"
        maxItems={5}
      />

      {/* ══ Promo banner ═════════════════════════════════════ */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Laptop promo */}
            <Link
              to="/shop?category=laptops"
              className="group relative bg-indigo-600 rounded-2xl overflow-hidden p-6 md:p-8 flex items-center gap-6 hover:bg-indigo-700 transition-colors min-h-[140px]"
            >
              <div className="relative z-10">
                <p className="text-indigo-200 text-[11px] font-bold uppercase tracking-widest mb-1">
                  Laptops & Computers
                </p>
                <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight mb-3">
                  Power Your Work
                </h3>
                <span className="inline-flex items-center gap-1.5 bg-white text-indigo-700 text-[12px] font-bold px-4 py-2 rounded-lg group-hover:bg-indigo-50 transition-colors">
                  Shop Laptops <ArrowRight size={13} />
                </span>
              </div>
              <div className="ml-auto shrink-0 opacity-20">
                <Laptop size={80} className="text-white" strokeWidth={1} />
              </div>
            </Link>

            {/* Accessories promo */}
            <Link
              to="/shop?category=accessories"
              className="group relative bg-teal-600 rounded-2xl overflow-hidden p-6 md:p-8 flex items-center gap-6 hover:bg-teal-700 transition-colors min-h-[140px]"
            >
              <div className="relative z-10">
                <p className="text-teal-200 text-[11px] font-bold uppercase tracking-widest mb-1">
                  Accessories & Gear
                </p>
                <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight mb-3">
                  Complete Your Setup
                </h3>
                <span className="inline-flex items-center gap-1.5 bg-white text-teal-700 text-[12px] font-bold px-4 py-2 rounded-lg group-hover:bg-teal-50 transition-colors">
                  Shop Accessories <ArrowRight size={13} />
                </span>
              </div>
              <div className="ml-auto shrink-0 opacity-20">
                <Plug size={80} className="text-white" strokeWidth={1} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ Laptop row ═══════════════════════════════════════ */}
      <ProductRow
        eyebrow="Computers"
        title="Laptops & MacBooks"
        viewAllLink="/shop?category=laptops"
        viewAllLabel="All Laptops"
        products={laptopProducts}
        isLoading={isAllLoading}
        maxItems={5}
      />

      {/* ══ Android phones row ══════════════════════════════ */}
      <ProductRow
        eyebrow="Android"
        title="Android Smartphones"
        viewAllLink="/shop?category=smartphones"
        viewAllLabel="View All"
        products={androidProducts}
        isLoading={isAllLoading}
        maxItems={5}
      />

      {/* ══ Accessories row ══════════════════════════════════  */}
      <ProductRow
        eyebrow="Accessories"
        title="Audio, Cases & More"
        viewAllLink="/shop?category=accessories"
        viewAllLabel="View All"
        products={accessoryProducts}
        isLoading={isAllLoading}
        maxItems={5}
      />

      {/* ══ Brand grid ═══════════════════════════════════════ */}
      <BrandGrid brands={brands} />

      {/* ══ Why Mobimax ══════════════════════════════════════ */}
      <section className="py-12 md:py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Why Choose Mobimax?
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Kenya's trusted electronics destination for genuine products, competitive prices, and
              exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: '100% Genuine',
                desc: 'Every product verified for authenticity before listing',
                color: 'text-brand-green',
                bg: 'bg-brand-green/10',
              },
              {
                icon: Truck,
                title: 'Fast Delivery',
                desc: 'Same-day delivery in Nairobi, next-day countrywide',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
              },
              {
                icon: RotateCcw,
                title: '7-Day Returns',
                desc: 'Not satisfied? Return within 7 days for a full exchange',
                color: 'text-violet-600',
                bg: 'bg-violet-50',
              },
              {
                icon: Headphones,
                title: 'Dedicated Support',
                desc: 'Expert team available via call, WhatsApp, or in-store',
                color: 'text-amber-600',
                bg: 'bg-amber-50',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center p-5 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${item.bg}`}
                >
                  <item.icon size={24} className={item.color} strokeWidth={1.8} />
                </div>
                <h3 className="text-[14px] font-bold text-slate-900 mb-1.5">{item.title}</h3>
                <p className="text-[12px] text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══ Authentic Experience ═════════════════════════════ */}
      <section className="bg-[#0d1117] py-16 md:py-20 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <p className="text-brand-green text-[11px] font-bold uppercase tracking-[0.4em] mb-4">
            Official Partner
          </p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-12 leading-none">
            Authentic Experience
          </h2>

          {/* Brand strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mb-12">
            {['Samsung', 'Apple', 'Google', 'Oraimo', 'Xiaomi', 'Oppo', 'Sony', 'JBL'].map((brand) => (
              <span
                key={brand}
                className="text-slate-600 text-lg md:text-2xl font-black uppercase italic tracking-widest hover:text-slate-400 transition-colors cursor-default"
              >
                {brand}
              </span>
            ))}
          </div>

          <div className="border-t border-white/10 mb-12" />

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '70+', label: 'Premium Brands', color: 'text-brand-green' },
              { value: '10K+', label: 'Happy Customers', color: 'text-white' },
              { value: '24H', label: 'Speed Delivery', color: 'text-rose-500' },
              { value: '99%', label: 'Customer Satisfaction', color: 'text-white' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2">
                <span className={`text-5xl md:text-6xl font-black tracking-tight ${stat.color}`}>
                  {stat.value}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
