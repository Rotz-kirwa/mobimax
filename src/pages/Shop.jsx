import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import ProductCard from '../components/ui/ProductCard';
import { productMatchesQuery } from '../lib/catalog';
import { useCatalogStore } from '../store/useCatalogStore';

const SORT_OPTIONS = ['recommended', 'newest', 'price-low', 'price-high'];

function FilterSidebar({
  categories,
  brands,
  activeCategory,
  activeBrand,
  activeCondition,
  searchQuery,
  updateParam,
  clearFilters,
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-premium">
        <h3 className="mb-6 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">
          Categories
          <ChevronDown size={14} className="text-gray-300" />
        </h3>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => updateParam('category', null)}
            className={clsx(
              'w-full text-left text-[13px] font-bold py-1 transition-all',
              !activeCategory ? 'translate-x-1 text-brand-green' : 'text-gray-400 hover:text-gray-900'
            )}
          >
            All Collections
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => updateParam('category', category.id)}
              className={clsx(
                'w-full text-left text-[13px] font-bold py-1 transition-all',
                activeCategory === category.id
                  ? 'translate-x-1 text-brand-green'
                  : 'text-gray-400 hover:text-gray-900'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-premium">
        <h3 className="mb-6 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">
          Brands
          <ChevronDown size={14} className="text-gray-300" />
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {brands.slice(0, 12).map((brand) => (
            <button
              key={brand.id}
              type="button"
              onClick={() =>
                updateParam('brand', activeBrand?.toLowerCase() === brand.name.toLowerCase() ? null : brand.name)
              }
              className={clsx(
                'rounded-xl border px-3 py-2.5 text-center text-[10px] font-black uppercase tracking-tight transition-all',
                activeBrand?.toLowerCase() === brand.name.toLowerCase()
                  ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                  : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100'
              )}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-premium">
        <h3 className="mb-6 text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">
          Device Condition
        </h3>
        <div className="flex flex-col gap-2">
          {['New', 'Ex-UK Used', 'Refurbished'].map((condition) => (
            <button
              key={condition}
              type="button"
              onClick={() => updateParam('condition', activeCondition === condition ? null : condition)}
              className={clsx(
                'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-[12px] font-bold transition-all',
                activeCondition === condition
                  ? 'border-brand-green/20 bg-brand-green/10 text-brand-green'
                  : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'
              )}
            >
              {condition}
              {activeCondition === condition && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>

      {(activeCategory || activeBrand || activeCondition || searchQuery) && (
        <button
          type="button"
          onClick={clearFilters}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 text-[11px] font-black uppercase tracking-widest text-gray-500 transition-all hover:border-brand hover:text-brand"
        >
          <X size={13} />
          Clear All Filters
        </button>
      )}
    </div>
  );
}

export default function Shop() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const products = useCatalogStore((state) => state.products);
  const categories = useCatalogStore((state) => state.categories);
  const brands = useCatalogStore((state) => state.brands);
  const isDealsPage = location.pathname === '/deals';

  const activeCategory = searchParams.get('category') || '';
  const activeSubcategory = searchParams.get('subcategory') || '';
  const activeBrand = searchParams.get('brand') || '';
  const activeCondition = searchParams.get('condition') || '';
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';
  const minPrice = parseInt(searchParams.get('minPrice') || '0', 10) || 0;
  const maxPrice = parseInt(searchParams.get('maxPrice') || '1000000', 10) || 1_000_000;
  const sortBy = SORT_OPTIONS.includes(searchParams.get('sort')) ? searchParams.get('sort') : 'recommended';
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const updateParam = (key, value) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }

      return next;
    });
  };

  const handleInlineSearch = (event) => {
    event.preventDefault();
    updateParam('q', localSearch.trim() || null);
  };

  const clearFilters = () => {
    setLocalSearch('');
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (isDealsPage) {
      result = result.filter((product) => product.flags?.isHotDeal);
    }

    if (searchQuery) {
      result = result.filter((product) => productMatchesQuery(product, searchQuery));
    }

    if (activeCategory) {
      result = result.filter((product) => product.category === activeCategory);
    }

    if (activeSubcategory) {
      result = result.filter((product) => product.subcategory === activeSubcategory);
    }

    if (activeBrand) {
      result = result.filter(
        (product) => product.brand.toLowerCase() === activeBrand.toLowerCase()
      );
    }

    if (activeCondition) {
      result = result.filter((product) => product.condition === activeCondition);
    }

    result = result.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );

    if (sortBy === 'price-low') {
      result.sort((left, right) => left.price - right.price);
    } else if (sortBy === 'price-high') {
      result.sort((left, right) => right.price - left.price);
    } else if (sortBy === 'newest') {
      result.sort((left, right) => Number(right.isNew) - Number(left.isNew));
    }

    return result;
  }, [
    activeBrand,
    activeCategory,
    activeCondition,
    activeSubcategory,
    isDealsPage,
    maxPrice,
    minPrice,
    products,
    searchQuery,
    sortBy,
  ]);

  const pageTitle = isDealsPage
    ? 'Hot Deals – Mobimax Kenya'
    : activeCategory
      ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} – Mobimax Kenya`
      : 'Shop Electronics – Mobimax Kenya';

  const pageDesc = isDealsPage
    ? 'Grab limited-time hot deals on premium electronics at Mobimax Kenya. Genuine devices, M-Pesa checkout, fast delivery.'
    : 'Browse the full Mobimax electronics catalog. Phones, laptops, audio, accessories and more. M-Pesa accepted. Ships countrywide.';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />

      <div className="border-b border-gray-100 bg-white py-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="text-left">
              <div className="mb-2 flex items-center gap-2 justify-start">
                <div className="h-0.5 w-10 bg-brand-green"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-green sm:tracking-[0.3em]">
                  {isDealsPage ? 'Limited Offers' : 'Official Catalog'}
                </span>
              </div>
              <h1 className="text-2xl font-black uppercase leading-none tracking-tighter text-gray-900 sm:text-4xl md:text-5xl">
                {isDealsPage ? 'Hot Deals' : activeCategory || activeBrand || 'The Gallery'}
              </h1>
            </div>

            <div className="flex w-full items-center gap-4 md:w-auto">
              <form onSubmit={handleInlineSearch} className="group relative flex flex-1 md:w-80">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-brand-green"
                  size={18}
                />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(event) => setLocalSearch(event.target.value)}
                  placeholder="Find in this collection…"
                  aria-label="Search within collection"
                  className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-4 pl-12 pr-4 text-sm font-bold transition-all focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                />
                {localSearch && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      setLocalSearch('');
                      updateParam('q', null);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </form>

              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-white shadow-xl shadow-gray-200 transition-all hover:bg-brand-green lg:hidden"
                aria-label="Open filters"
              >
                <SlidersHorizontal size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-12 max-w-7xl px-4">
        <div className="flex flex-col gap-12 lg:flex-row">
          <aside className="hidden w-72 shrink-0 lg:block" aria-label="Filters">
            <div className="sticky top-28">
              <FilterSidebar
                categories={categories}
                brands={brands}
                activeCategory={activeCategory}
                activeBrand={activeBrand}
                activeCondition={activeCondition}
                searchQuery={searchQuery}
                updateParam={updateParam}
                clearFilters={clearFilters}
              />
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-[32px] border border-gray-100 bg-white p-4 shadow-sm md:flex-row md:items-center">
              <div className="flex items-center gap-3 px-2 sm:px-4 text-left text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 sm:text-xs sm:tracking-widest">
                <ArrowUpDown size={14} />
                Showing {filteredProducts.length} Premium Items
              </div>
              <div className="grid w-full grid-cols-2 gap-2 sm:flex md:w-auto">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateParam('sort', option === 'recommended' ? null : option)}
                    className={clsx(
                      'w-full rounded-2xl border px-4 py-3 text-[10px] font-black uppercase tracking-tighter transition-all sm:w-auto sm:px-5',
                      sortBy === option
                        ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                        : 'border-gray-100 bg-white text-gray-400 hover:text-gray-900'
                    )}
                  >
                    {option.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:gap-10 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredProducts.length === 0 && (
              <div className="mt-10 rounded-[40px] border-2 border-dashed border-gray-100 bg-white p-20 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                  <Search size={32} />
                </div>
                <h3 className="mb-2 text-2xl font-black uppercase tracking-tight text-gray-900">
                  No Items Match Your Filters
                </h3>
                <p className="mb-8 text-sm font-bold uppercase tracking-widest text-gray-400">
                  Widen your search or clear all filters.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-3xl bg-brand-green px-10 py-5 text-xs font-black uppercase tracking-widest text-white shadow-brand-green/20 transition-all active:scale-95 hover:shadow-xl"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="absolute right-0 top-0 h-full w-[85%] overflow-y-auto bg-gray-50 p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-10 flex items-center justify-between border-b border-gray-100 pb-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900">
                  Refine Search
                </h2>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label="Close filters"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-100 bg-white"
                >
                  <X size={20} />
                </button>
              </div>

              <FilterSidebar
                categories={categories}
                brands={brands}
                activeCategory={activeCategory}
                activeBrand={activeBrand}
                activeCondition={activeCondition}
                searchQuery={searchQuery}
                updateParam={updateParam}
                clearFilters={clearFilters}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
