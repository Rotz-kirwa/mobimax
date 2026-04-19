import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Laptop } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useCatalog';

const SUBCATEGORIES = [
  { label: 'MacBooks', link: '/shop?brand=apple&category=laptops' },
  { label: 'Gaming Laptops', link: '/shop?category=laptops&subcategory=Gaming' },
  { label: 'Business Laptops', link: '/shop?category=laptops&subcategory=Business' },
  { label: 'Student Laptops', link: '/shop?category=laptops&subcategory=Student' },
  { label: 'Chromebooks', link: '/shop?category=laptops&subcategory=Chromebook' },
  { label: 'Ultrabooks', link: '/shop?category=laptops&subcategory=Ultrabook' },
];

const BRANDS = [
  { label: 'Apple', link: '/shop?brand=apple&category=laptops' },
  { label: 'HP', link: '/shop?brand=hp&category=laptops' },
  { label: 'Dell', link: '/shop?brand=dell&category=laptops' },
  { label: 'Lenovo', link: '/shop?brand=lenovo&category=laptops' },
  { label: 'ASUS', link: '/shop?brand=asus&category=laptops' },
  { label: 'Acer', link: '/shop?brand=acer&category=laptops' },
  { label: 'Samsung', link: '/shop?brand=samsung&category=laptops' },
  { label: 'MSI', link: '/shop?brand=msi&category=laptops' },
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

export default function Laptops() {
  const { data: allProducts = [], isLoading } = useProducts();

  const laptops = useMemo(
    () => allProducts.filter((p) => ['laptops', 'apple-laptops'].includes(p.category)),
    [allProducts]
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── Hero Banner ── */}
      <div className="relative bg-slate-900 overflow-hidden" style={{ minHeight: 220 }}>
        <img
          src="https://i.pinimg.com/1200x/74/da/de/74dade62789f9ad72bf6ea604ede8aa4.jpg"
          alt="Laptops"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 container mx-auto max-w-7xl px-6 py-14 flex flex-col justify-center">
          <nav className="flex items-center gap-1.5 text-[11px] text-white/50 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={11} />
            <span className="text-white font-semibold">Laptops</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-400/30 rounded-2xl flex items-center justify-center">
              <Laptop size={24} className="text-indigo-300" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Laptops & MacBooks</h1>
              <p className="text-white/50 text-sm mt-1">Power your work, study, and creativity</p>
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
              <Link
                key={s.label}
                to={s.link}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-700 hover:border-brand-green hover:text-brand-green transition-all"
              >
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
              <Link
                key={b.label}
                to={b.link}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
              >
                {b.label}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Product Grid ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              All Laptops <span className="text-slate-400 text-base font-normal">({laptops.length})</span>
            </h2>
            <Link to="/shop?category=laptops" className="text-[13px] font-semibold text-brand-green hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : laptops.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {laptops.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-24">
              <Laptop size={48} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No laptops listed yet</h3>
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
