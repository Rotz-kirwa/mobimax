import { Link } from 'react-router-dom';
import { X, BarChart3, ShoppingCart, Star, Plus, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function Compare() {
  const { compare, toggleCompare, clearCompare, addToCart } = useStore();

  if (compare.length === 0) {
    return (
      <div className="container mx-auto px-4 max-w-5xl py-32 text-center font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[48px] p-20 shadow-2xl shadow-brand-green/10 border border-slate-100 flex flex-col items-center"
        >
          <div className="w-24 h-24 mx-auto mb-10 rounded-3xl bg-slate-50 text-slate-300 flex items-center justify-center">
            <BarChart3 size={48} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4 italic text-center">Protocol Nullified</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.3em] mb-12 max-w-sm leading-relaxed mx-auto">
            Binary comparison requires active specimens. Initialize a collection from the catalog terminals.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-brand-green text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-brand-green/20 active:scale-95"
          >
            Access Catalog
          </Link>
        </motion.div>
      </div>
    );
  }

  // Collect all unique spec labels across compared products for the table rows
  const allSpecs = Array.from(
    new Set((compare as any[]).flatMap((p) => p.specs ?? []).map((s) => s.split(':')[0]?.trim() ?? s))
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans uppercase">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-12">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-1 bg-brand-green rounded-full"></div>
              <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.4em]">Signal Matrix</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight uppercase leading-none italic">
              Compare Mode
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
              {compare.length} / 04 Active Nodes
            </span>
            <button
              type="button"
              onClick={clearCompare}
              className="inline-flex items-center gap-3 bg-white border border-slate-200 text-slate-950 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:border-red-500 hover:text-red-500 transition-all active:scale-95"
            >
              <X size={14} /> Reset Matrix
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-16 overflow-x-auto custom-scrollbar-horizontal pb-8">
        <table className="w-full min-w-[1000px] border-separate border-spacing-x-4">
          <thead>
            <tr>
              {/* Row label column */}
              <th className="w-48 shrink-0 pb-10" aria-label="Attribute" />

              {compare.map((product: any) => (
                <th key={product.id} className="pb-10 align-top text-left w-[280px]">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-brand-green/10 p-8 flex flex-col gap-6 relative group overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    {/* Remove button */}
                    <button
                      type="button"
                      aria-label={`Remove ${product.name} from comparison`}
                      onClick={() => toggleCompare(product)}
                      className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all border border-slate-100 z-10"
                    >
                      <X size={16} />
                    </button>

                    {/* Product image */}
                    <Link to={`/product/${product.id}`} className="block relative z-10">
                      <div className="aspect-square rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center p-6 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    </Link>

                    {/* Product info */}
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.4em] mb-2 font-black italic">
                        {product.brand}
                      </p>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none hover:text-brand-green transition-colors line-clamp-2 italic mb-4">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-50">
                        <p className="text-2xl font-black text-slate-950 tracking-tighter">
                          KSh {product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Add to cart */}
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="flex items-center justify-center gap-3 w-full rounded-2xl bg-slate-950 text-white py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-green transition-all shadow-2xl shadow-brand-green/10 active:scale-95 group"
                    >
                      <ShoppingCart size={16} /> Acquire Asset
                    </button>
                  </motion.div>
                </th>
              ))}

              {/* Empty slot placeholder */}
              {compare.length < 4 && (
                <th className="pb-10 align-top w-[280px]">
                  <Link
                    to="/shop"
                    className="flex flex-col items-center justify-center gap-6 bg-slate-100/50 rounded-[40px] border-4 border-dashed border-slate-200 p-8 h-full min-h-[460px] text-slate-300 hover:border-brand-green hover:text-brand-green hover:bg-green-50/50 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-full border-4 border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                       <Plus size={32} strokeWidth={3} />
                    </div>
                    <span className="text-[12px] font-black uppercase tracking-[0.4em]">Signal Injection</span>
                  </Link>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="mt-10">
            {/* Rating row */}
            <tr className="border-t border-slate-100">
              <td className="py-8 pr-10 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap italic">
                Performance Rating
              </td>
              {compare.map((product: any) => (
                <td key={product.id} className="px-4 py-8">
                  <div className="flex items-center gap-3">
                    <div className="flex text-brand-green">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < Math.floor(product.rating ?? 5) ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth={2}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-black text-slate-900 tabular-nums">{(product.rating ?? 5).toFixed(1)}</span>
                  </div>
                </td>
              ))}
              {compare.length < 4 && <td />}
            </tr>

            {/* Condition row */}
            <tr className="border-t border-slate-100 bg-white/50">
              <td className="py-8 pr-10 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap italic">
                Condition Layer
              </td>
              {compare.map((product: any) => (
                <td key={product.id} className="px-4 py-8">
                  <span
                    className={clsx(
                      'inline-block rounded-xl px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm',
                      product.condition === 'Ex-UK Used'
                        ? 'bg-slate-900 text-white'
                        : 'bg-brand-green text-white'
                    )}
                  >
                    {product.condition ?? 'New Asset'}
                  </span>
                </td>
              ))}
              {compare.length < 4 && <td />}
            </tr>

            {/* Dynamic spec rows */}
            {allSpecs.map((specLabel: any, rowIdx) => (
              <tr
                key={specLabel}
                className={clsx('border-t border-slate-100', rowIdx % 2 !== 0 ? 'bg-white/50' : '')}
              >
                <td className="py-8 pr-10 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap italic">
                  {specLabel}
                </td>
                {compare.map((product: any) => {
                  const specEntry = (product.specs ?? []).find(
                    (s: string) => s.split(':')[0]?.trim() === specLabel
                  );
                  const specValue = specEntry
                    ? (specEntry.includes(':') ? specEntry.split(':').slice(1).join(':').trim() : specEntry)
                    : null;
                  return (
                    <td key={product.id} className="px-4 py-8 text-sm font-bold text-slate-900 normal-case tracking-normal">
                      {specValue ?? <span className="text-slate-200">—</span>}
                    </td>
                  );
                })}
                {compare.length < 4 && <td />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer Support Signal */}
      <div className="container mx-auto max-w-7xl px-4 mt-20">
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="p-12 bg-slate-950 rounded-[48px] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-brand-green/20">
            <div className="text-center md:text-left">
               <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <Star className="text-brand-green" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Expert Intelligence</span>
               </div>
               <h3 className="text-3xl font-black uppercase tracking-tight italic leading-none mb-3">Ambiguity?</h3>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Request a primary consultation from a network specialist.</p>
            </div>
            <Link to="/contact" className="bg-brand-green text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] active:scale-95 flex items-center gap-3">
               Establish Signal <ArrowRight size={18} />
            </Link>
         </motion.div>
      </div>
    </div>
  );
}
