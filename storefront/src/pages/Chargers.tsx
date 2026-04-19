import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Plug } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useCatalog';

const SUBCATEGORIES = [
  { label: 'iPhone Chargers', link: '/shop?subcategory=iPhone+Chargers' },
  { label: 'Android Chargers', link: '/shop?subcategory=Android+Chargers' },
  { label: 'Fast Chargers', link: '/shop?subcategory=Fast+Chargers' },
  { label: 'Wireless Chargers', link: '/shop?subcategory=Wireless+Chargers' },
  { label: 'Laptop Chargers', link: '/shop?subcategory=Laptop+Chargers' },
  { label: 'Car Chargers', link: '/shop?subcategory=Car+Chargers' },
  { label: 'Multi-port Chargers', link: '/shop?subcategory=Multi-port+Chargers' },
  { label: 'USB Cables', link: '/shop?subcategory=USB+Cables' },
];

const BRANDS = [
  { label: 'Anker', link: '/shop?brand=anker' },
  { label: 'Apple', link: '/shop?brand=apple&subcategory=Chargers' },
  { label: 'Samsung', link: '/shop?brand=samsung&subcategory=Chargers' },
  { label: 'Oraimo', link: '/shop?brand=oraimo&subcategory=Chargers' },
  { label: 'Baseus', link: '/shop?brand=baseus' },
  { label: 'Hoco', link: '/shop?brand=hoco' },
  { label: 'Ugreen', link: '/shop?brand=ugreen' },
  { label: 'Belkin', link: '/shop?brand=belkin' },
];

function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-52 bg-slate-100" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 bg-slate-100 rounded" />
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-5 w-24 bg-slate-100 rounded mt-3" />
        <div className="h-9 w-full bg-slate-100 rounded-lg mt-2" />
      </div>
    </div>
  );
}

export default function Chargers() {
  const { data: allProducts = [], isLoading } = useProducts();

  const chargers = useMemo(
    () => allProducts.filter((p) =>
      p.subcategory?.toLowerCase().includes('charger') ||
      p.name.toLowerCase().includes('charger') ||
      p.name.toLowerCase().includes('cable') ||
      p.name.toLowerCase().includes('adapter')
    ),
    [allProducts]
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── Hero Banner ── */}
      <div className="relative bg-slate-900 overflow-hidden" style={{ minHeight: 220 }}>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 to-slate-900/80" />
        <div className="relative z-10 container mx-auto max-w-7xl px-6 py-14">
          <nav className="flex items-center gap-1.5 text-[11px] text-white/50 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={11} />
            <Link to="/shop?category=accessories" className="hover:text-white transition-colors">Accessories</Link>
            <ChevronRight size={11} />
            <span className="text-white font-semibold">Chargers</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/20 border border-orange-400/30 rounded-2xl flex items-center justify-center">
              <Plug size={24} className="text-orange-300" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Chargers & Cables</h1>
              <p className="text-white/50 text-sm mt-1">Fast, reliable charging for every device</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">

        {/* ── Shop by Type ── */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-slate-900 mb-4">Shop by Type</h2>
          <div className="flex flex-wrap gap-2">
            {SUBCATEGORIES.map((s) => (
              <Link key={s.label} to={s.link}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-700 hover:border-brand-green hover:text-brand-green transition-all">
                {s.label}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Shop by Brand ── */}
        <section className="mb-10">
          <h2 className="text-base font-bold text-slate-900 mb-4">Shop by Brand</h2>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map((b) => (
              <Link key={b.label} to={b.link}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                {b.label}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Product Grid ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              All Chargers & Cables <span className="text-slate-400 text-base font-normal">({chargers.length})</span>
            </h2>
            <Link to="/shop?subcategory=Chargers" className="text-[13px] font-semibold text-brand-green hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : chargers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {chargers.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-24">
              <Plug size={48} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No chargers listed yet</h3>
              <p className="text-sm text-slate-500 mb-6">Check back soon or browse all accessories.</p>
              <Link to="/shop?category=accessories" className="bg-brand-green text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors">
                Browse Accessories
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
