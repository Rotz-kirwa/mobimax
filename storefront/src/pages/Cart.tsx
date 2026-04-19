import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingCart, ShieldCheck, Truck, Package } from 'lucide-react';
import { useStore } from '../store/useStore';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useStore();

  const subtotal = (cart as any[]).reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 150000 ? 0 : 250;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 max-w-2xl py-32 text-center font-sans">
        <div className="bg-white rounded-3xl p-16 shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-8">
            <Package size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Your cart is empty</h2>
          <p className="text-slate-500 text-sm mb-8">Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="bg-brand-green text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-6">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <ShoppingCart size={24} className="text-brand-green" />
              Shopping Cart
              <span className="text-base font-normal text-slate-400">({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
            </h1>
            <Link to="/shop" className="text-sm text-brand-green font-semibold hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            <AnimatePresence mode="popLayout">
              {(cart as any[]).map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  className="bg-white rounded-2xl border border-slate-100 p-5 flex gap-5 items-center"
                >
                  <Link to={`/product/${item.id}`} className="w-24 h-24 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 p-2">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-brand-green uppercase tracking-wide mb-0.5">{item.brand}</p>
                    <Link to={`/product/${item.id}`} className="text-sm font-semibold text-slate-800 hover:text-brand-green transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="text-base font-bold text-slate-900 mt-1">KSh {item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >−</button>
                      <span className="w-8 text-center text-sm font-semibold text-slate-800">{item.quantity}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >+</button>
                    </div>
                    <p className="text-sm font-bold text-slate-900">KSh {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[360px]">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
              <h2 className="text-base font-bold text-slate-900 mb-5 pb-4 border-b border-slate-100">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Delivery (Nairobi)</span>
                  <span className={clsx('font-semibold', deliveryFee === 0 ? 'text-brand-green' : 'text-slate-900')}>
                    {deliveryFee === 0 ? 'FREE' : `KSh ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                {deliveryFee === 0 && (
                  <p className="text-[11px] text-brand-green font-medium">Free delivery on orders above KSh 150,000</p>
                )}
              </div>

              <div className="flex justify-between items-center py-4 border-t border-slate-100 mb-5">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-xl font-bold text-slate-900">KSh {total.toLocaleString()}</span>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-brand-green text-white flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-colors"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-brand-green" />
                  <span className="text-[11px] text-slate-500 font-medium">Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-brand-green" />
                  <span className="text-[11px] text-slate-500 font-medium">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
