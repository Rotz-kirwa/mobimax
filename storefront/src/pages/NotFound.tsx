import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutGrid, ArrowLeft, Search, Zap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 max-w-5xl py-32 text-center font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[48px] border border-slate-100 p-16 md:p-24 shadow-2xl shadow-brand-green/10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-green"></div>
        
        <span className="text-[14px] font-black text-brand-green uppercase tracking-[0.5em] block mb-8 italic">Anomaly Detected</span>
        
        <h1 className="text-7xl md:text-9xl font-black text-slate-900 uppercase tracking-tight mb-8 italic leading-none">
          404
        </h1>
        
        <div className="flex items-center justify-center gap-4 mb-8">
           <div className="w-12 h-1 bg-slate-200 rounded-full"></div>
           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Signal Lost In Network</h2>
           <div className="w-12 h-1 bg-slate-200 rounded-full"></div>
        </div>

        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest max-w-xl mx-auto mb-16 leading-loose">
          The technical route you requested does not exist in the current grid map. The asset may have been relocated or the signal is obscured.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/" className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-green transition-all shadow-2xl shadow-brand-green/10 active:scale-95 group">
            <ArrowLeft size={16} className="inline-block mr-3 group-hover:-translate-x-2 transition-transform" />
            Home Terminal
          </Link>
          <Link to="/shop" className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-brand-green transition-all active:scale-95">
            <Search size={16} className="inline-block mr-3" />
            Search Catalog
          </Link>
        </div>
        
        <div className="mt-20 pt-16 border-t border-slate-50 flex items-center justify-center gap-12 text-slate-300">
           <Zap size={32} strokeWidth={1} />
           <LayoutGrid size={32} strokeWidth={1} />
        </div>
      </motion.div>
    </div>
  );
}
