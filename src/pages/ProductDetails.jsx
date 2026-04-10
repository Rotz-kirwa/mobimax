import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Activity, Check, Shield, Truck, Package, Star, Share2, ChevronRight, Info, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { products } from '../data/mockData';
import clsx from 'clsx';
import ProductCard from '../components/ui/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductDetails() {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addToCart, toggleWishlist, wishlist } = useStore();
  
  const [activeTab, setActiveTab] = useState('specs');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="container mx-auto px-4 max-w-7xl py-40 text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Item Not Found</h1>
        <p className="text-gray-500 mb-8 font-bold uppercase tracking-widest">The product has been removed or the link is broken.</p>
        <Link to="/shop" className="bg-brand-green text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all">Back to Store</Link>
      </div>
    );
  }

  const isWishlisted = wishlist.some(item => item.id === product.id);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discountAmount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  // Mock gallery images since we use single images in mockData
  const gallery = [product.image, ...Array(3).fill(product.image)];

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Premium Breadcrumb Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-6">
        <div className="container mx-auto px-4 max-w-7xl">
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link to="/" className="hover:text-brand-green transition-colors">Home</Link>
            <ChevronRight size={12} strokeWidth={3} />
            <Link to="/shop" className="hover:text-brand-green transition-colors">Shop</Link>
            <ChevronRight size={12} strokeWidth={3} />
            <Link to={`/shop?category=${product.category}`} className="hover:text-brand-green transition-colors">{product.category}</Link>
            <ChevronRight size={12} strokeWidth={3} />
            <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-12 md:mt-20">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Gallery Sticky Section */}
          <div className="w-full lg:w-[55%] flex flex-col gap-6">
            <div className="sticky top-28 space-y-6">
              <div className="relative aspect-square bg-white rounded-[40px] border border-gray-100 shadow-premium overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedImage}
                    src={gallery[selectedImage]} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    alt={product.name} 
                    className="w-full h-full object-contain p-12 mix-blend-multiply"
                  />
                </AnimatePresence>
                
                {/* Product Badges */}
                <div className="absolute top-8 left-8 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-brand-green text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-brand-green/20">New Arrival</span>
                  )}
                   {product.flags?.isHotDeal && (
                    <span className="bg-amber-400 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-amber-400/20 flex items-center gap-2">🔥 Hot Deal</span>
                  )}
                </div>

                <div className="absolute top-8 right-8">
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className={clsx(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border",
                      isWishlisted ? "bg-brand border-brand text-white shadow-xl" : "bg-white border-gray-100 text-gray-400 hover:text-brand"
                    )}
                  >
                    <Heart size={22} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {gallery.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={clsx(
                      "aspect-square rounded-2xl border-2 transition-all p-2 bg-white",
                      selectedImage === idx ? "border-brand-green shadow-lg" : "border-gray-100 opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} className="w-full h-full object-contain" alt={`thumb-${idx}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Configuration & Purchase Section */}
          <div className="w-full lg:w-[45%]">
            <div className="mb-10">
               <span className="text-[11px] font-black text-brand-green uppercase tracking-[0.4em] mb-4 block">{product.brand}</span>
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-none mb-6 tracking-tighter uppercase">
                 {product.name}
               </h1>
               
               <div className="flex items-center gap-6 pb-8 border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"} stroke="none" />
                      ))}
                    </div>
                    <span className="text-xs font-black text-gray-900 ml-1">{product.rating || 5.0}</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                  <button className="text-[11px] font-black uppercase text-gray-400 hover:text-brand-green transition-colors tracking-widest">{product.reviews || 0} Reviews</button>
                  <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                  <div className={clsx(
                    "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                    product.inStock || product.status === 'In Stock' ? "text-brand-green" : "text-gray-400"
                  )}>
                    <div className={clsx("w-2 h-2 rounded-full", product.inStock || product.status === 'In Stock' ? "bg-brand-green animate-pulse" : "bg-gray-300")}></div>
                    {product.inStock || product.status === 'In Stock' ? "Ready to Ship" : "Confirm Stock"}
                  </div>
               </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-gray-50 rounded-[32px] p-8 mb-10 border border-gray-100">
               <div className="flex items-end gap-4 mb-2">
                 <span className="text-4xl font-black text-gray-900 tracking-tighter uppercase">KSh {product.price.toLocaleString()}</span>
                 {product.oldPrice && (
                   <span className="text-lg text-gray-400 font-bold line-through mb-1">KSh {product.oldPrice.toLocaleString()}</span>
                 )}
               </div>
               <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                 <span>VAT Included</span>
                 <span className="text-brand">You save KSh {(product.oldPrice - product.price).toLocaleString()}</span>
               </div>
            </div>

            {/* Quick Specs Overview */}
            <div className="grid grid-cols-2 gap-4 mb-10">
               {product.specs.slice(0, 4).map((spec, idx) => (
                 <div key={idx} className="flex flex-col gap-1 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Technical Spec</span>
                    <span className="text-[13px] font-black text-gray-900 truncate uppercase tracking-tight">{spec}</span>
                 </div>
               ))}
            </div>

            {/* Selection & Actions */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center bg-gray-50 rounded-2xl p-2 border border-gray-100 w-full md:w-40">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl hover:bg-white transition-colors flex items-center justify-center font-black text-gray-900"
                  >-</button>
                  <input 
                    type="number" 
                    value={quantity} 
                    readOnly 
                    className="flex-1 bg-transparent text-center font-black text-gray-900 focus:outline-none" 
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl hover:bg-white transition-colors flex items-center justify-center font-black text-gray-900"
                  >+</button>
                </div>
                
                <button 
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 bg-gray-900 text-white rounded-[22px] px-8 py-5 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-brand-green hover:shadow-xl shadow-gray-200 transition-all active:scale-[0.98]"
                >
                  <ShoppingCart size={18} /> Add to Selection
                </button>
              </div>

              {/* Trust Information */}
              <div className="grid grid-cols-2 gap-4 pt-10 mt-10 border-t border-gray-100">
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                       <Truck size={20} />
                    </div>
                    <div>
                       <span className="text-[11px] font-black text-gray-900 uppercase block tracking-tight">Express Delivery</span>
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">24-48 Hours Hub to Door</span>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                       <Shield size={20} />
                    </div>
                    <div>
                       <span className="text-[11px] font-black text-gray-900 uppercase block tracking-tight">Genuine Protection</span>
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Official 12 Month Warranty</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Full Specs */}
      <section className="mt-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
           <div className="flex justify-center border-b border-gray-200 overflow-x-auto scrollbar-hide">
              {['specs', 'description', 'delivery', 'guarantee'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    "px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] transition-all border-b-2 relative",
                    activeTab === tab ? "text-gray-900 border-gray-900" : "text-gray-400 border-transparent hover:text-gray-600"
                  )}
                >
                  {tab}
                </button>
              ))}
           </div>
           
           <div className="py-20 max-w-4xl mx-auto">
              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   {product.specs.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-200">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Specification {idx+1}</span>
                         <span className="text-[13px] font-black text-gray-900 uppercase tracking-tight">{s}</span>
                      </div>
                   ))}
                </div>
              )}
              {activeTab === 'description' && (
                <div className="prose prose-sm max-w-none text-gray-500 font-medium leading-relaxed">
                   <p className="text-lg text-gray-900 font-black mb-6 uppercase tracking-tight">Product Mastery & Craftsmanship</p>
                   <p className="mb-4">The {product.name} represents the absolute pinnacle of {product.brand}'s technological heritage. Every component, from the refined {product.subcategory} architecture to the optimized power management, has been meticulously engineered for the uncompromising user.</p>
                   <p>Experience the future of mobility and computing with Mobimax's signature service. All devices are verified through our 32-point inspection before dispatch to ensure the premium experience you deserve.</p>
                </div>
              )}
              {activeTab === 'delivery' && (
                 <div className="bg-white rounded-[32px] p-10 shadow-premium border border-gray-100 flex flex-col md:flex-row gap-12">
                    <div className="flex-1 space-y-6">
                       <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Delivery Excellence</h4>
                       <p className="text-gray-500 font-medium text-sm">We've partnered with Kenya's leading logistics providers (G4S, Wells Fargo) to ensure your premium tech arrives safely and on time.</p>
                       <ul className="space-y-4">
                          <li className="flex items-center gap-3 text-sm font-bold text-gray-900">
                             <Check size={18} className="text-brand-green" /> Nairobi: Same Day Delivery
                          </li>
                          <li className="flex items-center gap-3 text-sm font-bold text-gray-900">
                             <Check size={18} className="text-brand-green" /> Upcountry: Next Day Delivery
                          </li>
                       </ul>
                    </div>
                    <div className="w-full md:w-px bg-gray-100"></div>
                    <div className="flex-1">
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                           <Info size={24} className="text-gray-400 mb-4" />
                           <p className="text-xs text-gray-400 font-bold leading-relaxed uppercase tracking-widest">All shipments are fully insured against loss or damage during transit for your peace of mind.</p>
                        </div>
                    </div>
                 </div>
              )}
           </div>
        </div>
      </section>

      {/* Suggested Curations */}
      {relatedProducts.length > 0 && (
        <section className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-16 px-4">
               <div>
                 <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.4em] mb-4 block">Store Recommendations</span>
                 <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">You Might Also Adore</h2>
               </div>
               <Link to="/shop" className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center text-gray-900 hover:bg-brand-green hover:text-white transition-all shadow-sm">
                  <ArrowRight size={24} />
               </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
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
