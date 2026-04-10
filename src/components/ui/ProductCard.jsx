import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Heart, Star } from 'lucide-react';
import clsx from 'clsx';
import { useStore } from '../../store/useStore';

export default function ProductCard({ product }) {
  const { addToCart } = useStore();

  const discountAmount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <div className="group bg-white rounded-3xl border border-gray-100/50 shadow-premium hover-shadow-premium hover-lift transition-all duration-500 overflow-hidden relative">
      
      {/* Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-brand-green text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-sm">
            New Arrival
          </span>
        )}
        {product.flags?.isHotDeal && (
          <span className="bg-amber-400 text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-sm flex items-center gap-1">
            <span className="animate-pulse">🔥</span> Hot Deal
          </span>
        )}
        {discountAmount > 0 && (
          <span className="bg-brand text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-sm">
            -{discountAmount}%
          </span>
        )}
        {product.condition === 'Ex-UK Used' && (
          <span className="bg-slate-800 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-sm">
            Ex-UK Used
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand hover:scale-110 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
        <Heart size={18} />
      </button>

      {/* Image Section */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-white p-6">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button 
            className="w-12 h-12 rounded-2xl bg-white text-gray-900 shadow-xl flex items-center justify-center hover:bg-brand hover:text-white transition-all transform translate-y-8 group-hover:translate-y-0 duration-300 delay-75"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
          >
            <ShoppingCart size={20} />
          </button>
          <button className="w-12 h-12 rounded-2xl bg-white text-gray-900 shadow-xl flex items-center justify-center hover:bg-black hover:text-white transition-all transform translate-y-8 group-hover:translate-y-0 duration-300 delay-150">
            <Eye size={20} />
          </button>
        </div>
      </Link>

      {/* Info Section */}
      <div className="p-6 pt-0">
        <div className="mb-2">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.brand}</span>
           <Link to={`/product/${product.id}`} className="block mt-1">
             <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-brand transition-colors">
               {product.name}
             </h3>
           </Link>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"} />
            ))}
          </div>
          <span className="text-[10px] font-medium text-gray-400">({product.reviews || 0})</span>
        </div>

        {/* Pricing */}
        <div className="flex items-end justify-between py-2 border-t border-gray-50 mt-auto">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through font-medium">KSh {product.oldPrice.toLocaleString()}</span>
            )}
            <span className="text-lg font-black text-gray-900 leading-none">
              KSh {product.price.toLocaleString()}
            </span>
          </div>
          
          <span className={clsx(
            "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-tighter",
            product.inStock || product.status === 'In Stock' ? "text-brand-green bg-brand-green/10" : "text-gray-400 bg-gray-100"
          )}>
            {product.inStock || product.status === 'In Stock' ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>

    </div>
  );
}
