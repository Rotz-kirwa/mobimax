import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Watch } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useCatalog';

const SUBCATEGORIES = [
  { label: 'Apple Watch', link: '/shop?brand=apple&subcategory=Apple+Watch' },
  { label: 'Samsung Galaxy Watch', link: '/shop?brand=samsung&subcategory=Galaxy+Watch' },
  { label: 'Smart Bands', link: '/shop?subcategory=Smart+Bands' },
  { label: 'Fitness Trackers', link: '/shop?subcategory=Fitness+Trackers' },
  { label: 'Kids Smartwatches', link: '/shop?subcategory=Kids+Smartwatches' },
  { label: 'Rugged Smartwatches', link: '/shop?subcategory=Rugged+Smartwatches' },
];

const BRANDS = [
  { label: 'Apple', link: '/shop?brand=apple&subcategory=Apple+Watch' },
  { label: 'Samsung', link: '/shop?brand=samsung&subcategory=Galaxy+Watch' },
  { label: 'Garmin', link: '/shop?brand=garmin' },
  { label: 'Huawei', link: '/shop?brand=huawei&category=watches' },
  { label: 'Xiaomi', link: '/shop?brand=xiaomi&category=watches' },
  { label: 'Infinix', link: '/shop?brand=infinix&category=watches' },
  { label: 'Oraimo', link: '/shop?brand=oraimo&category=watches' },
  { label: 'Fitbit', link: '/shop?brand=fitbit' },
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

export default function Smartwatches() {
  const { data: allProducts = [], isLoading } = useProducts();

  const watches = useMemo(
    () => allProducts.filter((p) => ['watches', 'wearables'].includes(p.category) || p.subcategory?.toLowerCase().includes('watch')),
    [allProducts]
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── Hero Banner ── */}
      <div className="relative bg-slate-900 overflow-hidden" style={{ minHeight: 220 }}>
        <img
          src="https://i.pinimg.com/736x/bc/05/cb/bc05cb334661ddb8243212efa40f0f30.jpg"
          alt="Smartwatches"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 container mx-auto max-w-7xl px-6 py-14">
          <nav className="flex items-center gap-1.5 text-[11px] text-white/50 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={11} />
            <span className="text-white font-semibold">Smartwatches</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-500/20 border border-teal-400/30 rounded-2xl flex items-center justify-center">
              <Watch size={24} className="text-teal-300" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Smartwatches & Bands</h1>
              <p className="text-white/50 text-sm mt-1">Stay connected, track your fitness, look great</p>
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
              All Smartwatches <span className="text-slate-400 text-base font-normal">({watches.length})</span>
            </h2>
            <Link to="/shop?category=watches" className="text-[13px] font-semibold text-brand-green hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : watches.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {watches.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-24">
              <Watch size={48} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No smartwatches listed yet</h3>
              <p className="text-sm text-slate-500 mb-6">Check back soon or browse all products.</p>
              <Link to="/shop" className="bg-brand-green text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors">
                Browse All
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
