import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, Award, LayoutGrid, Search } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../hooks/useCatalog';

export default function CategoryBrandHub() {
  const { type, slug } = useParams(); // type can be 'category' or 'brand'
  const { data: productsData, isLoading } = useProducts();
  const products = productsData || [];
  
  const isBrand = type === 'brand';
  const slugValue = slug || '';
  const hubName = slugValue.charAt(0).toUpperCase() + slugValue.slice(1).replace('-', ' ');

  const hubProducts = isBrand
    ? products.filter((product: any) => product.brand.toLowerCase() === slugValue.toLowerCase())
    : products.filter((product: any) => product.category?.id?.toLowerCase() === slugValue.toLowerCase() || product.category?.name?.toLowerCase() === slugValue.toLowerCase());

  const featured = hubProducts.filter((p: any) => p.isFeatured || p.isNew).slice(0, 4);

  // Visual Theme Data (Enterprise Protocol)
  const hubMeta: Record<string, any> = {
    apple: { color: 'bg-slate-950', text: 'text-white', slogan: 'Infinite Architectural Integrity.' },
    samsung: { color: 'bg-slate-950', text: 'text-white', slogan: 'Technological Superiority.' },
    google: { color: 'bg-slate-900', text: 'text-white', slogan: 'Pure Intelligence.' },
    phones: { color: 'bg-brand-green', text: 'text-white', slogan: 'Sovereign Comms Interface.' },
    audio: { color: 'bg-slate-950', text: 'text-white', slogan: 'Acoustic Precision Protocol.' }
  };

  const currentMeta = hubMeta[slugValue.toLowerCase()] || { color: 'bg-slate-900', text: 'text-white', slogan: 'Technical Asset Hub' };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center">
           <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing Hub Data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24 font-sans">
      {/* Dynamic Enterprise Banner */}
      <section className={clsx("relative py-32 md:py-48 overflow-hidden uppercase", currentMeta.color)}>
         <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/20 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
         </div>
         <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-6 mb-10">
                 <div className="w-16 h-1 bg-white/20 rounded-full"></div>
                 <span className={clsx("text-[10px] font-black uppercase tracking-[0.5em] opacity-60", currentMeta.text)}>
                   {isBrand ? 'Official Asset Terminal' : 'Specialized Sector'} 
                 </span>
                 <div className="w-16 h-1 bg-white/20 rounded-full"></div>
              </div>
              <h1 className={clsx("text-6xl sm:text-7xl md:text-9xl font-black mb-10 tracking-tight italic leading-none", currentMeta.text)}>
                {hubName}
              </h1>
              <p className={clsx("text-lg md:text-2xl font-bold opacity-40 tracking-widest leading-none italic", currentMeta.text)}>
                {currentMeta.slogan}
              </p>
            </motion.div>
         </div>
      </section>

      {/* Hero Showcase */}
      <AnimatePresence>
        {featured.length > 0 && (
          <section className="py-24 bg-slate-50 relative z-20 -mt-12 rounded-t-[64px] border-t border-slate-100 shadow-2xl">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8 px-6">
                 <div>
                    <div className="flex items-center gap-4 mb-3">
                       <div className="w-8 h-1 bg-brand-green rounded-full"></div>
                       <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.4em]">Elite Protocol</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-950 uppercase tracking-tight italic">Tier 01 Assets</h2>
                 </div>
                 <Link to={`/shop?${isBrand ? 'brand' : 'category'}=${slugValue}`} className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] hover:text-brand-green transition-colors group">
                    Sector Full Access <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                 </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
                {featured.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}
      </AnimatePresence>

      {/* Operational Trust */}
      <section className="py-32 bg-white">
         <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { title: 'Global Coverage', desc: `Every piece in the ${hubName} sector is backed by official architectural warranties.`, icon: ShieldCheck },
                 { title: 'Authentic Signal', desc: `Pure-line sourcing ensures factory-sealed ${hubName} specimens for your acquisition.`, icon: Zap },
                 { title: 'Sector Intel', desc: `Our ${hubName} specialists provide precise data for technical configuration.`, icon: Award }
               ].map((item, idx) => (
                 <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="p-12 rounded-[48px] bg-slate-50 border border-slate-100 flex flex-col gap-8 group hover:border-green-200 transition-colors"
                  >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-950 border border-slate-100 shadow-sm group-hover:bg-brand-green group-hover:text-white transition-all duration-500 font-black">
                      <item.icon size={30} />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic leading-none">{item.title}</h4>
                    <p className="text-sm font-bold leading-loose text-slate-400 normal-case tracking-normal">{item.desc}</p>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Complete Collection Grid */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col items-center mb-24 text-center">
             <div className="bg-brand-green text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8">Asset Census</div>
             <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tight italic mb-6 leading-none">Complete Sector Inventory</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
            {hubProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {hubProducts.length === 0 && (
             <div className="py-40 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-10 text-slate-300">
                   <Search size={40} />
                </div>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.3em] italic">No active assets currently identified in this sector.</p>
                <Link to="/shop" className="inline-block mt-12 bg-slate-950 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] active:scale-95 shadow-2xl shadow-brand-green/10">Browse Main Terminal</Link>
             </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 bg-white">
         <div className="container mx-auto px-4 max-w-5xl text-center">
            <LayoutGrid size={48} className="mx-auto mb-10 text-brand-green opacity-20" />
            <h3 className="text-4xl font-black uppercase tracking-tight text-slate-900 italic mb-8">Expansion Required?</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-12 italic">The network contains high-volume assets beyond this sector.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/shop" className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-green transition-all shadow-2xl active:scale-95">Global Shop</Link>
            </div>
         </div>
      </section>
    </div>
  );
}
