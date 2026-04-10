import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCatalogStore } from '../../store/useCatalogStore';

export default function HeroCarousel() {
  const heroBanners = useCatalogStore((state) => state.heroBanners);
  const [current, setCurrent] = useState(0);
  const activeIndex = heroBanners.length > 0 ? current % heroBanners.length : 0;

  useEffect(() => {
    if (heroBanners.length === 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  if (heroBanners.length === 0) {
    return null;
  }

  const next = () => setCurrent((prev) => (prev + 1) % heroBanners.length);
  const prev = () => setCurrent((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);

  return (
    <section className="relative w-full h-[400px] md:h-[600px] overflow-hidden bg-gray-900 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 flex items-center"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={heroBanners[activeIndex].bg} 
              alt={heroBanners[activeIndex].title} 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-6 max-w-7xl relative z-10 text-white">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-xl"
            >
              <p className="text-brand-green font-black uppercase tracking-[0.4em] text-[10px] md:text-xs mb-4">
                {heroBanners[activeIndex].eyebrow || 'Limited Edition Drop'}
              </p>
              <h2 className="text-4xl md:text-7xl font-black leading-[1.1] mb-6 tracking-tighter">
                {heroBanners[activeIndex].title}
              </h2>
              <p className="text-sm md:text-lg text-gray-300 font-medium mb-10 leading-relaxed max-w-sm">
                {heroBanners[activeIndex].subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to={heroBanners[activeIndex].link} 
                  className="bg-brand-green text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-brand-green transition-all shadow-xl shadow-brand-green/20 flex items-center gap-2 group/btn"
                >
                  Shop the Collection <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <Link 
                   to="/deals" 
                   className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
                >
                   View Hot Deals
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <button 
        onClick={prev}
        aria-label="Show previous hero banner"
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={next}
        aria-label="Show next hero banner"
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {heroBanners.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to hero banner ${idx + 1}`}
            className={`w-12 h-1 rounded-full transition-all duration-500 ${activeIndex === idx ? 'bg-brand-green' : 'bg-white/20'}`}
          />
        ))}
      </div>
    </section>
  );
}
