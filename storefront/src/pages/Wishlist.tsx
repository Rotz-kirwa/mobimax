import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ui/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function Wishlist() {
  const { wishlist, clearWishlist, toggleWishlist, addToCart } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 max-w-5xl py-32 text-center font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] sm:rounded-[48px] p-8 sm:p-20 shadow-2xl shadow-brand-green/10 border border-slate-100 flex flex-col items-center"
        >
          <div className="w-24 h-24 mx-auto mb-10 rounded-3xl bg-slate-50 text-slate-300 flex items-center justify-center">
            <Heart size={48} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4 italic">Vault Empty</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.3em] mb-8 sm:mb-12 max-w-sm leading-relaxed">
            Your interest markers are currently void. Curate your collection from our catalog.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/shop" className="w-full sm:w-auto bg-brand-green text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-brand-green/20 active:scale-95">
              Access Catalog
            </Link>
            <Link to="/deals" className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-brand-green transition-all active:scale-95">
              Secret Deals
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      <div className="bg-white border-b border-slate-100 py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-1 bg-brand-green rounded-full"></div>
              <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.4em]">Personal Collection</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase leading-none italic">
              The Wishlist
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
              {wishlist.length} Markers Set
            </span>
            <button
              type="button"
              onClick={clearWishlist}
              className="inline-flex items-center gap-3 bg-white border border-slate-200 text-slate-900 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:border-red-500 hover:text-red-500 transition-all active:scale-95"
            >
              <Trash2 size={14} />
              Reset Markers
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-8 md:mt-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          <AnimatePresence>
            {wishlist.map((product: any) => (
              <motion.div 
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-6 group"
              >
                <div className="relative">
                  <ProductCard product={product} />
                  <div className="absolute top-4 right-4 z-10">
                    <button 
                      onClick={() => toggleWishlist(product)}
                      className="w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center text-red-500 border border-slate-100 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-950 text-white px-4 py-4 sm:px-6 sm:py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-green transition-all shadow-2xl shadow-brand-green/10 active:scale-95 group"
                  >
                    <ShoppingCart size={18} />
                    Acquire Asset
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
