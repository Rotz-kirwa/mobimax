import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Award, ShieldCheck, Truck, RotateCcw, Headphones as Support, ArrowRight, TrendingUp, ChevronDown } from 'lucide-react';
import HeroCarousel from '../components/home/HeroCarousel';
import ProductCard from '../components/ui/ProductCard';
import { products, categories, brands } from '../data/mockData';
import clsx from 'clsx';

export default function Home() {
  const hotDeals = products.filter(p => p.flags?.isHotDeal).slice(0, 4);
  const featuredProducts = products.filter(p => p.flags?.isFeatured).slice(0, 8);
  const newArrivals = products.filter(p => p.isNew).slice(0, 8);

  const [activeTab, setActiveTab] = useState('featured');

  const tabContent = {
    featured: featuredProducts,
    new: newArrivals,
    trending: products.slice(10, 18)
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Trust Badges - Horizontal Strip */}
      <section className="bg-gray-50 border-y border-gray-100 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm border border-gray-100">
                  <ShieldCheck size={24} />
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-black uppercase text-gray-900 tracking-wider">100% Genuine</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Authentic Brands</span>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm border border-gray-100">
                  <Truck size={24} />
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-black uppercase text-gray-900 tracking-wider">Fast Delivery</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Nationwide Shipping</span>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm border border-gray-100">
                  <RotateCcw size={24} />
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-black uppercase text-gray-900 tracking-wider">7 Days Return</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Easy Returns Policy</span>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm border border-gray-100">
                  <Support size={24} />
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-black uppercase text-gray-900 tracking-wider">Pro Support</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Online 24/7 Chat</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Brand Strip */}
      <section className="py-12 border-b border-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
           <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              {brands.slice(0, 8).map((brand, idx) => (
                <span key={idx} className="text-xl md:text-3xl font-black italic tracking-tighter text-gray-400 uppercase cursor-pointer hover:text-brand-green">
                  {brand}
                </span>
              ))}
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
               <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4 uppercase">
                 Hot Deals <span className="text-brand">🔥</span>
               </h2>
               <p className="text-gray-400 font-bold text-sm uppercase tracking-wide">Limited time offers. Huge discounts on premium tech.</p>
            </div>
            <Link to="/deals" className="group flex items-center gap-4 bg-gray-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-brand-green transition-all shadow-xl shadow-gray-200">
               Explore all deals <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
               <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Shop by Category</h2>
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
             <h2 className="text-4xl md:text-6xl font-black leading-none mb-12 tracking-tighter uppercase">Authentic Experience</h2>
             
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-12 items-center justify-center">
                {['Samsung', 'Apple', 'Google', 'Oraimo', 'Xiaomi', 'Oppo', 'Sony', 'JBL'].map((b, idx) => (
                   <span key={idx} className="text-2xl font-black text-gray-600 uppercase hover:text-white transition-colors cursor-default tracking-tighter italic">
                     {b}
                   </span>
                ))}
             </div>
             
             <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-12 border-t border-white/5 pt-20">
                <div className="flex flex-col gap-2">
                   <span className="text-6xl font-black text-brand-green leading-none tracking-tighter">70+</span>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Premium Brands</span>
                </div>
                <div className="w-px h-12 bg-white/10 hidden md:block"></div>
                <div className="flex flex-col gap-2">
                   <span className="text-6xl font-black text-white leading-none tracking-tighter">10K+</span>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Happy Customers</span>
                </div>
                <div className="w-px h-12 bg-white/10 hidden md:block"></div>
                <div className="flex flex-col gap-2">
                   <span className="text-6xl font-black text-brand leading-none tracking-tighter">24H</span>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Speed Delivery</span>
                </div>
             </div>
          </div>
      </section>

    </div>
  );
}
