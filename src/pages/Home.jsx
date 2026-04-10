import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Award, ShieldCheck, Truck, RotateCcw, Headphones as Support, ArrowRight, TrendingUp, ChevronDown } from 'lucide-react';
import HeroCarousel from '../components/home/HeroCarousel';
import ProductCard from '../components/ui/ProductCard';
import clsx from 'clsx';
import { useCatalogStore } from '../store/useCatalogStore';

export default function Home() {
  const products = useCatalogStore((state) => state.products);
  const categories = useCatalogStore((state) => state.categories);
  const brands = useCatalogStore((state) => state.brands);
  // React 19 hoists <title>/<meta> to <head> automatically
  const hotDeals = products.filter(p => p.flags?.isHotDeal).slice(0, 4);
  const featuredProducts = products.filter(p => p.flags?.isFeatured).slice(0, 8);
  const newArrivals = products.filter(p => p.isNew).slice(0, 8);

  const [activeTab, setActiveTab] = useState('featured');

  const tabContent = {
    featured: featuredProducts,
    new: newArrivals,
    trending: products.slice(10, 18)
  };

  const brandThemes = {
    Apple: {
      accent: 'from-slate-900 via-slate-700 to-slate-500',
      glow: 'from-slate-900/20 via-slate-500/15 to-transparent'
    },
    Samsung: {
      accent: 'from-blue-700 via-blue-500 to-cyan-400',
      glow: 'from-blue-600/20 via-cyan-400/15 to-transparent'
    },
    Xiaomi: {
      accent: 'from-orange-500 via-red-500 to-amber-400',
      glow: 'from-orange-500/20 via-red-400/15 to-transparent'
    },
    Oppo: {
      accent: 'from-emerald-600 via-green-500 to-lime-400',
      glow: 'from-emerald-500/20 via-lime-400/15 to-transparent'
    },
    Tecno: {
      accent: 'from-sky-600 via-cyan-500 to-blue-400',
      glow: 'from-sky-500/20 via-cyan-400/15 to-transparent'
    },
    Infinix: {
      accent: 'from-violet-600 via-fuchsia-500 to-pink-400',
      glow: 'from-violet-500/20 via-fuchsia-400/15 to-transparent'
    },
    Sony: {
      accent: 'from-zinc-800 via-zinc-600 to-indigo-400',
      glow: 'from-zinc-700/20 via-indigo-400/15 to-transparent'
    },
    JBL: {
      accent: 'from-red-600 via-orange-500 to-yellow-400',
      glow: 'from-red-500/20 via-orange-400/15 to-transparent'
    }
  };

  const featuredBrands = brands.slice(0, 8).map((brand) => ({
    name: brand.name,
    ...(brandThemes[brand.name] || {
      accent: 'from-slate-900 via-slate-700 to-slate-500',
      glow: 'from-slate-900/20 via-slate-500/15 to-transparent',
    })
  }));

  return (
    <div className="bg-white min-h-screen">
      <title>MobiPlus – Premium Electronics in Kenya</title>
      <meta name="description" content="Shop genuine smartphones, laptops, audio gear and accessories at MobiPlus Kenya. M-Pesa accepted. Fast countrywide delivery. Official warranty on all devices." />
      <meta property="og:title" content="MobiPlus – Premium Electronics in Kenya" />
      <meta property="og:description" content="Kenya's premium electronics store. Genuine devices, M-Pesa payments, express delivery." />
      <meta property="og:type" content="website" />
      {/* Hero Section */}
      <HeroCarousel />

      {/* Trust Badges - Horizontal Strip */}
      <section className="bg-gray-50 border-y border-gray-100 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm border border-gray-100">
                  <ShieldCheck size={24} />
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black uppercase text-gray-900 tracking-wider">100% Genuine</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Authentic Brands</span>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm border border-gray-100">
                  <Truck size={24} />
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black uppercase text-gray-900 tracking-wider">Fast Delivery</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Nationwide Shipping</span>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm border border-gray-100">
                  <RotateCcw size={24} />
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black uppercase text-gray-900 tracking-wider">7 Days Return</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Easy Returns Policy</span>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm border border-gray-100">
                  <Support size={24} />
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black uppercase text-gray-900 tracking-wider">Pro Support</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Online 24/7 Chat</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Brand Strip */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-white via-emerald-50/30 to-white py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[8%] top-[-25%] h-56 w-56 rounded-full bg-brand-green/10 blur-3xl"></div>
          <div className="absolute right-[10%] bottom-[-30%] h-64 w-64 rounded-full bg-brand/10 blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="relative z-10">
            <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-brand-green shadow-sm ring-1 ring-brand-green/10">
                  Brand Spotlight
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-gray-900 uppercase">
                  Shop the Brands Everyone Wants
                </h2>
                <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-gray-500">
                  Explore handpicked brand lanes with a brighter, more premium feel before you dive into the deals.
                </p>
              </div>

              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 self-start rounded-3xl bg-gray-900 px-7 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-brand-green"
              >
                Browse Full Catalog
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 md:gap-x-12 md:gap-y-8">
              {featuredBrands.map((brand) => (
                <Link
                  key={brand.name}
                  to={`/shop?brand=${brand.name.toLowerCase()}`}
                  className={clsx(
                    'group relative inline-flex items-center justify-center px-2 py-3 transition-transform duration-300 hover:-translate-y-1'
                  )}
                >
                  <span className={clsx('absolute inset-x-2 bottom-1 h-4 rounded-full bg-gradient-to-r opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100', brand.glow)}></span>
                  <span className={clsx('relative bg-gradient-to-r bg-clip-text text-3xl font-black uppercase italic tracking-[-0.06em] text-transparent transition-all duration-300 sm:text-4xl md:text-5xl lg:text-6xl', brand.accent)}>
                    {brand.name}
                  </span>
                  <span className={clsx('absolute -bottom-1 left-2 right-2 h-0.5 origin-left scale-x-0 bg-gradient-to-r transition-transform duration-300 group-hover:scale-x-100', brand.accent)}></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hot Deals Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
               <div className="flex items-center gap-2 mb-4">
                 <div className="w-12 h-0.5 bg-brand-green"></div>
                 <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em]">Extreme Savings</span>
               </div>
               <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4 uppercase">
                 Hot Deals <span className="text-brand">🔥</span>
               </h2>
               <p className="text-gray-400 font-bold text-sm uppercase tracking-wide">Limited time offers. Huge discounts on premium tech.</p>
            </div>
            <Link to="/deals" className="group flex items-center gap-4 bg-gray-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-brand-green transition-all shadow-xl shadow-gray-200">
               Explore all deals <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
            {hotDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-20 bg-gray-50 overflow-hidden">
         <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-16">
               <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.4em] mb-4 block">Broswe the Mall</span>
               <h2 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tighter">Shop by Category</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.slice(0, 4).map((cat, idx) => (
                  <Link 
                    key={idx} 
                    to={`/shop?category=${cat.id}`}
                    className="group bg-white rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center shadow-premium hover-shadow-premium hover-lift transition-all"
                  >
                    <div className="w-20 h-20 bg-gray-50 rounded-[28px] flex items-center justify-center text-gray-900 group-hover:bg-brand-green group-hover:text-white transition-all duration-500 mb-8 border border-gray-100">
                       <TrendingUp size={32} />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">{cat.name}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-brand-green transition-colors">
                      {cat.subcategories.length} Subcategories
                    </p>
                  </Link>
                ))}
            </div>
         </div>
      </section>

      {/* Main Tabbed Storefront */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col items-center mb-16">
            <div className="flex gap-4 md:gap-8 bg-gray-50 p-2 rounded-[24px] mb-12">
               {[
                 { id: 'featured', label: 'Featured', icon: Award },
                 { id: 'new', label: 'New Arrivals', icon: Zap },
                 { id: 'trending', label: 'Best Selling', icon: Sparkles }
               ].map((tab) => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={clsx(
                     "flex items-center gap-2 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
                     activeTab === tab.id 
                       ? "bg-white text-gray-900 shadow-premium" 
                       : "text-gray-400 hover:text-gray-900"
                   )}
                 >
                   <tab.icon size={14} className={clsx(activeTab === tab.id ? "text-brand-green" : "")} />
                   {tab.label}
                 </button>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
            {tabContent[activeTab].map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
               to="/shop" 
               className="inline-flex items-center gap-4 bg-gray-50 hover:bg-gray-100 text-gray-900 px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all border border-gray-100"
            >
               Browse Full Catalog <ChevronDown size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Partners Showcase */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-green blur-[150px] rounded-full"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand blur-[150px] rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
             <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.5em] mb-4 block">Official Partner</span>
             <h2 className="text-3xl sm:text-4xl md:text-6xl font-black leading-none mb-12 tracking-tighter uppercase">Authentic Experience</h2>
             
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-12 items-center justify-center">
                {['Samsung', 'Apple', 'Google', 'Oraimo', 'Xiaomi', 'Oppo', 'Sony', 'JBL'].map((b, idx) => (
                   <span key={idx} className="text-2xl font-black text-gray-600 uppercase hover:text-white transition-colors cursor-default tracking-tighter italic">
                     {b}
                   </span>
                ))}
             </div>
             
             <div className="mt-20 grid grid-cols-2 gap-8 border-t border-white/5 pt-20 text-left md:grid-cols-4 md:text-center">
                <div className="flex flex-col gap-2">
                   <span className="text-6xl font-black text-brand-green leading-none tracking-tighter">70+</span>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Premium Brands</span>
                </div>
                <div className="flex flex-col gap-2">
                   <span className="text-6xl font-black text-white leading-none tracking-tighter">10K+</span>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Happy Customers</span>
                </div>
                <div className="flex flex-col gap-2">
                   <span className="text-6xl font-black text-brand leading-none tracking-tighter">24H</span>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Speed Delivery</span>
                </div>
                <div className="flex flex-col gap-2">
                   <span className="text-6xl font-black text-white leading-none tracking-tighter">99%</span>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Satisfaction</span>
                </div>
             </div>
          </div>
      </section>

    </div>
  );
}
