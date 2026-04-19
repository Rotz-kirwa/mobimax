import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import clsx from 'clsx';
import { useStore } from '../../store/useStore';
import { Product } from '@mobiplus/shared';

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&fm=webp&fit=crop';

/** Request a small WebP from Unsplash/imgix CDN; leave other URLs untouched. */
function toWebP(url: string): string {
  if (!url) return FALLBACK_IMAGE;
  if (url.includes('unsplash.com')) {
    const u = new URL(url);
    u.searchParams.set('fm', 'webp');
    u.searchParams.set('w', '400');   // cards are never wider than ~320 px
    u.searchParams.set('q', '72');
    u.searchParams.set('fit', 'crop');
    u.searchParams.delete('auto');
    return u.toString();
  }
  return url;
}

export default function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const { toggleWishlist, wishlist } = useStore();
  const navigate = useNavigate();
  const isWishlisted = (wishlist as any[]).some((item) => item.id === product.id);
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const inStock = product.status !== 'out_of_stock';
  const isLowStock = product.status === 'low_stock';

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <article
      className={clsx(
        'group bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-slate-300',
        className
      )}
    >
      {/* ── Image area ── */}
      <div className="relative bg-slate-50/50 overflow-hidden">
        <Link to={`/product/${product.id}`} className="block">
          <div className="h-60 flex items-center justify-center p-2">
            <img
              src={toWebP(product.image || FALLBACK_IMAGE)}
              alt={product.name}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              decoding="async"
              width={320}
              height={320}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </Link>

        {/* Badges — top left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.isHotDeal && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded leading-5">
              HOT
            </span>
          )}
          {discount >= 5 && (
            <span className="bg-brand-green text-white text-[10px] font-bold px-2 py-0.5 rounded leading-5">
              -{discount}%
            </span>
          )}
          {!inStock && (
            <span className="bg-slate-600 text-white text-[10px] font-bold px-2 py-0.5 rounded leading-5">
              OUT OF STOCK
            </span>
          )}
          {isLowStock && inStock && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded leading-5">
              LOW STOCK
            </span>
          )}
        </div>

        {/* Wishlist — top right */}
        <button
          type="button"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={handleWishlist}
          className={clsx(
            'absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm',
            isWishlisted
              ? 'bg-rose-50 text-rose-500'
              : 'bg-white/90 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-500'
          )}
        >
          <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={2} />
        </button>

        {/* Quick view overlay — bottom */}
        <Link
          to={`/product/${product.id}`}
          className="absolute inset-x-0 bottom-0 bg-slate-900/80 text-white py-2 text-[11px] font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5"
        >
          <Eye size={12} /> Quick View
        </Link>
      </div>

      {/* ── Content area ── */}
      <div className="p-3.5 flex flex-col flex-1 gap-2">
        {/* Brand */}
        <p className="text-[11px] font-semibold text-brand-green uppercase tracking-wide leading-none">
          {product.brand}
        </p>

        {/* Name */}
        <Link to={`/product/${product.id}`} className="flex-1">
          <h3 className="text-[13px] font-semibold text-slate-800 leading-snug line-clamp-2 hover:text-brand-green transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-slate-900 tracking-tight">
            KSh {product.price.toLocaleString()}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-slate-400 line-through">
              KSh {product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!inStock}
          className={clsx(
            'mt-1 w-full py-2 px-3 rounded-lg text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.98]',
            !inStock
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-brand-green text-white hover:bg-emerald-600'
          )}
        >
          <ShoppingCart size={13} strokeWidth={2} />
          {inStock ? 'Buy Now' : 'Out of Stock'}
        </button>
      </div>
    </article>
  );
}
