import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { HeroBanner } from '@mobiplus/shared';

interface HeroCarouselProps {
  banners: HeroBanner[];
}

const SLIDES = [
  {
    id: 's1',
    label: 'Just Launched',
    title: 'iPhone 17 Pro',
    cta: 'BUY NOW',
    link: '/shop?brand=apple&category=phones',
    image: 'https://i.pinimg.com/1200x/9a/cd/80/9acd80fde83863f692d3349470013137.jpg',
    bg: '#0d0d0d',
    accent: '#f97316',
    flip: false,
  },
  {
    id: 's2',
    label: 'Galaxy AI',
    title: 'Samsung S25 Ultra',
    cta: 'SHOP NOW',
    link: '/shop?brand=samsung',
    image: 'https://i.pinimg.com/736x/d8/e6/9f/d8e69f9b36b7a2cf0a3add6d0d83498a.jpg',
    bg: '#050a14',
    accent: '#3b82f6',
    flip: true,
  },
  {
    id: 's3',
    label: 'Level Up',
    title: 'Gaming Controllers & Pads',
    cta: 'SHOP GAMING',
    link: '/shop?category=gaming',
    image: 'https://i.pinimg.com/1200x/c4/d0/2a/c4d02a22d02d4d2b18e070f524f812db.jpg',
    bg: '#030d03',
    accent: '#22c55e',
    flip: false,
  },
  {
    id: 's4',
    label: 'Create More',
    title: 'Content Creator Kits',
    cta: 'SHOP CREATOR',
    link: '/shop?category=photography',
    image: 'https://i.pinimg.com/736x/47/dd/d5/47ddd54a929fc0bead7ba92208a14536.jpg',
    bg: '#0d080d',
    accent: '#e879f9',
    flip: true,
  },
  {
    id: 's5',
    label: 'Pure Sound',
    title: 'Premium Audio Devices',
    cta: 'SHOP AUDIO',
    link: '/shop?category=audio',
    image: 'https://i.pinimg.com/736x/01/25/11/01251172996a8bb811c24441acbd5df9.jpg',
    bg: '#04090d',
    accent: '#38bdf8',
    flip: false,
  },
  {
    id: 's6',
    label: 'Power Your Work',
    title: 'MacBooks & Laptops',
    cta: 'SHOP LAPTOPS',
    link: '/shop?category=laptops',
    image: 'https://i.pinimg.com/1200x/74/da/de/74dade62789f9ad72bf6ea604ede8aa4.jpg',
    bg: '#080808',
    accent: '#a3a3a3',
    flip: true,
  },
  {
    id: 's7',
    label: 'Stay Connected',
    title: 'Smart Watches & Bands',
    cta: 'SHOP WEARABLES',
    link: '/shop?category=accessories&subcategory=Smartwatches',
    image: 'https://i.pinimg.com/736x/bc/05/cb/bc05cb334661ddb8243212efa40f0f30.jpg',
    bg: '#080d0d',
    accent: '#2dd4bf',
    flip: false,
  },
  {
    id: 's8',
    label: 'Nothing Like It',
    title: 'Nothing Phone 3',
    cta: 'EXPLORE',
    link: '/shop?brand=nothing',
    image: 'https://i.pinimg.com/736x/47/dd/d5/47ddd54a929fc0bead7ba92208a14536.jpg',
    bg: '#0a0a0a',
    accent: '#ffffff',
    flip: true,
  },
];

export default function HeroCarousel({ banners: _ }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((p) => (p + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next]);

  const s = SLIDES[current];

  return (
    <section
      className="relative w-full overflow-hidden select-none"
      style={{ height: 'clamp(240px, 34vw, 400px)', backgroundColor: s.bg, transition: 'background-color 0.5s ease' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={s.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex items-stretch"
        >
          {!s.flip ? (
            <>
              {/* Image — left 60% */}
              <div className="w-[60%] relative overflow-hidden">
                <motion.img
                  src={s.image}
                  alt={s.title}
                  initial={{ scale: 1.04 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.7 }}
                  className="w-full h-full object-contain object-center"
                />
                {/* Fade right edge into bg */}
                <div
                  className="absolute inset-y-0 right-0 w-32 pointer-events-none"
                  style={{ background: `linear-gradient(to right, transparent, ${s.bg})` }}
                />
              </div>
              {/* Text — right 40% */}
              <div className="w-[40%] flex flex-col justify-center pr-10 pl-2">
                <TextBlock s={s} />
              </div>
            </>
          ) : (
            <>
              {/* Text — left 40% */}
              <div className="w-[40%] flex flex-col justify-center pl-10 pr-2">
                <TextBlock s={s} />
              </div>
              {/* Image — right 60% */}
              <div className="w-[60%] relative overflow-hidden">
                <motion.img
                  src={s.image}
                  alt={s.title}
                  initial={{ scale: 1.04 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.7 }}
                  className="w-full h-full object-contain object-center"
                />
                {/* Fade left edge into bg */}
                <div
                  className="absolute inset-y-0 left-0 w-32 pointer-events-none"
                  style={{ background: `linear-gradient(to left, transparent, ${s.bg})` }}
                />
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 flex items-center justify-center transition-all"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 flex items-center justify-center transition-all"
      >
        <ChevronRight size={16} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={clsx(
              'h-1 rounded-full transition-all duration-300',
              i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/25 hover:bg-white/50'
            )}
          />
        ))}
      </div>
    </section>
  );
}

function TextBlock({ s }: { s: typeof SLIDES[number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.45 }}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-2" style={{ color: s.accent }}>
        {s.label}
      </p>
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-4">
        {s.title}
      </h2>
      <Link
        to={s.link}
        className="inline-block text-[11px] font-black uppercase tracking-widest px-6 py-2.5 rounded transition-all hover:opacity-90 active:scale-95"
        style={{ backgroundColor: s.accent, color: s.accent === '#ffffff' ? '#000' : '#fff' }}
      >
        {s.cta}
      </Link>
    </motion.div>
  );
}
