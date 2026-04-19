import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Smartphone } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useCatalog';

const SUBCATEGORIES = [
  { label: 'Huawei Phones', link: '/shop?brand=huawei&category=phones' },
  { label: 'Huawei Tablets', link: '/shop?brand=huawei&category=tablets' },
  { label: 'Huawei Laptops', link: '/shop?brand=huawei&category=laptops' },
  { label: 'Huawei Smartwatches', link: '/shop?brand=huawei&category=watches' },
  { label: 'Huawei Earbuds', link: '/shop?brand=huawei&subcategory=Buds' },
  { label: 'Huawei Accessories', link: '/shop?brand=huawei&category=accessories' },
];

const SERIES = [
  { label: 'Pura Series', link: '/shop?brand=huawei&q=Pura' },
  { label: 'Nova Series', link: '/shop?brand=huawei&q=Nova' },
  { label: 'Mate Series', link: '/shop?brand=huawei&q=Mate' },
  { label: 'Y Series', link: '/shop?brand=huawei&q=Y+Series' },
  { label: 'P Series', link: '/shop?brand=huawei&q=Huawei+P' },
  { label: 'MateBook', link: '/shop?brand=huawei&q=MateBook' },
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

export default function Huawei() {
  const { data: allProducts = [], isLoading } = useProducts();

  const huaweiProducts = useMemo(
    () => allProducts.filter((p) => p.brand.toLowerCase() === 'huawei'),
    [allProducts]
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 220, background: 'linear-gradient(135deg, #c0392b 0%, #8e0000 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white, transparent 60%)' }} />
        <div className="relative z-10 container mx-auto max-w-7xl px-6 py-14">
          <nav className="flex items-center gap-1.5 text-[11px] text-white/50 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={11} />
            <span className="text-white font-semibold">Huawei</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center">
              <Smartphone size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-1">Official Products</p>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Huawei</h1>
              <p className="text-white/50 text-sm mt-1">Phones, tablets, laptops, wearables & accessories</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">

        {/* ── Shop by Category ── */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-slate-900 mb-4">Shop by Category</h2>
          <div className="flex flex-wrap gap-2">
            {SUBCATEGORIES.map((s) => (
              <Link key={s.label} to={s.link}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-700 hover:border-brand-green hover:text-brand-green transition-all">
                {s.label}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Shop by Series ── */}
        <section className="mb-10">
          <h2 className="text-base font-bold text-slate-900 mb-4">Shop by Series</h2>
          <div className="flex flex-wrap gap-2">
            {SERIES.map((s) => (
              <Link key={s.label} to={s.link}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                {s.label}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Product Grid ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              All Huawei Products <span className="text-slate-400 text-base font-normal">({huaweiProducts.length})</span>
            </h2>
            <Link to="/shop?brand=huawei" className="text-[13px] font-semibold text-brand-green hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : huaweiProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {huaweiProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-24">
              <Smartphone size={48} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Huawei products listed yet</h3>
              <p className="text-sm text-slate-500 mb-6">Check back soon or browse all smartphones.</p>
              <Link to="/shop?category=phones" className="bg-brand-green text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors">
                Browse Smartphones
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
