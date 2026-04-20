import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Phone,
  MapPin,
  Zap,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Gamepad2,
  Camera,
  BatteryCharging,
  Tablet,
  Package,
  Plug,
  Monitor,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { useStore } from '../../store/useStore';
import { useMetadata } from '../../hooks/useCatalog';

/* ── Category icon map ─────────────────────────────────── */
const ICON_MAP: Record<string, React.ElementType> = {
  iphones: Smartphone,
  smartphones: Smartphone,
  samsung: Smartphone,
  tablets: Tablet,
  laptops: Laptop,
  'apple-laptops': Laptop,
  monitors: Monitor,
  audio: Headphones,
  watches: Watch,
  gaming: Gamepad2,
  photography: Camera,
  accessories: Plug,
  powerbanks: BatteryCharging,
  protection: Package,
};


const NAV_LINKS = [
  {
    label: 'Samsung',
    to: '/shop?brand=samsung',
    children: [
      { name: 'Samsung Phones', link: '/shop?brand=samsung&category=phones' },
      { name: 'Galaxy Buds', link: '/shop?brand=samsung&subcategory=Galaxy+Buds' },
      { name: 'Galaxy Tablet', link: '/shop?brand=samsung&category=tablets' },
      { name: 'Galaxy Watch', link: '/shop?brand=samsung&subcategory=Galaxy+Watch' },
    ]
  },
  {
    label: 'Apple',
    to: '/shop?brand=apple',
    color: 'text-brand-green',
    children: [
      { name: 'Apple iPhone', link: '/shop?brand=apple&category=phones' },
      { name: 'Apple iPad', link: '/shop?brand=apple&category=tablets' },
      { name: 'AirPods', link: '/shop?brand=apple&subcategory=AirPods' },
      { name: 'Apple Pencil', link: '/shop?brand=apple&subcategory=Apple+Pencil' },
      { name: 'Apple Watch', link: '/shop?brand=apple&subcategory=Apple+Watch' },
      { name: 'iMac', link: '/shop?brand=apple&subcategory=iMac' },
      { name: 'MacBooks', link: '/shop?brand=apple&category=laptops' },
    ]
  },
  {
    label: 'Smartphones',
    to: '/shop?category=phones',
    color: 'text-brand-green',
    children: [
      { name: 'Motorola Phones', link: '/shop?category=phones&brand=motorola' },
      { name: 'Infinix Phones', link: '/shop?category=phones&brand=infinix' },
      { name: 'Tecno Phones', link: '/shop?category=phones&brand=tecno' },
      { name: 'Xiaomi Phones', link: '/shop?category=phones&brand=xiaomi' },
      { name: 'Oppo Phones', link: '/shop?category=phones&brand=oppo' },
      { name: 'Google Pixel Phones', link: '/shop?category=phones&brand=google' },
      { name: 'Nothing Phones', link: '/shop?category=phones&brand=nothing' },
      { name: 'Oneplus Phones', link: '/shop?category=phones&brand=oneplus' },
      { name: 'Vivo Phones', link: '/shop?category=phones&brand=vivo' },
      { name: 'Itel Phones', link: '/shop?category=phones&brand=itel' },
      { name: 'HMD Phones', link: '/shop?category=phones&brand=hmd' },
      { name: 'Redmi Phones', link: '/shop?category=phones&brand=redmi' },
      { name: 'Realme Phones', link: '/shop?category=phones&brand=realme' },
      { name: 'Poco Phones', link: '/shop?category=phones&brand=poco' },
      { name: 'Foldable Phones', link: '/shop?category=phones&subcategory=Foldable+Phones' },
      { name: 'Honor Phones', link: '/shop?category=phones&brand=honor' },
      { name: 'Blackview Phones', link: '/shop?category=phones&brand=blackview' },
      { name: 'ZTE Phones', link: '/shop?category=phones&brand=zte' },
      { name: 'Philips Phones', link: '/shop?category=phones&brand=philips' },
      { name: 'Sony Xperia Phones', link: '/shop?category=phones&brand=sony' },
    ]
  },
  {
    label: 'Accessories',
    to: '/shop?category=accessories',
    children: [
      { name: 'Apple Accessories', link: '/shop?category=accessories&subcategory=Apple+Accessories' },
      { name: 'Smart Glasses', link: '/shop?category=accessories&subcategory=Smart+Glasses' },
      { name: 'Samsung Accessories', link: '/shop?category=accessories&subcategory=Samsung+Accessories' },
      { name: 'Smartwatches', link: '/shop?category=accessories&subcategory=Smartwatches' },
      { name: 'Chargers', link: '/shop?category=accessories&subcategory=Chargers' },
      { name: 'Powerbank', link: '/shop?category=accessories&subcategory=Powerbank' },
      { name: 'Smart Bands', link: '/shop?category=accessories&subcategory=Smart+Bands' },
      { name: 'Media Streamers', link: '/shop?category=accessories&subcategory=Media+Streamers' },
      { name: 'Phone Covers', link: '/shop?category=accessories&subcategory=Phone+Covers' },
      { name: 'Protectors', link: '/shop?category=accessories&subcategory=Protectors' },
    ]
  },
  {
    label: 'Audio',
    to: '/shop?category=audio',
    children: [
      { name: 'Buds', link: '/shop?category=audio&subcategory=Buds' },
      { name: 'Speakers', link: '/shop?category=audio&subcategory=Speakers' },
      { name: 'Headphones', link: '/shop?category=audio&subcategory=Headphones' },
      { name: 'In-Ear Headphones', link: '/shop?category=audio&subcategory=In-Ear+Headphones' },
      { name: 'Soundbar', link: '/shop?category=audio&subcategory=Soundbar' },
      { name: 'Microphones', link: '/shop?category=audio&subcategory=Microphones' },
    ]
  },
  {
    label: 'Gaming',
    to: '/shop?category=gaming',
    children: [
      { name: 'Gaming Console', link: '/shop?category=gaming&subcategory=Consoles' },
      { name: 'PS5 Games', link: '/shop?category=gaming&subcategory=Games' },
      { name: 'Gaming Controllers', link: '/shop?category=gaming&subcategory=Controllers' },
      { name: 'Gaming Headsets', link: '/shop?category=gaming&subcategory=Headsets' },
      { name: 'Gaming Phones', link: '/shop?category=gaming&subcategory=Gaming+Phones' }
    ]
  },
  {
    label: 'Storage',
    to: '/shop?category=accessories&subcategory=Storage',
    children: [
      { name: 'Flash Drives', link: '/shop?category=accessories&subcategory=Flash+Drives' },
      { name: 'Hard Drives', link: '/shop?category=accessories&subcategory=Hard+Drives' },
      { name: 'Memory Cards', link: '/shop?category=accessories&subcategory=Memory+Cards' },
      { name: 'USB Hubs', link: '/shop?category=accessories&subcategory=USB+Hubs' }
    ]
  },
  {
    label: 'Tablets',
    to: '/shop?category=tablets',
    children: [
      { name: 'Amazon', link: '/shop?category=tablets&brand=amazon' },
      { name: 'Apple iPad', link: '/shop?category=tablets&brand=apple' },
      { name: 'ElimuTab', link: '/shop?category=tablets&brand=elimutab' },
      { name: 'Galaxy Tablet', link: '/shop?category=tablets&brand=samsung' },
      { name: 'Kids Tablets', link: '/shop?category=tablets&subcategory=Kids+Tablets' },
      { name: 'reMarkable', link: '/shop?category=tablets&q=reMarkable' },
      { name: 'Modio Tablets', link: '/shop?category=tablets&brand=modio' }
    ]
  },
  {
    label: 'Creator Kit',
    to: '/shop?category=photography',
    children: [
      { name: 'Tripod', link: '/shop?q=Tripod' },
      { name: 'Ring Light', link: '/shop?q=Ring+Light' },
      { name: 'Gimbal', link: '/shop?q=Gimbal' },
      { name: 'Drone', link: '/shop?q=Drone' },
      { name: 'Action Cameras', link: '/shop?q=Action+Camera' }
    ]
  },
  {
    label: 'Laptops',
    to: '/laptops',
    children: [
      { name: 'MacBooks', link: '/shop?brand=apple&category=laptops' },
      { name: 'HP Laptops', link: '/shop?brand=hp&category=laptops' },
      { name: 'Dell Laptops', link: '/shop?brand=dell&category=laptops' },
      { name: 'Lenovo Laptops', link: '/shop?brand=lenovo&category=laptops' },
      { name: 'ASUS Laptops', link: '/shop?brand=asus&category=laptops' },
      { name: 'Gaming Laptops', link: '/shop?category=laptops&subcategory=Gaming' },
      { name: 'Chromebooks', link: '/shop?category=laptops&subcategory=Chromebook' },
    ]
  },
  {
    label: 'Smartwatches',
    to: '/smartwatches',
    children: [
      { name: 'Apple Watch', link: '/shop?brand=apple&subcategory=Apple+Watch' },
      { name: 'Samsung Galaxy Watch', link: '/shop?brand=samsung&subcategory=Galaxy+Watch' },
      { name: 'Huawei Watch', link: '/shop?brand=huawei&category=watches' },
      { name: 'Smart Bands', link: '/shop?subcategory=Smart+Bands' },
      { name: 'Fitness Trackers', link: '/shop?subcategory=Fitness+Trackers' },
      { name: 'Kids Smartwatches', link: '/shop?subcategory=Kids+Smartwatches' },
    ]
  },
  {
    label: 'Huawei',
    to: '/huawei',
    children: [
      { name: 'Huawei Phones', link: '/shop?brand=huawei&category=phones' },
      { name: 'Huawei Tablets', link: '/shop?brand=huawei&category=tablets' },
      { name: 'Huawei Laptops', link: '/shop?brand=huawei&category=laptops' },
      { name: 'Huawei Smartwatches', link: '/shop?brand=huawei&category=watches' },
      { name: 'Huawei Earbuds', link: '/shop?brand=huawei&subcategory=Buds' },
    ]
  },
  {
    label: 'Ex-UK',
    to: '/shop?q=Ex-UK',
    children: [
      { name: 'Ex UK Apple MacBooks', link: '/shop?q=Ex-UK+MacBook' },
      { name: 'Ex UK Apple Smartwatches', link: '/shop?q=Ex-UK+Apple+Watch' },
      { name: 'Ex UK Gaming Consoles', link: '/shop?q=Ex-UK+Console' },
      { name: 'Ex UK Google Pixel Phones', link: '/shop?q=Ex-UK+Pixel' },
      { name: 'Ex UK iPhones', link: '/shop?q=Ex-UK+iPhone' },
      { name: 'Ex UK Nokia Phones', link: '/shop?q=Ex-UK+Nokia' },
      { name: 'Ex UK OnePlus Phones', link: '/shop?q=Ex-UK+OnePlus' },
      { name: 'Ex UK Samsung Phones', link: '/shop?q=Ex-UK+Samsung' },
      { name: 'Ex UK Samsung Tablets', link: '/shop?q=Ex-UK+Samsung+Tablet' },
      { name: 'Ex-UK Smartwatches', link: '/shop?q=Ex-UK+Smartwatch' },
      { name: 'Ex-UK Google PixelBooks', link: '/shop?q=PixelBook' },
      { name: 'Ex-UK Vivo Phones', link: '/shop?q=Vivo' }
    ]
  }
];

