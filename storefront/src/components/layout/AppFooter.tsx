import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ChevronRight, Send } from 'lucide-react';
import { useState } from 'react';
import { useMetadata } from '../../hooks/useCatalog';

/* ── Social SVGs ── */
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
function IconTiktok() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}
function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/* ── M-Pesa SVG ── */
function MPesaLogo() {
  return (
    <svg viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="22">
      <rect width="60" height="24" rx="4" fill="#00A651" />
      <text x="5" y="17" fontFamily="Arial" fontWeight="800" fontSize="11" fill="white">M-PESA</text>
    </svg>
  );
}

const COMPANY_LINKS = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Shipping & Returns', to: '/faq' },
  { label: 'Cookie Policy', to: '/cookies' },
];

const CATEGORY_LINKS = [
  { label: 'Smartphones', to: '/shop?category=smartphones' },
  { label: 'iPhones', to: '/shop?category=iphones' },
  { label: 'Laptops & MacBooks', to: '/shop?category=laptops' },
  { label: 'Smartwatches', to: '/smartwatches' },
  { label: 'Powerbanks', to: '/powerbanks' },
  { label: 'Audio & Headphones', to: '/shop?category=audio' },
  { label: 'Chargers & Cables', to: '/chargers' },
  { label: 'Gaming', to: '/shop?category=gaming' },
];

const BRAND_LINKS = [
  'Samsung', 'Apple', 'Xiaomi', 'Infinix', 'Tecno', 'Oppo', 'Nothing', 'Huawei',
];

const SOCIAL_LINKS = [
  { icon: IconFacebook, href: 'https://facebook.com/mobimax', label: 'Facebook' },
  { icon: IconInstagram, href: 'https://instagram.com/mobimax', label: 'Instagram' },
  { icon: IconTiktok, href: 'https://tiktok.com/@mobimax', label: 'TikTok' },
  { icon: IconX, href: 'https://twitter.com/mobimax', label: 'X / Twitter' },
];

/* Accent underline for section headings — orange bar like PPK */
function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-[15px] font-extrabold text-slate-800 uppercase tracking-wide">{children}</h3>
      <div className="mt-2 h-[3px] w-8 rounded-full bg-orange-500" />
    </div>
  );
}

export default function AppFooter() {
  const { data: metadata } = useMetadata();
  const { brands = [] } = metadata || {};
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const displayBrands = brands.length > 0
    ? brands.slice(0, 8).map((b) => b.name)
    : BRAND_LINKS;

  const handleSubscribe = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="font-sans bg-slate-50 border-t border-slate-200">

      {/* ── Main footer body ── */}
      <div className="container mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1 — Brand + Contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="block mb-5">
              <img
                src="/logo_primary.png"
                alt="Mobimax"
                className="h-20 w-auto object-contain drop-shadow-sm"
              />
            </Link>

            <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
              Kenya's trusted electronics destination. Genuine products, competitive prices, and
              exceptional service — in Nairobi and countrywide.
            </p>

            <ul className="space-y-3 mb-7 text-[13px] text-slate-500">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-orange-500 shrink-0 mt-0.5" />
                <span>MobiMax Store, CBD Nairobi,<br />Moi Avenue, Ground Floor.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-orange-500 shrink-0" />
                <a href="tel:+254797674862" className="hover:text-orange-500 transition-colors">
                  +254 797 674 862
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-orange-500 shrink-0" />
                <a href="mailto:sales@mobimax.co.ke" className="hover:text-orange-500 transition-colors">
                  sales@mobimax.co.ke
                </a>
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-slate-200 hover:border-orange-500 hover:bg-orange-500 flex items-center justify-center text-slate-500 hover:text-white transition-all duration-200"
                >
                  <s.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="group flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-orange-500 transition-colors"
                  >
                    <ChevronRight size={12} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Categories + Brands */}
          <div>
            <FooterHeading>Shop Categories</FooterHeading>
            <ul className="space-y-2.5 mb-7">
              {CATEGORY_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="group flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-orange-500 transition-colors"
                  >
                    <ChevronRight size={12} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <FooterHeading>Shop By Brand</FooterHeading>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {displayBrands.map((brand) => (
                <Link
                  key={brand}
                  to={`/shop?brand=${brand.toLowerCase()}`}
                  className="text-[12px] text-slate-500 hover:text-orange-500 transition-colors"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 4 — Newsletter + Hours */}
          <div>
            <FooterHeading>Newsletter</FooterHeading>
            <p className="text-[13px] text-slate-500 mb-4 leading-relaxed">
              Get the latest deals, new arrivals and exclusive offers straight to your inbox.
            </p>

            {subscribed ? (
              <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-[13px] text-orange-600 font-semibold">
                Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 min-w-0 bg-white border border-slate-200 focus:border-orange-500 text-slate-800 placeholder-slate-400 text-[13px] px-3.5 py-2.5 rounded-xl outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors shrink-0"
                  aria-label="Subscribe"
                >
                  <Send size={15} />
                </button>
              </form>
            )}

            {/* Store hours */}
            <div className="mt-8 p-4 rounded-xl bg-white border border-slate-200">
              <p className="text-[12px] font-bold text-slate-800 uppercase tracking-wide mb-3">
                Store Hours
              </p>
              <ul className="space-y-1.5 text-[12px] text-slate-500">
                <li className="flex justify-between">
                  <span>Mon – Fri</span>
                  <span className="text-slate-700 font-medium">8:00 AM – 7:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-slate-700 font-medium">9:00 AM – 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-slate-700 font-medium">10:00 AM – 4:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Payment methods strip ── */}
      <div className="border-t border-slate-200">
        <div className="container mx-auto max-w-7xl px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-slate-400 uppercase tracking-widest font-semibold">
            We Accept
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {/* M-Pesa */}
            <MPesaLogo />

            {/* Visa */}
            <div className="h-[22px] px-2.5 bg-[#1A1F71] rounded flex items-center justify-center">
              <svg viewBox="0 0 60 20" width="52" height="20" xmlns="http://www.w3.org/2000/svg">
                <text x="3" y="16" fontFamily="Arial" fontWeight="800" fontSize="16" fill="white" fontStyle="italic">VISA</text>
              </svg>
            </div>

            {/* Mastercard */}
            <div className="h-[22px] px-2 bg-white border border-slate-100 rounded flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-red-600 opacity-90" />
              <div className="w-5 h-5 rounded-full bg-yellow-400 -ml-2.5 opacity-90" />
            </div>

            {/* Bank transfer */}
            <div className="h-[22px] px-2.5 bg-slate-100 border border-slate-200 rounded flex items-center">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Bank Transfer</span>
            </div>

            {/* Cash on delivery */}
            <div className="h-[22px] px-2.5 bg-slate-100 border border-slate-200 rounded flex items-center">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="bg-white border-t border-slate-200 py-4">
        <div className="container mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[12px] text-slate-400">
            &copy; {new Date().getFullYear()}{' '}
            <span className="text-orange-500 font-bold">MobiMax</span>. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {([
              ['Privacy Policy', '/privacy'],
              ['Terms of Service', '/terms'],
              ['Cookie Policy', '/cookies'],
            ] as const).map(([label, href]) => (
              <Link
                key={label}
                to={href}
                className="text-[12px] text-slate-400 hover:text-orange-500 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
