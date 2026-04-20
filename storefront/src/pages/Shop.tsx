import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  Package,
  ChevronDown,
  Check,
  ArrowUpDown,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import ProductCard from '../components/ui/ProductCard';
import { useProducts, useMetadata } from '../hooks/useCatalog';
import { Category, Brand } from '@mobiplus/shared';

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low–High' },
  { value: 'price-high', label: 'Price: High–Low' },
];

/* ── Card skeleton ── */
function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-44 sm:h-56 bg-slate-100" />
      <div className="p-3.5 space-y-2">
        <div className="h-3 w-16 bg-slate-100 rounded" />
        <div className="h-4 w-full bg-slate-100 rounded" />
        <div className="h-4 w-3/4 bg-slate-100 rounded" />
        <div className="h-5 w-24 bg-slate-100 rounded mt-3" />
        <div className="h-9 w-full bg-slate-100 rounded-lg mt-2" />
      </div>
    </div>
  );
}

/* ── Filter sidebar ── */
interface FilterSidebarProps {
  categories: Category[];
  brands: Brand[];
  activeCategory: string;
  activeBrand: string;
  searchQuery: string;
  updateParam: (key: string, value: string | null) => void;
  clearFilters: () => void;
  onClose?: () => void;
}

function FilterSidebar({
  categories,
  brands,
  activeCategory,
  activeBrand,
  updateParam,
  clearFilters,
  onClose,
}: FilterSidebarProps) {
  const [brandsExpanded, setBrandsExpanded] = useState(true);
  const [catsExpanded, setCatsExpanded] = useState(true);

  const hasActiveFilters = !!(activeCategory || activeBrand);

  return (
    <div className="flex flex-col gap-3">

      {/* Active filters strip */}
      {hasActiveFilters && (
        <div className="bg-brand-green/5 border border-brand-green/20 rounded-xl p-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {activeCategory && (
              <span className="flex items-center gap-1 bg-brand-green text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                {categories.find((c) => c.id === activeCategory)?.name || activeCategory}
                <button
                  type="button"
                  onClick={() => updateParam('category', null)}
                  className="hover:opacity-70"
                >
                  <X size={10} />
                </button>
              </span>
            )}
            {activeBrand && (
              <span className="flex items-center gap-1 bg-brand-green text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                {activeBrand}
                <button
                  type="button"
                  onClick={() => updateParam('brand', null)}
                  className="hover:opacity-70"
                >
                  <X size={10} />
                </button>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="text-[11px] font-semibold text-slate-500 hover:text-red-500 transition-colors ml-2 shrink-0"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setCatsExpanded((v) => !v)}
          className="w-full flex items-center justify-between p-4 text-[13px] font-bold text-slate-900 hover:bg-slate-50 transition-colors"
        >
          Categories
          <ChevronDown
            size={15}
            className={clsx('text-slate-400 transition-transform', catsExpanded && 'rotate-180')}
          />
        </button>

        {catsExpanded && (
          <div className="px-2 pb-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => { updateParam('category', null); onClose?.(); }}
              className={clsx(
                'w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium transition-colors',
                !activeCategory
                  ? 'bg-brand-green/10 text-brand-green font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              All Categories
              {!activeCategory && <Check size={13} />}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => { updateParam('category', cat.id); onClose?.(); }}
                className={clsx(
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium transition-colors',
                  activeCategory === cat.id
                    ? 'bg-brand-green/10 text-brand-green font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <span className="flex items-center gap-2">
                  <ChevronRight size={12} className="text-slate-300" />
                  {cat.name}
                </span>
                {activeCategory === cat.id && <Check size={13} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brands */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setBrandsExpanded((v) => !v)}
          className="w-full flex items-center justify-between p-4 text-[13px] font-bold text-slate-900 hover:bg-slate-50 transition-colors"
        >
          Brands
          <ChevronDown
            size={15}
            className={clsx('text-slate-400 transition-transform', brandsExpanded && 'rotate-180')}
          />
        </button>

        {brandsExpanded && (
          <div className="px-3 pb-3 border-t border-slate-100">
            <div className="pt-2 grid grid-cols-2 gap-1.5">
              {brands.slice(0, 16).map((brand) => {
                const isActive = activeBrand?.toLowerCase() === brand.name.toLowerCase();
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => {
                      updateParam('brand', isActive ? null : brand.name);
                      onClose?.();
                    }}
                    className={clsx(
                      'px-2.5 py-2 rounded-xl text-[12px] font-semibold text-center transition-all border',
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-slate-300 hover:text-slate-900'
                    )}
                  >
                    {brand.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Deals shortcut */}
      <Link
        to="/deals"
        onClick={onClose}
        className="flex items-center gap-2.5 bg-rose-50 border border-rose-100 rounded-2xl p-4 text-rose-600 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all group"
      >
        <Zap size={16} fill="currentColor" className="shrink-0" />
        <div>
          <p className="text-[13px] font-bold leading-tight">Hot Deals</p>
          <p className="text-[11px] opacity-70 leading-none mt-0.5">Best prices today</p>
        </div>
        <ChevronRight size={14} className="ml-auto opacity-50 group-hover:opacity-100" />
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SHOP PAGE
════════════════════════════════════════════════════════ */
export default function Shop() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: products = [], isLoading: isProductsLoading } = useProducts();
  const { data: metadata, isLoading: isMetadataLoading } = useMetadata();
  const { categories = [], brands = [] } = metadata || {};

  const isDealsPage = location.pathname === '/deals';

  const activeCategory = searchParams.get('category') || '';
  const activeBrand = searchParams.get('brand') || '';
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';
  const rawSort = searchParams.get('sort') || 'recommended';
  const sortBy = SORT_OPTIONS.some((o) => o.value === rawSort) ? rawSort : 'recommended';

  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const updateParam = (key: string, value: string | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('q', localSearch.trim() || null);
  };

  const clearFilters = () => {
    setLocalSearch('');
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (isDealsPage) result = result.filter((p) => p.isHotDeal);
    if (searchQuery)
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) ||
          p.brand.toLowerCase().includes(searchQuery) ||
          (p.description ?? '').toLowerCase().includes(searchQuery)
      );
    if (activeCategory) result = result.filter((p) => p.category === activeCategory);
    if (activeBrand)
      result = result.filter((p) => p.brand.toLowerCase() === activeBrand.toLowerCase());

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'newest')
      result.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

    return result;
  }, [products, isDealsPage, searchQuery, activeCategory, activeBrand, sortBy]);

  const isLoading = isProductsLoading || isMetadataLoading;

  /* Derived page title */
  const pageTitle = isDealsPage
    ? 'Hot Deals'
    : activeCategory
    ? (categories.find((c) => c.id === activeCategory)?.name ?? activeCategory)
    : activeBrand
    ? activeBrand
    : searchQuery
    ? `"${searchQuery}"`
    : 'All Products';

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="container mx-auto max-w-7xl px-4 py-5">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-3">
            <Link to="/" className="hover:text-brand-green transition-colors">Home</Link>
            <ChevronRight size={11} />
            {isDealsPage ? (
              <span className="text-rose-500 font-semibold">Hot Deals</span>
            ) : (
              <span className="text-slate-700 font-semibold">{pageTitle}</span>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {isDealsPage && (
                <p className="text-[11px] font-bold text-rose-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Zap size={11} fill="currentColor" /> Limited Time
                </p>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                {pageTitle}
              </h1>
              {!isLoading && (
                <p className="text-[13px] text-slate-400 mt-1">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                </p>
              )}
            </div>

            {/* Search + mobile filter toggle */}
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="relative flex-1 sm:w-72">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search products…"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green focus:bg-white transition-all"
                />
                {localSearch && (
                  <button
                    type="button"
                    onClick={() => { setLocalSearch(''); updateParam('q', null); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>

              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-slate-900 text-white text-[12px] font-semibold px-3.5 py-2.5 rounded-xl hover:bg-brand-green transition-colors shrink-0"
              >
                <SlidersHorizontal size={15} />
                Filters
                {(activeCategory || activeBrand) && (
                  <span className="w-4 h-4 bg-brand-green text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {[activeCategory, activeBrand].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 mt-6">
        <div className="flex gap-6">

          {/* ── Desktop sidebar ── */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                categories={categories}
                brands={brands}
                activeCategory={activeCategory}
                activeBrand={activeBrand}
                searchQuery={searchQuery}
                updateParam={updateParam}
                clearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-5 bg-white border border-slate-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 gap-2 overflow-hidden">
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 shrink-0">
                <ArrowUpDown size={13} />
                <span className="hidden sm:inline">{isLoading ? 'Loading…' : `${filteredProducts.length} results`}</span>
                <span className="sm:hidden">{isLoading ? '…' : filteredProducts.length}</span>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateParam('sort', opt.value === 'recommended' ? null : opt.value)}
                    className={clsx(
                      'shrink-0 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap',
                      sortBy === opt.value
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                  <Package size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No products found</h3>
                <p className="text-sm text-slate-500 max-w-xs mb-6">
                  Try adjusting your search or removing some filters to see more results.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-brand-green text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ Mobile filter drawer ═══════════════════════════ */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[85%] max-w-sm bg-slate-50 shadow-2xl overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0">
                <h2 className="text-base font-bold text-slate-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar
                  categories={categories}
                  brands={brands}
                  activeCategory={activeCategory}
                  activeBrand={activeBrand}
                  searchQuery={searchQuery}
                  updateParam={updateParam}
                  clearFilters={clearFilters}
                  onClose={() => setIsSidebarOpen(false)}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