/* ── Scroll threshold for sticky shadow ── */
const SCROLL_THRESHOLD = 60;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string>(NAV_LINKS[0].label);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const menuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useNavigate();
  const { cart, wishlist } = useStore();
  const { data: metadata } = useMetadata();
  const { categories = [] } = metadata || {};

  const cartCount = (cart as any[]).reduce((acc: number, item: any) => acc + item.quantity, 0);
  const cartValue = (cart as any[]).reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);

  const handleSearch = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/shop?q=${encodeURIComponent(q)}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };


  return (
    <>
      {/* ══ Announcement bar ══════════════════════════════════ */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between py-2 text-[11px]">
            <div className="flex items-center gap-4 min-w-0">
              <span className="flex items-center gap-1.5 text-brand-green font-semibold shrink-0 sm:whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse shrink-0" />
                <span className="hidden xs:inline">Free delivery in Nairobi on orders over KSh 5,000</span>
                <span className="xs:hidden">Free Nairobi delivery over KSh 5K</span>
              </span>
              <span className="hidden md:flex items-center gap-1.5 text-slate-400">
                <MapPin size={11} />
                CBD Nairobi, Moi Avenue
              </span>
            </div>
            <div className="flex items-center gap-5 text-slate-400">
              <Link to="/faq" className="hidden sm:block hover:text-white transition-colors">
                Help & FAQ
              </Link>
              <Link to="/about" className="hidden sm:block hover:text-white transition-colors">
                About Us
              </Link>
              <a href="tel:+254797674862" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone size={11} />
                +254 797 674862
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Main header ═══════════════════════════════════════ */}
      <header
        className={clsx(
          'bg-white sticky top-0 z-50 transition-shadow duration-200',
          scrolled ? 'shadow-md' : 'border-b border-slate-100'
        )}
      >
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-4 lg:gap-8 py-3 md:py-4">

            {/* Logo */}
            <Link
              to="/"
              className="shrink-0"
              onClick={() => setMobileOpen(false)}
            >
              <img 
                src="/logo_primary.png" 
                alt="Mobimax" 
                className="h-20 md:h-24 lg:h-32 w-auto object-contain -ml-2 md:-ml-4"
              />
            </Link>

            {/* Search bar — desktop refinement */}
            <div className="hidden md:flex flex-1 mx-4 max-w-2xl">
              <div className="flex w-full items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-green/20 focus-within:border-brand-green transition-all">
                {/* All Categories Dropdown inside search */}
                <div
                  className="relative group/cat shrink-0 border-r border-slate-200"
                  onMouseEnter={() => {
                    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
                    setMegaOpen(true);
                  }}
                  onMouseLeave={() => {
                    megaTimerRef.current = setTimeout(() => setMegaOpen(false), 150);
                  }}
                >
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-slate-700 hover:text-brand-green transition-colors whitespace-nowrap"
                  >
                    All Categories
                    <ChevronDown size={14} className={clsx('transition-transform', megaOpen && 'rotate-180')} />
                  </button>

                  {/* Mega-menu — two-panel: category list + sub-items */}
                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        onMouseEnter={() => {
                          if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
                          setMegaOpen(true);
                        }}
                        onMouseLeave={() => {
                          megaTimerRef.current = setTimeout(() => setMegaOpen(false), 150);
                        }}
                        className="absolute left-0 top-full mt-0 w-[620px] bg-white rounded-b-2xl shadow-2xl border border-slate-200 z-[60] overflow-hidden flex"
                        style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
                      >
                        {/* Left — category list */}
                        <div className="w-[200px] shrink-0 bg-slate-50 border-r border-slate-100 py-2 overflow-y-auto max-h-[420px]">
                          {NAV_LINKS.map((link) => {
                            const Icon = ICON_MAP[link.label.toLowerCase()] || Package;
                            const isActive = hoveredCategory === link.label;
                            return (
                              <button
                                key={link.label}
                                type="button"
                                onMouseEnter={() => setHoveredCategory(link.label)}
                                onClick={() => { setMegaOpen(false); }}
                                className={clsx(
                                  'w-full flex items-center justify-between gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors text-left',
                                  isActive
                                    ? 'bg-white text-brand-green font-semibold border-r-2 border-brand-green'
                                    : 'text-slate-700 hover:bg-white hover:text-slate-900'
                                )}
                              >
                                <span className="flex items-center gap-2.5">
                                  <Icon size={14} className={isActive ? 'text-brand-green' : 'text-slate-400'} />
                                  {link.label}
                                </span>
                                <ChevronRight size={12} className={clsx('shrink-0', isActive ? 'text-brand-green' : 'text-slate-300')} />
                              </button>
                            );
                          })}
                        </div>

                        {/* Right — sub-items of hovered category */}
                        <div className="flex-1 p-5 overflow-y-auto max-h-[420px]">
                          {(() => {
                            const active = NAV_LINKS.find((l) => l.label === hoveredCategory);
                            if (!active) return null;
                            return (
                              <>
                                <div className="flex items-center justify-between mb-3">
                                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    {active.label}
                                  </p>
                                  <Link
                                    to={active.to}
                                    onClick={() => setMegaOpen(false)}
                                    className="text-[11px] font-semibold text-brand-green hover:underline flex items-center gap-0.5"
                                  >
                                    View all <ChevronRight size={11} />
                                  </Link>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                                  {active.children?.map((child) => (
                                    <Link
                                      key={child.name}
                                      to={child.link}
                                      onClick={() => setMegaOpen(false)}
                                      className="flex items-center gap-1.5 py-2 text-[13px] text-slate-600 hover:text-brand-green transition-colors border-b border-slate-50 group/sub"
                                    >
                                      <ChevronRight size={11} className="text-slate-300 group-hover/sub:text-brand-green shrink-0" />
                                      {child.name}
                                    </Link>
                                  ))}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <form
                  onSubmit={handleSearch}
                  className="flex-1 relative"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products"
                    className="w-full bg-transparent border-none pl-4 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </form>

                <button
                  onClick={handleSearch}
                  className="bg-brand-green hover:bg-emerald-600 text-white text-[12px] font-bold px-6 py-2.5 transition-colors uppercase tracking-wide"
                >
                  Search
                </button>
              </div>
            </div>


            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto md:ml-0">
              {/* Phone — xl only */}
              <div className="hidden xl:flex items-center gap-2 mr-4 pr-4 border-r border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center">
                  <Phone size={14} className="text-brand-green" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium leading-none mb-0.5">
                    Expert Help
                  </p>
                  <a
                    href="tel:+254797674862"
                    className="text-[12px] font-bold text-slate-900 hover:text-brand-green transition-colors"
                  >
                    +254 797 674862
                  </a>
                </div>
              </div>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 text-slate-500 hover:text-brand-green transition-colors hidden sm:flex"
                aria-label="Wishlist"
              >
                <Heart size={20} strokeWidth={2} />
                {(wishlist as any[]).length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center gap-2.5 bg-slate-900 hover:bg-brand-green text-white pl-3 pr-4 py-2 rounded-xl transition-colors group/cart ml-1"
                aria-label="Cart"
              >
                <div className="relative">
                  <ShoppingCart size={18} strokeWidth={2} />
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-brand-green group-hover/cart:bg-white group-hover/cart:text-brand-green text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 transition-colors">
                    {cartCount}
                  </span>
                </div>
                <div className="hidden lg:flex flex-col leading-none">
                  <span className="text-[9px] text-white/60 font-medium">Cart</span>
                  <span className="text-[12px] font-bold">
                    KSh {cartValue.toLocaleString()}
                  </span>
                </div>
              </Link>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors ml-1"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile search bar ── */}
        <div className="md:hidden border-t border-slate-100 px-4 py-2.5">
          <form onSubmit={handleSearch} className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phones, laptops…"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
            />
          </form>
        </div>

        {/* ── Category nav (desktop - PPK Style) ── */}
        <div className="hidden md:block border-t border-slate-100 bg-white shadow-sm">
          <div className="container mx-auto max-w-7xl px-4">
            <nav className="flex items-center justify-between py-0.5">
              <div className="flex items-center flex-wrap">
                {NAV_LINKS.map((link) => (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => {
                      if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
                      setActiveMenu(link.label);
                    }}
                    onMouseLeave={() => {
                      menuTimerRef.current = setTimeout(() => setActiveMenu(null), 150);
                    }}
                  >
                    <Link
                      to={link.to}
                      className={clsx(
                        'shrink-0 py-2.5 px-2.5 text-[11.5px] font-bold transition-colors whitespace-nowrap hover:opacity-80 flex items-center gap-0.5',
                        link.color ? link.color : 'text-slate-900',
                        activeMenu === link.label && 'text-brand-green'
                      )}
                    >
                      {link.label}
                      {link.children && <ChevronDown size={12} className={clsx('transition-transform', activeMenu === link.label && 'rotate-180')} />}
                    </Link>

                    {/* Sub-menu Dropdown */}
                    <AnimatePresence>
                      {link.children && activeMenu === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 top-full bg-white border border-slate-200 shadow-xl rounded-b-xl py-2 min-w-[240px] z-[70] overflow-hidden"
                        >
                          {link.children.map((child: any) => (
                            <Link
                              key={child.name}
                              to={child.link}
                              onClick={() => setActiveMenu(null)}
                              className="block px-5 py-2.5 text-[13px] font-medium text-slate-700 hover:bg-brand-green/5 hover:text-brand-green transition-colors border-b border-slate-50 last:border-0"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Deals pill — right side */}
              <Link
                to="/deals"
                className="shrink-0 flex items-center gap-1 bg-rose-50 text-rose-600 border border-rose-100 py-1 px-3 rounded-full text-[11px] font-bold hover:bg-rose-500 hover:text-white transition-all ml-2"
              >
                <Zap size={14} fill="currentColor" />
                Hot Deals
              </Link>
            </nav>
          </div>
        </div>


      </header>

      {/* ══ Mobile drawer ════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[82%] max-w-sm bg-white shadow-2xl overflow-y-auto md:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                    <span className="text-white font-black text-sm">M</span>
                  </div>
                  <span className="font-black text-slate-900 tracking-tight">Mobimax</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-2 p-4 border-b border-slate-100">
                <Link
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-[13px] font-semibold text-slate-700 hover:bg-brand-green/5 hover:text-brand-green transition-colors"
                >
                  <Heart size={16} />
                  Wishlist
                  {(wishlist as any[]).length > 0 && (
                    <span className="ml-auto w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {(wishlist as any[]).length}
                    </span>
                  )}
                </Link>
                <Link
                  to="/deals"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 p-3 bg-rose-50 rounded-xl text-[13px] font-bold text-rose-600 hover:bg-rose-500 hover:text-white transition-colors"
                >
                  <Zap size={16} fill="currentColor" />
                  Hot Deals
                </Link>
              </div>

              {/* Featured Navigation (Mobile) */}
              <div className="p-4 border-b border-slate-100 flex flex-wrap gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={clsx(
                      'px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors',
                      link.color
                        ? 'bg-brand-green/5 border-brand-green/30 text-brand-green'
                        : 'bg-white border-slate-200 text-slate-700'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Categories */}

              <div className="p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Shop by Category
                </p>
                <div className="space-y-0.5">
                  {categories.map((cat) => {
                    const Icon = ICON_MAP[cat.id] || Plug;
                    const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                    return (
                      <div key={cat.id}>
                        <div className="flex items-center">
                          <Link
                            to={`/shop?category=${cat.id}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-700 hover:bg-brand-green/5 hover:text-brand-green transition-colors"
                          >
                            <Icon size={15} className="text-slate-400" />
                            {cat.name}
                          </Link>
                          {hasSubs && (
                            <button
                              type="button"
                              onClick={() =>
                                setMobileExpanded((v) => (v === cat.id ? null : cat.id))
                              }
                              className="p-2 text-slate-400 hover:text-slate-700"
                            >
                              <ChevronDown
                                size={14}
                                className={clsx(
                                  'transition-transform',
                                  mobileExpanded === cat.id && 'rotate-180'
                                )}
                              />
                            </button>
                          )}
                        </div>

                        {hasSubs && mobileExpanded === cat.id && (
                          <div className="ml-10 mt-1 space-y-0.5 border-l-2 border-slate-100 pl-3 pb-1">
                            {cat.subcategories.map((sub) => (
                              <Link
                                key={sub}
                                to={`/shop?category=${cat.id}&subcategory=${sub}`}
                                onClick={() => setMobileOpen(false)}
                                className="block py-2 px-2 text-[12px] font-medium text-slate-500 hover:text-brand-green transition-colors"
                              >
                                {sub}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Info links */}
              <div className="border-t border-slate-100 p-4 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  More
                </p>
                {[
                  { label: 'About Us', to: '/about' },
                  { label: 'Contact', to: '/contact' },
                  { label: 'FAQ', to: '/faq' },
                  { label: 'Track Order', to: '/account' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <ChevronRight size={14} className="text-slate-400" />
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Contact */}
              <div className="p-4 bg-slate-50 m-4 rounded-2xl">
                <a
                  href="tel:+254797674862"
                  className="flex items-center gap-2.5 text-[13px] font-semibold text-slate-800 hover:text-brand-green transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center">
                    <Phone size={14} className="text-brand-green" />
                  </div>
                  +254 797 674862
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
