import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface BrandGridProps {
  brands: { id?: string; name: string }[];
}

/* Brand accent colors */
const BRAND_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Apple: { bg: 'bg-slate-900', text: 'text-white', border: 'border-slate-900' },
  Samsung: { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-600' },
  Xiaomi: { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-500' },
  Oppo: { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-600' },
  OnePlus: { bg: 'bg-red-600', text: 'text-white', border: 'border-red-600' },
  Google: { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-500' },
  HP: { bg: 'bg-blue-700', text: 'text-white', border: 'border-blue-700' },
  Dell: { bg: 'bg-sky-600', text: 'text-white', border: 'border-sky-600' },
  Lenovo: { bg: 'bg-red-700', text: 'text-white', border: 'border-red-700' },
  Tecno: { bg: 'bg-teal-600', text: 'text-white', border: 'border-teal-600' },
  Infinix: { bg: 'bg-violet-600', text: 'text-white', border: 'border-violet-600' },
  Huawei: { bg: 'bg-rose-600', text: 'text-white', border: 'border-rose-600' },
};

const DEFAULT_STYLE = { bg: 'bg-slate-700', text: 'text-white', border: 'border-slate-700' };

export default function BrandGrid({ brands }: BrandGridProps) {
  if (brands.length === 0) return null;

  const displayBrands = brands.slice(0, 12);

  return (
    <section className="py-10 bg-slate-50 border-y border-slate-200">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Official Retailer
            </p>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Shop by Brand
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-1.5 text-[12px] font-semibold text-brand-green hover:text-emerald-700 transition-colors"
          >
            All brands <ArrowRight size={14} />
          </Link>
        </div>

        {/* Brand tiles */}
        <div className="flex flex-wrap gap-2.5 md:gap-3">
          {displayBrands.map((brand) => {
            const style = BRAND_STYLES[brand.name] || DEFAULT_STYLE;
            return (
              <Link
                key={brand.name}
                to={`/shop?brand=${brand.name.toLowerCase()}`}
                className={`group flex items-center justify-center px-5 py-3 rounded-xl border ${style.border} ${style.bg} ${style.text} text-sm font-bold tracking-tight transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:opacity-90`}
              >
                {brand.name}
              </Link>
            );
          })}

          {brands.length > 12 && (
            <Link
              to="/shop"
              className="flex items-center justify-center px-5 py-3 rounded-xl border border-dashed border-slate-300 text-slate-500 text-sm font-semibold hover:border-brand-green hover:text-brand-green transition-colors"
            >
              +{brands.length - 12} more
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
