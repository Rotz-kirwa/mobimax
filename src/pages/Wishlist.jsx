import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ui/ProductCard';

export default function Wishlist() {
  const { wishlist, clearWishlist, toggleWishlist, addToCart } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 max-w-5xl py-28 text-center">
        <title>My Wishlist – MobiPlus</title>
        <meta name="description" content="Your saved MobiPlus items. Add to cart and check out with M-Pesa anytime." />
        <div className="bg-white rounded-[40px] p-12 md:p-16 shadow-premium border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-8 rounded-[28px] bg-brand/10 text-brand flex items-center justify-center">
            <Heart size={36} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">Wishlist Is Empty</h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-10">
            Save products here so you can compare them later and return faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop" className="w-full sm:w-auto bg-gray-900 text-white px-10 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-brand-green transition-all">
              Browse Catalog
            </Link>
            <Link to="/deals" className="w-full sm:w-auto bg-white text-gray-900 border border-gray-100 px-10 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:border-gray-200 transition-all">
              View Hot Deals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <title>My Wishlist ({wishlist.length} saved) – MobiPlus</title>
      <meta name="description" content="Your saved MobiPlus items. Add to cart and check out with M-Pesa anytime." />
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-0.5 bg-brand"></div>
              <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em]">Saved For Later</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              My Wishlist
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
              {wishlist.length} saved items
            </span>
            <button
              type="button"
              onClick={clearWishlist}
              className="inline-flex items-center gap-2 bg-white border border-gray-100 text-gray-900 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-gray-200 transition-all"
            >
              <Trash2 size={14} />
              Clear Wishlist
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {wishlist.map((product) => (
            <div key={product.id} className="space-y-4">
              <ProductCard product={product} />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-green transition-all"
                >
                  <ShoppingCart size={16} />
                  Add To Cart
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className="inline-flex items-center justify-center gap-2 bg-white border border-gray-100 text-gray-900 px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-gray-200 transition-all"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
