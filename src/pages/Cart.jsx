import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck, ShieldAlert } from 'lucide-react';
import { useStore } from '../store/useStore';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useStore();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 100000 ? 0 : 500;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 max-w-4xl py-32 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[40px] p-20 shadow-premium border border-gray-100 flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-gray-50 rounded-[28px] flex items-center justify-center text-gray-300 mb-8 border border-gray-100">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">Your Gallery is Empty</h2>
          <p className="text-gray-400 font-bold text-sm uppercase tracking-[0.2em] mb-12 max-w-md leading-relaxed">
            Every collection starts with a single piece. Explore our premium selections to begin.
          </p>
          <Link to="/shop" className="bg-brand-green text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-gray-900 transition-all shadow-xl shadow-brand-green/20">
            Start Selection
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
           <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-0.5 bg-brand-green"></div>
                    <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em]">Purchase Review</span>
                 </div>
                 <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                    Shopping Cart
                 </h1>
              </div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                 Storage Vault: {cart.length} Premium Items
              </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cart Items List */}
          <div className="flex-1 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div 
                  layout
                  key={item.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 rounded-[36px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 relative group hover:shadow-premium transition-all duration-500"
                >
                  {/* Image Container */}
                  <Link to={`/product/${item.id}`} className="w-full md:w-36 h-36 rounded-[28px] bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 p-4 overflow-hidden relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                  </Link>
    
                  {/* Detailed Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <div className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em] mb-1">{item.brand}</div>
                        <Link to={`/product/${item.id}`} className="text-xl font-black text-gray-900 leading-tight hover:text-brand-green transition-colors line-clamp-2 uppercase tracking-tighter">
                          {item.name}
                        </Link>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="w-10 h-10 border border-gray-100 text-gray-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all flex items-center justify-center"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
    
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-gray-50">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price per unit</span>
                         <span className="text-2xl font-black text-gray-900 tracking-tighter">
                           KSh {item.price.toLocaleString()}
                         </span>
                      </div>
                      
                      <div className="flex items-center gap-6">
                         <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Quantity</span>
                            <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                               <button 
                                 className="w-8 h-8 rounded-lg hover:bg-white transition-colors flex items-center justify-center font-black text-gray-900"
                                 onClick={() => updateQuantity(item.id, item.quantity - 1)}
                               >-</button>
                               <input 
                                 type="number" 
                                 value={item.quantity} 
                                 readOnly 
                                 className="w-10 bg-transparent text-center font-black text-sm text-gray-900 focus:outline-none" 
                               />
                               <button 
                                 className="w-8 h-8 rounded-lg hover:bg-white transition-colors flex items-center justify-center font-black text-gray-900"
                                 onClick={() => updateQuantity(item.id, item.quantity + 1)}
                               >+</button>
                            </div>
                         </div>
                         <div className="flex flex-col items-end min-w-[120px]">
                            <span className="text-[10px] font-black text-brand-green uppercase tracking-widest mb-1">Total Line</span>
                            <span className="text-xl font-black text-gray-900 tracking-tighter">
                              KSh {(item.price * item.quantity).toLocaleString()}
                            </span>
                         </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
    
          {/* Premium Summary Sticky */}
          <div className="w-full lg:w-[420px]">
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-premium sticky top-28">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-10 border-b border-gray-50 pb-6">Summary</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Inventory Subtotal</span>
                  <span className="text-lg font-black text-gray-900">KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Global Logistics</span>
                     <div className="group relative">
                        <Info size={12} className="text-gray-300 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-gray-900 text-white text-[10px] font-bold rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all uppercase tracking-tight">Free for orders above KSh 100,000</div>
                     </div>
                  </div>
                  <span className={clsx("text-lg font-black", deliveryFee === 0 ? "text-brand-green" : "text-gray-900")}>
                     {deliveryFee === 0 ? 'FREE' : `KSh ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
              </div>
    
              <div className="bg-gray-50 rounded-3xl p-8 mb-10">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-[.25em]">Grand Total</span>
                  <span className="text-4xl font-black text-gray-900 tracking-tighter">KSh {total.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-right italic">Official Mobimax Valuation</p>
              </div>
    
              <div className="space-y-4">
                <Link 
                  to="/checkout"
                  className="w-full bg-gray-900 text-white flex items-center justify-center gap-4 py-6 rounded-[22px] font-black uppercase tracking-[0.2em] text-xs hover:bg-brand-green hover:shadow-xl shadow-gray-200 transition-all group active:scale-[0.98]"
                >
                  Finalize Transaction <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/shop"
                  className="w-full bg-white text-gray-400 border border-gray-100 flex items-center justify-center py-5 rounded-[22px] font-black uppercase tracking-[0.2em] text-[10px] hover:text-gray-900 transition-all"
                >
                  Continue Selection
                </Link>
              </div>
    
              {/* Trust Section */}
              <div className="mt-10 pt-10 border-t border-gray-50 grid grid-cols-2 gap-6">
                 <div className="flex flex-col gap-2">
                    <ShieldCheck size={20} className="text-brand-green" />
                    <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest leading-tight">Secured Payment</span>
                 </div>
                 <div className="flex flex-col gap-2">
                    <Truck size={20} className="text-brand-green" />
                    <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest leading-tight">Express Chain</span>
                 </div>
              </div>
            </div>
          </div>
    
        </div>
      </div>
    </div>
  );
}

function Info({ size, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
    </svg>
  );
}
