import { Link } from 'react-router-dom';
import { X, BarChart3, ShoppingCart, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import clsx from 'clsx';

export default function Compare() {
  const { compare, toggleCompare, clearCompare, addToCart } = useStore();

  if (compare.length === 0) {
    return (
      <div className="container mx-auto px-4 max-w-5xl py-28 text-center">
        <title>Compare Products – MobiPlus</title>
        <meta name="description" content="Compare electronics side by side at MobiPlus Kenya. Up to 4 products." />

        <div className="bg-white rounded-[40px] p-12 md:p-16 shadow-premium border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-8 rounded-[28px] bg-brand-green/10 text-brand-green flex items-center justify-center">
            <BarChart3 size={36} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
            Nothing to Compare
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-10 max-w-md mx-auto">
            Add up to 4 products using the compare toggle on any product card, then return here to view them side by side.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-gray-900 text-white px-10 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-brand-green transition-all"
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Collect all unique spec labels across compared products for the table rows
  const allSpecs = Array.from(
    new Set(compare.flatMap((p) => p.specs ?? []).map((s) => s.split(':')[0]?.trim() ?? s))
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <title>Compare Products – MobiPlus</title>
      <meta name="description" content="Compare electronics side by side at MobiPlus Kenya. Up to 4 products." />

      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-0.5 bg-brand-green"></div>
              <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em]">Side by Side</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Compare
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
              {compare.length} of 4 products
            </span>
            <button
              type="button"
              onClick={clearCompare}
              className="inline-flex items-center gap-2 bg-white border border-gray-100 text-gray-900 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-gray-200 transition-all"
            >
              <X size={14} /> Clear All
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-12 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              {/* Row label column */}
              <th className="w-40 shrink-0" aria-label="Attribute" />

              {compare.map((product) => (
                <th key={product.id} className="px-4 pb-6 align-top text-left">
                  <div className="bg-white rounded-[28px] border border-gray-100 shadow-premium p-6 flex flex-col gap-4">
                    {/* Remove button */}
                    <button
                      type="button"
                      aria-label={`Remove ${product.name} from comparison`}
                      onClick={() => toggleCompare(product)}
                      className="self-end w-8 h-8 rounded-full bg-gray-50 border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 flex items-center justify-center transition-all"
                    >
                      <X size={14} />
                    </button>

                    {/* Product image */}
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-4 overflow-hidden">
                        <img
                          src={product.image}
                          alt={`${product.brand} ${product.name}`}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>
                    </Link>

                    {/* Product name + brand */}
                    <div>
                      <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em] mb-1">
                        {product.brand}
                      </p>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-base font-black text-gray-900 uppercase tracking-tighter leading-tight hover:text-brand-green transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                    </div>

                    {/* Price */}
                    <div>
                      <p className="text-2xl font-black text-brand tracking-tighter">
                        KSh {product.price.toLocaleString()}
                      </p>
                      {product.oldPrice && (
                        <p className="text-sm text-gray-400 font-medium line-through">
                          KSh {product.oldPrice.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Add to cart */}
                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="flex items-center justify-center gap-2 w-full rounded-2xl bg-gray-900 text-white py-3 text-[10px] font-black uppercase tracking-widest hover:bg-brand-green transition-all"
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                  </div>
                </th>
              ))}

              {/* Empty slot placeholder(s) when < 4 products */}
              {compare.length < 4 && (
                <th className="px-4 pb-6 align-top">
                  <Link
                    to="/shop"
                    className="flex flex-col items-center justify-center gap-3 bg-white rounded-[28px] border-2 border-dashed border-gray-200 p-6 h-full min-h-[320px] text-gray-300 hover:border-brand-green hover:text-brand-green transition-all"
                  >
                    <span className="text-4xl font-black">+</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Add Product</span>
                  </Link>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {/* Rating row */}
            <tr className="border-t border-gray-100">
              <td className="py-5 pr-6 text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Rating
              </td>
              {compare.map((product) => (
                <td key={product.id} className="px-4 py-5">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          fill={i < Math.floor(product.rating ?? 5) ? 'currentColor' : 'none'}
                          stroke="none"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-black text-gray-900">{product.rating ?? '—'}</span>
                  </div>
                </td>
              ))}
              {compare.length < 4 && <td />}
            </tr>

            {/* Condition row */}
            <tr className="border-t border-gray-100 bg-gray-50/50">
              <td className="py-5 pr-6 text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Condition
              </td>
              {compare.map((product) => (
                <td key={product.id} className="px-4 py-5">
                  <span
                    className={clsx(
                      'inline-block rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-wide',
                      product.condition === 'Ex-UK Used'
                        ? 'bg-slate-900 text-white'
                        : 'bg-brand-green/10 text-brand-green'
                    )}
                  >
                    {product.condition ?? 'New'}
                  </span>
                </td>
              ))}
              {compare.length < 4 && <td />}
            </tr>

            {/* Category row */}
            <tr className="border-t border-gray-100">
              <td className="py-5 pr-6 text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">
                Category
              </td>
              {compare.map((product) => (
                <td key={product.id} className="px-4 py-5 text-sm font-bold text-gray-700 capitalize">
                  {product.category ?? '—'}
                </td>
              ))}
              {compare.length < 4 && <td />}
            </tr>

            {/* Dynamic spec rows */}
            {allSpecs.map((specLabel, rowIdx) => (
              <tr
                key={specLabel}
                className={clsx('border-t border-gray-100', rowIdx % 2 === 0 ? 'bg-gray-50/50' : '')}
              >
                <td className="py-5 pr-6 text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  {specLabel}
                </td>
                {compare.map((product) => {
                  // Find a spec entry that starts with this label
                  const specEntry = (product.specs ?? []).find(
                    (s) => s.split(':')[0]?.trim() === specLabel
                  );
                  const specValue = specEntry
                    ? (specEntry.includes(':') ? specEntry.split(':').slice(1).join(':').trim() : specEntry)
                    : null;
                  return (
                    <td key={product.id} className="px-4 py-5 text-sm font-bold text-gray-900">
                      {specValue ?? <span className="text-gray-300">—</span>}
                    </td>
                  );
                })}
                {compare.length < 4 && <td />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
