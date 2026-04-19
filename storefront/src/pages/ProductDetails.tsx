import { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Check,
  Shield,
  Truck,
  RotateCcw,
  Star,
  ChevronRight,
  MessageCircle,
  Package,
  Minus,
  Plus,
  Share2,
  Tag,
} from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ui/ProductCard';
import { useProduct, useProducts } from '../hooks/useCatalog';

/* ── Static rating display ── */
function StarRating({ score = 4.5 }: { score?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < Math.floor(score) ? 'text-amber-400' : 'text-slate-200'}
            fill={i < Math.floor(score) ? 'currentColor' : 'none'}
          />
        ))}
      </div>
      <span className="text-[12px] font-semibold text-slate-700">{score}</span>
      <span className="text-[12px] text-slate-400">(42 reviews)</span>
    </div>
  );
}

/* ── Skeleton ── */
function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-[50%] h-[480px] bg-slate-100 rounded-2xl" />
          <div className="flex-1 space-y-4">
            <div className="h-4 w-24 bg-slate-100 rounded" />
            <div className="h-8 w-3/4 bg-slate-100 rounded" />
            <div className="h-8 w-1/2 bg-slate-100 rounded" />
            <div className="h-16 w-full bg-slate-100 rounded-2xl mt-6" />
            <div className="h-12 w-full bg-slate-100 rounded-xl" />
            <div className="h-12 w-full bg-slate-100 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const stateProduct = (location.state as { product?: any })?.product ?? null;
  const { data: apiProduct, isLoading: isProductLoading } = useProduct(id || '');
  const { data: allProducts = [], isLoading: isAllLoading } = useProducts();
  const product = apiProduct ?? stateProduct;
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'delivery'>('specs');
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if ((isProductLoading && !stateProduct) || isAllLoading) return <ProductSkeleton />;

  if (!product) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-32 text-center">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-5">
          <Package size={32} className="text-slate-300" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h1>
        <p className="text-slate-500 text-sm mb-8">
          This product may have been removed or the link is incorrect.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-brand-green text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-emerald-600 transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = (wishlist as any[]).some((item) => item.id === product.id);
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const inStock = product.status !== 'out_of_stock';
  const isLowStock = product.status === 'low_stock';
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const whatsappMsg = encodeURIComponent(
    `Hi Mobimax, I'm interested in the ${product.name} (KSh ${product.price.toLocaleString()}). Is it available?`
  );

  const specs = (product as any).specs as Record<string, string> | null;

  return (
    <div className="bg-white min-h-screen pb-20">

      {/* ── Breadcrumb ── */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <nav className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 flex-wrap">
            <Link to="/" className="hover:text-brand-green transition-colors">Home</Link>
            <ChevronRight size={11} />
            <Link to="/shop" className="hover:text-brand-green transition-colors">Shop</Link>
            <ChevronRight size={11} />
            <Link
              to={`/shop?category=${product.category}`}
              className="hover:text-brand-green transition-colors capitalize"
            >
              {product.category.replace(/-/g, ' ')}
            </Link>
            <ChevronRight size={11} />
            <span className="text-slate-600 font-semibold truncate max-w-[180px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ── Main product layout ── */}
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">

          {/* ── Gallery ── */}
          <div className="w-full lg:w-[48%]">
            <div className="lg:sticky lg:top-24">
              {/* Main image */}
              <div className="relative bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                <div className="aspect-square flex items-center justify-center p-10">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={product.image}
                      src={product.image}
                      alt={product.name}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </AnimatePresence>
                </div>

                {/* Badges overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isHotDeal && (
                    <span className="bg-rose-500 text-white text-[11px] font-bold px-3 py-1 rounded-lg">
                      HOT DEAL
                    </span>
                  )}
                  {discount >= 5 && (
                    <span className="bg-brand-green text-white text-[11px] font-bold px-3 py-1 rounded-lg">
                      -{discount}% OFF
                    </span>
                  )}
                </div>

                {/* Wishlist + Share */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={clsx(
                      'w-10 h-10 rounded-xl flex items-center justify-center transition-all border',
                      isWishlisted
                        ? 'bg-rose-50 border-rose-200 text-rose-500'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200'
                    )}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                    aria-label="Share"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Purchase panel ── */}
          <div className="flex-1">
            {/* Brand + category */}
            <div className="flex items-center gap-2 mb-3">
              <Link
                to={`/shop?brand=${product.brand.toLowerCase()}`}
                className="text-[12px] font-bold text-brand-green uppercase tracking-wide hover:underline"
              >
                {product.brand}
              </Link>
              <span className="text-slate-300">·</span>
              <Link
                to={`/shop?category=${product.category}`}
                className="text-[12px] text-slate-400 hover:text-brand-green transition-colors capitalize"
              >
                {product.category.replace(/-/g, ' ')}
              </Link>
            </div>

            {/* Product name */}
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-snug mb-4">
              {product.name}
            </h1>

            {/* Rating + stock */}
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
              <StarRating />
              <span className="w-px h-4 bg-slate-200" />
              <span
                className={clsx(
                  'flex items-center gap-1.5 text-[12px] font-semibold',
                  !inStock ? 'text-red-500' : isLowStock ? 'text-amber-500' : 'text-emerald-600'
                )}
              >
                <span
                  className={clsx(
                    'w-2 h-2 rounded-full',
                    !inStock ? 'bg-red-500' : isLowStock ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'
                  )}
                />
                {!inStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
              </span>
            </div>

            {/* Key Features bullet list */}
            {specs && Object.keys(specs).length > 0 && (
              <div className="mb-6">
                <h3 className="text-[13px] font-bold text-slate-800 mb-3">
                  {product.name} Key Features
                </h3>
                <ul className="space-y-1.5">
                  {Object.entries(specs).map(([key, val]) => (
                    <li key={key} className="flex gap-2 text-[13px] text-slate-700 leading-snug">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                      <span>
                        <span className="font-semibold text-slate-900">{key}:</span>{' '}
                        {val}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price block */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  KSh {product.price.toLocaleString()}
                </span>
                {product.oldPrice && product.oldPrice > 0 && (
                  <span className="text-base text-slate-400 line-through font-medium">
                    KSh {product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[12px] text-slate-500">Inclusive of VAT</span>
                {product.oldPrice && product.oldPrice > 0 && discount >= 5 && (
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-brand-green">
                    <Tag size={11} />
                    You save KSh {(product.oldPrice - product.price).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity + Actions */}
            {inStock && (
              <div className="space-y-3 mb-4">
                {/* Qty row */}
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-semibold text-slate-500 shrink-0">Qty:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors text-lg font-bold"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors text-lg font-bold"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Buy Now — primary CTA */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold bg-brand-green text-white hover:bg-emerald-600 shadow-lg shadow-brand-green/25 transition-all active:scale-[0.98]"
                >
                  <ShoppingCart size={16} />
                  BUY NOW
                </button>

                {/* Add to cart — secondary */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={clsx(
                    'w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold border-2 transition-all active:scale-[0.98]',
                    justAdded
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-700 hover:border-brand-green hover:text-brand-green'
                  )}
                >
                  {justAdded ? (
                    <><Check size={15} /> Added to Cart</>
                  ) : (
                    <><ShoppingCart size={15} /> Add to Cart</>
                  )}
                </button>
              </div>
            )}

            {/* Buy via WhatsApp */}
            <a
              href={`https://wa.me/254797674862?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1ebe5d] transition-colors mb-6"
            >
              <MessageCircle size={16} />
              Buy via WhatsApp
            </a>

            {!inStock && (
              <a
                href={`https://wa.me/254700000000?text=${encodeURIComponent(`Hi, I'd like to know when ${product.name} is back in stock.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors mb-6"
              >
                <MessageCircle size={16} />
                Notify Me When Available
              </a>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-slate-100">
              {[
                { icon: Truck, title: 'Fast Delivery', desc: 'Nairobi same day' },
                { icon: Shield, title: 'Warranty', desc: 'Manufacturer included' },
                { icon: RotateCcw, title: '7-Day Returns', desc: 'Easy exchange' },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center text-center gap-1.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-green/10 flex items-center justify-center">
                    <item.icon size={16} className="text-brand-green" />
                  </div>
                  <p className="text-[12px] font-bold text-slate-900 leading-tight">{item.title}</p>
                  <p className="text-[11px] text-slate-400 leading-tight hidden sm:block">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs section ── */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Tab nav */}
          <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
            {(['specs', 'description', 'delivery'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  'shrink-0 px-6 py-4 text-[13px] font-semibold capitalize transition-all border-b-2 -mb-px',
                  activeTab === tab
                    ? 'text-brand-green border-brand-green'
                    : 'text-slate-500 border-transparent hover:text-slate-900'
                )}
              >
                {tab === 'specs' ? 'Specifications' : tab === 'delivery' ? 'Delivery & Returns' : 'Description'}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="py-10 max-w-4xl">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-2 gap-x-8 md:gap-x-12">
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">SKU</span>
                  <span className="text-sm font-semibold text-slate-900">{product.sku}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">Brand</span>
                  <span className="text-sm font-semibold text-slate-900">{product.brand}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">Category</span>
                  <span className="text-sm font-semibold text-slate-900 capitalize">
                    {product.category.replace(/-/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">Status</span>
                  <span
                    className={clsx(
                      'text-sm font-semibold',
                      !inStock ? 'text-red-500' : isLowStock ? 'text-amber-500' : 'text-emerald-600'
                    )}
                  >
                    {!inStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>
                {specs &&
                  Object.entries(specs).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-slate-200">
                      <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">{val}</span>
                    </div>
                  ))}
              </div>
            )}

            {activeTab === 'description' && (
              <div className="max-w-2xl">
                <p className="text-slate-700 text-sm leading-relaxed mb-4">{product.description}</p>
                <p className="text-slate-500 text-sm leading-relaxed">
                  All products at Mobimax are 100% genuine and come with manufacturer warranty. We
                  source directly from authorized distributors to ensure quality and authenticity.
                </p>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-5">
                {[
                  {
                    icon: Truck,
                    title: 'Delivery Options',
                    items: [
                      'Nairobi CBD: Same-day pickup available',
                      'Nairobi delivery: 2–4 hours',
                      'Countrywide: Next business day',
                      'Free delivery on orders over KSh 10,000',
                    ],
                    color: 'bg-brand-green/10',
                    iconColor: 'text-brand-green',
                  },
                  {
                    icon: RotateCcw,
                    title: 'Returns & Warranty',
                    items: [
                      '7-day return policy for sealed items',
                      'Exchange for damaged or defective items',
                      'Manufacturer warranty included',
                      'Contact support within 24h of delivery',
                    ],
                    color: 'bg-blue-50',
                    iconColor: 'text-blue-600',
                  },
                ].map((block) => (
                  <div
                    key={block.title}
                    className="bg-white border border-slate-200 rounded-2xl p-6"
                  >
                    <div className={`w-10 h-10 rounded-xl ${block.color} flex items-center justify-center mb-4`}>
                      <block.icon size={18} className={block.iconColor} />
                    </div>
                    <h4 className="text-[14px] font-bold text-slate-900 mb-3">{block.title}</h4>
                    <ul className="space-y-2">
                      {block.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[13px] text-slate-600">
                          <Check size={13} className="text-brand-green mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Related products ── */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-white border-t border-slate-100">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Related Products
              </h2>
              <Link
                to={`/shop?category=${product.category}`}
                className="flex items-center gap-1 text-[12px] font-semibold text-brand-green hover:text-emerald-700 transition-colors"
              >
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
