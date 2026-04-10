import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, Award } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useCatalogStore } from '../store/useCatalogStore';

export default function CategoryBrandHub() {
  const { type, slug } = useParams(); // type can be 'category' or 'brand'
  const products = useCatalogStore((state) => state.products);
  
  const isBrand = type === 'brand';
  const hubName = slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ');

  const hubProducts = isBrand
    ? products.filter((product) => product.brand.toLowerCase() === slug.toLowerCase())
    : products.filter((product) => product.category.toLowerCase() === slug.toLowerCase());

  const featured = hubProducts.filter(p => p.flags?.isFeatured || p.isNew).slice(0, 4);

  // Visual Theme Data (Mocked for premium feel)
  const hubMeta = {
    apple: { color: 'bg-black', text: 'text-white', slogan: 'Innovation at its peak.' },
    samsung: { color: 'bg-blue-900', text: 'text-white', slogan: 'Galaxy of possibilities.' },
    google: { color: 'bg-[#4285F4]', text: 'text-white', slogan: 'Purely Smart.' },
    phones: { color: 'bg-brand-green', text: 'text-white', slogan: 'Stay connected, elegantly.' },
    audio: { color: 'bg-slate-900', text: 'text-white', slogan: 'Sound redefined.' }
  };

  const currentMeta = hubMeta[slug.toLowerCase()] || { color: 'bg-gray-100', text: 'text-gray-900', slogan: 'Premium Electronics' };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Dynamic Hub Banner */}
      <section className={clsx("relative py-24 md:py-32 overflow-hidden", currentMeta.color)}>
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
         </div>
         <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                 <div className="w-12 h-px bg-white/30"></div>
                 <span className={clsx("text-[10px] font-black uppercase tracking-[0.5em] opacity-80", currentMeta.text)}>
                   Mobimax {isBrand ? 'Official Brand Store' : 'Collection Hub'}
                 </span>
                 <div className="w-12 h-px bg-white/30"></div>
              </div>
              <h1 className={clsx("text-4xl sm:text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase", currentMeta.text)}>
                {hubName}
              </h1>
              <p className={clsx("text-lg md:text-xl font-bold opacity-60 uppercase tracking-widest leading-none", currentMeta.text)}>
                {currentMeta.slogan}
              </p>
            </motion.div>
         </div>
      </section>

      {/* Hero Showcase (Grid) */}
      {featured.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-16 px-4">
               <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter">Elite Selections</h2>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">{hubName}'s most prestigious releases</p>
               </div>
               <Link to={`/shop?${isBrand ? 'brand' : 'category'}=${slug}`} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-brand-green transition-colors">
                  View Full Catalog <ArrowRight size={14} />
               </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mid-Page Promo / Trust */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
         <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-6">
                  <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green"><ShieldCheck size={28} /></div>
                  <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none">Global Warranty</h4>
                  <p className="text-sm text-gray-400 font-bold leading-relaxed">Every {hubName} item is covered by official local and international service networks.</p>
               </div>
               <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-6">
                  <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green"><Zap size={28} /></div>
                  <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none">Authentic Tech</h4>
                  <p className="text-sm text-gray-400 font-bold leading-relaxed">Direct sourcing ensures you receive only factory-sealed {hubName} products.</p>
               </div>
               <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-6">
                  <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green"><Award size={28} /></div>
                  <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-none">Elite Support</h4>
                  <p className="text-sm text-gray-400 font-bold leading-relaxed">Our {hubName} specialists are trained to assist with setup and configuration.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Full Collection Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col items-center mb-16 text-center">
             <h2 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">Complete Collection</h2>
             <div className="w-16 h-1 bg-brand-green rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {hubProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {hubProducts.length === 0 && (
             <div className="py-20 text-center">
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No products currently available in this hub.</p>
                <Link to="/shop" className="inline-block mt-8 bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Browse General Shop</Link>
             </div>
          )}
        </div>
      </section>

    </div>
  );
}
