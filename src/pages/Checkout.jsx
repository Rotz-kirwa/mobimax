import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, CheckCircle2, ChevronLeft, MapPin, ShieldCheck, Truck, Smartphone, Wallet } from 'lucide-react';
import { useStore } from '../store/useStore';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function Checkout() {
  const { cart } = useStore();
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 100000 ? 0 : 500;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 text-center py-40">
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">No Inventory Selected</h2>
        <p className="text-gray-400 font-bold text-sm uppercase mb-12">Your checkout sequence was interrupted because the cart is empty.</p>
        <Link to="/shop" className="bg-brand-green text-white px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:shadow-xl transition-all">Explore Store</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 py-10 mb-12">
        <div className="container mx-auto px-4 max-w-7xl">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                 <Link to="/cart" className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-brand-green transition-colors uppercase tracking-[0.3em] mb-4">
                    <ChevronLeft size={16} strokeWidth={3} /> Return to Cart
                 </Link>
                 <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                    Checkout Protocol
                 </h1>
              </div>
              <div className="flex items-center gap-10">
                 <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center font-black text-xs shadow-lg shadow-brand-green/20">1</div>
                    <span className="text-[9px] font-black text-gray-900 uppercase mt-2 tracking-widest">Details</span>
                 </div>
                 <div className="w-12 h-px bg-gray-200"></div>
                 <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-black text-xs">2</div>
                    <span className="text-[9px] font-black text-gray-400 uppercase mt-2 tracking-widest">Payment</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Form Content */}
          <div className="flex-1 space-y-12">
            
            {/* Delivery Section */}
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-premium relative">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green">
                     <MapPin size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Logistic Destination</h2>
               </div>
               
               <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Legal First Name</label>
                     <input type="text" className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 outline-none transition-all font-bold text-gray-900" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Legal Last Name</label>
                     <input type="text" className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 outline-none transition-all font-bold text-gray-900" placeholder="Doe" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Safaricom Contact Number</label>
                     <div className="flex bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-green/10 focus-within:border-brand-green transition-all">
                        <span className="flex items-center px-6 bg-gray-200/50 text-gray-500 font-black text-sm">+254</span>
                        <input type="tel" className="w-full bg-transparent px-6 py-4 outline-none font-bold text-gray-900" placeholder="712 345 678" />
                     </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Physical Address / Apartment</label>
                     <input type="text" className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 outline-none transition-all font-bold text-gray-900" placeholder="e.g. Westlands, Terrace Apts, Door 4B" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Metropolis / City</label>
                     <input type="text" className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 outline-none transition-all font-bold text-gray-900" defaultValue="Nairobi" />
                  </div>
               </form>
            </div>

            {/* Payment Section */}
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-premium relative">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green">
                     <Smartphone size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Settlement Protocol</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'mpesa', name: 'M-Pesa Express', icon: Smartphone, desc: 'Direct STK Push' },
                    { id: 'pod', name: 'Pay on Delivery', icon: Wallet, desc: 'Pay when items arrive' },
                    { id: 'card', name: 'Credit / Debit', icon: CreditCard, desc: 'VISA / Mastercard' }
                  ].map((method) => (
                    <button 
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={clsx(
                        "flex items-center gap-6 p-6 rounded-[28px] border-2 transition-all text-left group",
                        paymentMethod === method.id 
                          ? "border-brand-green bg-brand-green/5 shadow-lg shadow-brand-green/10" 
                          : "border-gray-50 hover:border-gray-200 bg-gray-50/50"
                      )}
                    >
                       <div className={clsx(
                         "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                         paymentMethod === method.id ? "bg-brand-green text-white" : "bg-white text-gray-400 group-hover:text-gray-900"
                       )}>
                          <method.icon size={22} />
                       </div>
                       <div className="flex flex-col">
                          <span className={clsx("text-sm font-black uppercase tracking-tight", paymentMethod === method.id ? "text-gray-900" : "text-gray-400")}>{method.name}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{method.desc}</span>
                       </div>
                    </button>
                  ))}
               </div>

               {paymentMethod === 'mpesa' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-brand-green/10 rounded-3xl border border-brand-green/20 flex gap-4 items-start"
                  >
                     <ShieldCheck size={20} className="text-brand-green shrink-0 mt-1" />
                     <p className="text-xs font-bold text-gray-900 leading-relaxed uppercase tracking-widest">
                        A prompt will be sent to your Safaricom terminal (STK Push). Enter your PIN to authorize the transaction securely via Daraja Gateway.
                     </p>
                  </motion.div>
               )}

               {paymentMethod === 'pod' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4 items-start"
                  >
                     <Wallet size={20} className="text-amber-500 shrink-0 mt-1" />
                     <p className="text-xs font-bold text-gray-900 leading-relaxed uppercase tracking-widest">
                        Available within Nairobi metropolis only. Payment must be made via M-Pesa to our Till Number upon inspection of items.
                     </p>
                  </motion.div>
               )}
            </div>
          </div>

          {/* Premium Order Summary Wrapper */}
          <div className="w-full lg:w-[460px]">
             <div className="bg-gray-900 p-12 rounded-[50px] shadow-2xl sticky top-28 text-white relative overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green opacity-10 blur-[60px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-10 pb-6 border-b border-white/5 flex items-center justify-between">
                   Your Selection
                   <span className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">{cart.length} Units</span>
                </h2>

                <div className="space-y-8 mb-12 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                   {cart.map((item) => (
                      <div key={item.id} className="flex gap-6 group/item">
                         <div className="w-20 h-20 bg-white rounded-3xl p-3 shrink-0 relative overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover/item:scale-110 transition-transform duration-500" />
                         </div>
                         <div className="flex-1 flex flex-col justify-center">
                            <h4 className="text-sm font-black leading-tight line-clamp-2 uppercase tracking-tighter mb-2 group-hover/item:text-brand-green transition-colors">{item.name}</h4>
                            <div className="flex items-center justify-between">
                               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Qty: {item.quantity}</span>
                               <span className="text-sm font-black text-white">KSh {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="space-y-4 mb-10 pt-4 border-t border-white/5">
                   <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500">
                      <span>Inventory Value</span>
                      <span className="text-white">KSh {subtotal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500">
                      <span>Express Logistics</span>
                      <span className={clsx("font-black", deliveryFee === 0 ? "text-brand-green" : "text-white")}>
                         {deliveryFee === 0 ? 'COMPLIMENTARY' : `KSh ${deliveryFee.toLocaleString()}`}
                      </span>
                   </div>
                </div>

                <div className="bg-white/5 rounded-3xl p-8 mb-12 border border-white/5">
                   <div className="flex justify-between items-end mb-1">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Total Settlement</span>
                      <span className="text-4xl font-black text-brand-green tracking-tighter">KSh {total.toLocaleString()}</span>
                   </div>
                   <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest text-right">VAT inclusive certified</p>
                </div>

                <button 
                  onClick={() => alert('Order protocol initiated. Connecting to secure gateway...')}
                  className="w-full bg-brand-green text-white py-6 rounded-[28px] font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-gray-900 hover:shadow-2xl hover:shadow-brand-green/20 transition-all active:scale-[0.98] flex items-center justify-center gap-4"
                >
                   Finalize Order <ChevronRight size={18} strokeWidth={3} />
                </button>

                <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/5 pt-10">
                   <div className="flex items-center gap-4 grayscale opacity-40">
                      <span className="text-[10px] font-black uppercase tracking-tighter text-white">VISA</span>
                      <span className="text-[10px] font-black uppercase tracking-tighter text-white">M-PESA</span>
                      <span className="text-[10px] font-black uppercase tracking-tighter text-white">MASTERCARD</span>
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                      <ShieldCheck size={14} className="text-brand-green" /> 256-Bit Encrypted Secure Chain
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
