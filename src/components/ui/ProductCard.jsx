import { Link } from 'react-router-dom';
import { Heart, BarChart3 } from 'lucide-react';
import clsx from 'clsx';
import { useStore } from '../../store/useStore';
import { getProductAvailability, PRODUCT_IMAGE_FALLBACK } from '../../lib/catalog';

export default function ProductCard({ product }) {
  const { toggleWishlist, wishlist, toggleCompare, compare } = useStore();
  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const isCompared = compare.some((item) => item.id === product.id);
  const availability = getProductAvailability(product);

  const discountAmount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const badges = [];

  if (product.oldPrice || product.flags?.isOffer || product.flags?.isHotDeal) {
    badges.push({
      label: 'Offer',
      tone: 'bg-brand text-white',
    });
  }

  if (product.flags?.isHotDeal) {
    badges.push({
      label: 'Hot',
      tone: 'bg-blue-600 text-white',
    });
  } else if (product.isNew) {
    badges.push({
      label: 'New',
      tone: 'bg-brand-green text-white',
    });
  }

  if (product.condition === 'Ex-UK Used') {
    badges.push({
      label: 'Ex-UK Used',
      tone: 'bg-slate-900 text-white',
    });
  }

  if (product.status === 'out_of_stock') {
    badges.push({
      label: 'Out of Stock',
      tone: 'bg-red-500 text-white',
    });
  }

  return (
    <article className="group flex h-full flex-col rounded-[28px] border border-brand-green/70 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_-25px_rgba(15,23,42,0.45)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {badges.slice(0, 2).map((badge) => (
            <span
              key={badge.label}
              className={clsx(
                'rounded-lg px-3 py-1 text-[11px] font-black uppercase tracking-wide',
                badge.tone
              )}
            >
              {badge.label}
            </span>
          ))}
          {discountAmount > 0 && !product.flags?.isHotDeal && (
            <span className="rounded-lg bg-red-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-brand">
              -{discountAmount}%
            </span>
          )}
        </div>

        {/* Action buttons: Wishlist + Compare */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            className={clsx(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all',
              isWishlisted
                ? 'border-brand bg-brand text-white shadow-lg shadow-brand/15'
                : 'border-gray-200 bg-white text-gray-500 hover:border-brand-green hover:text-brand'
            )}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          <button
            type="button"
            aria-label={isCompared ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`}
            onClick={(e) => { e.preventDefault(); toggleCompare(product); }}
            title={compare.length >= 4 && !isCompared ? 'Comparison full (max 4)' : undefined}
            disabled={compare.length >= 4 && !isCompared}
            className={clsx(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all',
              isCompared
                ? 'border-brand-green bg-brand-green text-white shadow-lg shadow-brand-green/20'
                : 'border-gray-200 bg-white text-gray-500 hover:border-brand-green hover:text-brand-green disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            <BarChart3 size={16} />
          </button>
        </div>
      </div>

      <Link
        to={`/product/${product.id}`}
        className="mb-5 flex min-h-[260px] items-center justify-center rounded-[22px] border border-gray-100 bg-white px-4 py-6 sm:min-h-[280px]"
      >
        <img
          src={product.image || PRODUCT_IMAGE_FALLBACK}
          alt={`${product.brand} ${product.name}`}
          onError={(event) => {
            event.currentTarget.src = PRODUCT_IMAGE_FALLBACK;
          }}
          className="max-h-[230px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.03] sm:max-h-[250px]"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-xl font-black leading-tight text-gray-900 transition-colors group-hover:text-brand">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 text-base font-medium text-gray-500">{product.brand}</p>

        <div className="mt-3 flex items-center gap-2">
          <span className={clsx('h-2 w-2 rounded-full', availability.dot)}></span>
          <span className={clsx('text-[11px] font-black uppercase tracking-[0.2em]', availability.tone)}>
            {availability.label}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-2">
          <span className="text-2xl font-black leading-none text-brand">
            KSh {product.price.toLocaleString()}
          </span>
          {product.oldPrice && (
            <span className="text-lg font-medium text-gray-400 line-through">
              KSh {product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="mt-6 pt-2">
          <Link
            to={`/product/${product.id}`}
            className="inline-flex w-full items-center justify-center rounded-2xl border border-brand-green bg-white px-5 py-4 text-sm font-black uppercase tracking-wide text-gray-900 transition-all hover:bg-brand-green hover:text-white"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </article>
  );
}
