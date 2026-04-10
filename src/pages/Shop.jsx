import { useState, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, Check, X, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { products, categories, brands } from '../data/mockData';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function Shop() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const isDealsPage = location.pathname === '/deals';
  
  // Filtering Logic
  const activeCategory = searchParams.get('category');
  const activeSubcategory = searchParams.get('subcategory');
  const activeBrand = searchParams.get('brand');
  const activeCondition = searchParams.get('condition');
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';
  const minPrice = parseInt(searchParams.get('minPrice')) || 0;
  const maxPrice = parseInt(searchParams.get('maxPrice')) || 1000000;

  const filteredProducts = useMemo(() => {
    let result = products;

    if (isDealsPage) {
      result = result.filter((p) => p.flags?.isHotDeal);
    }
    
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery) || 
        p.brand.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery)
      );
    }
    
    if (activeCategory) {
      result = result.filter(p => p.category === activeCategory);
    }
    if (activeSubcategory) {
      result = result.filter(p => p.subcategory === activeSubcategory);
    }
    if (activeBrand) {
      result = result.filter(p => p.brand.toLowerCase() === activeBrand.toLowerCase());
    }
    if (activeCondition) {
      result = result.filter(p => p.condition === activeCondition);
    }
    
    result = result.filter(p => p.price >= minPrice && p.price <= maxPrice);
    
    // sorting
    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result = [...result].sort((a, b) => b.isNew ? 1 : -1);
    }
    
    return result;
  }, [activeCategory, activeSubcategory, activeBrand, activeCondition, searchQuery, minPrice, maxPrice, sortBy, isDealsPage]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Search & Header Strip */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="text-left">
                 <div className="flex items-center gap-2 mb-2 justify-start">
                    <div className="w-10 h-0.5 bg-brand-green"></div>
                    <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                      {isDealsPage ? 'Limited Offers' : 'Official Catalog'}
                    </span>
                 </div>
                 <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                    {isDealsPage ? 'Hot Deals' : activeCategory || activeBrand || 'The Gallery'}
                 </h1>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="relative flex-1 md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-green transition-colors" size={18} />
                    <input 
                       type="text" 
                       placeholder="Find in this collection..."
                       className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green font-bold text-sm transition-all"
                    />
                 </div>
                 <button 
                   onClick={() => setIsSidebarOpen(true)}
                   className="lg:hidden w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-brand-green transition-all shadow-xl shadow-gray-200"
                 >
                    <SlidersHorizontal size={22} />
                 </button>
              </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Advanced Sidebar Filters */}
          <aside className="hidden lg:block w-72 shrink-0">
             <div className="sticky top-28 flex flex-col gap-8">
                
                {/* Category Group */}
                <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-premium">
                   <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                      Categories
                      <ChevronDown size={14} className="text-gray-300" />
                   </h3>
                   <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => updateParam('category', null)}
                        className={clsx(
                          "w-full text-left text-[13px] font-bold py-1 transition-all",
                          !activeCategory ? "text-brand-green translate-x-1" : "text-gray-400 hover:text-gray-900"
                        )}
                      >
                         All Collections
                      </button>
                      {categories.map(c => (
                        <button 
                          key={c.id}
                          onClick={() => updateParam('category', c.id)}
                          className={clsx(
                            "w-full text-left text-[13px] font-bold py-1 transition-all",
                            activeCategory === c.id ? "text-brand-green translate-x-1" : "text-gray-400 hover:text-gray-900"
                          )}
                        >
                           {c.name}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Brand Group */}
                <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-premium">
                   <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                      Brands
                      <ChevronDown size={14} className="text-gray-300" />
                   </h3>
                   <div className="grid grid-cols-2 gap-2">
                      {brands.slice(0, 12).map(brand => (
                        <button 
                          key={brand}
                          onClick={() => updateParam('brand', brand)}
                          className={clsx(
                            "text-[10px] font-black uppercase tracking-tight py-2.5 px-3 rounded-xl border transition-all text-center",
                            activeBrand?.toLowerCase() === brand.toLowerCase()
                             ? "bg-gray-900 text-white border-gray-900 shadow-lg"
                             : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100"
                          )}
                        >
                           {brand}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Condition Filter */}
                <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-premium">
                   <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-6">Device Condition</h3>
                   <div className="flex flex-col gap-2">
                      {['New', 'Ex-UK Used'].map(cond => (
                        <button 
                          key={cond}
                          onClick={() => updateParam('condition', activeCondition === cond ? null : cond)}
                          className={clsx(
                            "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-[12px] font-bold transition-all",
                            activeCondition === cond 
                              ? "bg-brand-green/10 text-brand-green border-brand-green/20" 
                              : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50"
                          )}
                        >
                           {cond}
                           {activeCondition === cond && <Check size={14} />}
                        </button>
                      ))}
                   </div>
                </div>

             </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
             
             {/* Toolbar */}
             <div className="bg-white rounded-[32px] border border-gray-100 p-4 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3 px-2 sm:px-4 font-bold text-[10px] sm:text-xs uppercase tracking-[0.08em] sm:tracking-widest text-gray-400 text-left">
                   <ArrowUpDown size={14} />
                   Showing {filteredProducts.length} Premium Items
                </div>
                <div className="grid grid-cols-2 sm:flex gap-2 w-full md:w-auto">
                   {['recommended', 'newest', 'price-low', 'price-high'].map(sort => (
                     <button
                        key={sort}
                        onClick={() => setSortBy(sort)}
                        className={clsx(
                          "w-full sm:w-auto px-4 sm:px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all border",
                          sortBy === sort 
                            ? "bg-gray-900 text-white border-gray-900 shadow-lg" 
                            : "bg-white text-gray-400 border-gray-100 hover:text-gray-900"
                        )}
                     >
                        {sort.replace('-', ' ')}
                     </button>
                   ))}
                </div>
             </div>

             {/* Results Grid */}
             <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                       <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>

             {filteredProducts.length === 0 && (
               <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-100 p-20 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                     <Search size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">No Items Match Your Filters</h3>
                  <p className="text-gray-400 font-bold text-sm mb-8 uppercase tracking-widest">Widen your search or clear all filters.</p>
                  <button 
                    onClick={clearFilters}
                    className="bg-brand-green text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:shadow-xl shadow-brand-green/20 transition-all active:scale-95"
                  >
                     Reset All Filters
                  </button>
               </div>
             )}
          </div>

        </div>
      </div>

      {/* Mobile Sidebar (Slide-in) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
             <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="absolute right-0 top-0 h-full w-[85%] bg-white p-8 overflow-y-auto"
               onClick={(e) => e.stopPropagation()}
             >
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                   <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Refine Search</h2>
                   <button onClick={() => setIsSidebarOpen(false)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center"><X size={20} /></button>
                </div>
                
                <div className="flex flex-col gap-10">
                   {/* Mobile Filter Groups would go here, reusing same logic as Desktop */}
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mobile filters optimized for touch...</p>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
