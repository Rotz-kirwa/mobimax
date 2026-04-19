import { Link } from 'react-router-dom';
import { Headphones, Heart, Mail, ShoppingCart, User, ShieldCheck, Activity } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const quickLinks = [
  { to: '/wishlist', label: 'Vault Wishlist', icon: Heart, tone: 'text-brand-green bg-green-50' },
  { to: '/cart', label: 'Active Cart', icon: ShoppingCart, tone: 'text-slate-900 bg-slate-100' },
  { to: '/shop', label: 'Catalog Access', icon: Activity, tone: 'text-brand-green bg-green-50' },
];

export default function Account() {
  const { cart, wishlist } = useStore();
  const cartItemsCount = (cart as any[]).reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      <div className="bg-white border-b border-slate-100 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-brand-green rounded-full"></div>
            <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.4em]">User Terminal</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight uppercase leading-none italic">
            Profile Hub
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-16 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12">
        <motion.section 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[48px] border border-slate-100 p-10 md:p-14 shadow-2xl shadow-brand-green/10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 text-slate-900 flex items-center justify-center border border-slate-100 shadow-inner">
                <User size={36} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Guest Entity</h2>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em] mt-2">
                  Session Active • Non-Authenticated Access
                </p>
              </div>
            </div>
            <Link to="/shop" className="inline-flex items-center justify-center bg-brand-green text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-brand-green/20 active:scale-95">
              Access Full Catalog
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <div className="bg-slate-50 rounded-[40px] border border-slate-100 p-10 group hover:border-green-200 transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Vaulted Markers</span>
              <div className="mt-4 text-5xl font-black text-slate-900 tracking-tighter italic">{wishlist.length}</div>
              <Link to="/wishlist" className="inline-block mt-8 text-[10px] font-black uppercase tracking-[0.25em] text-brand-green hover:text-black transition-colors">
                Decrypt Wishlist
              </Link>
            </div>
            <div className="bg-slate-50 rounded-[40px] border border-slate-100 p-10 group hover:border-green-200 transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Cart Payload</span>
              <div className="mt-4 text-5xl font-black text-slate-900 tracking-tighter italic">{cartItemsCount}</div>
              <Link to="/cart" className="inline-block mt-8 text-[10px] font-black uppercase tracking-[0.25em] text-brand-green hover:text-black transition-colors">
                Finalize Payload
              </Link>
            </div>
          </div>
          
          <div className="mt-12 p-8 bg-green-50/50 rounded-3xl border border-green-100/50 flex items-center gap-6">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm">
                <ShieldCheck size={24} />
             </div>
             <div>
                <p className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1 italic">Security Advisory</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                   Syncing with Enterprise servers will preserve your wishlist and cart permanently.
                </p>
             </div>
          </div>
        </motion.section>

        <motion.aside 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="bg-slate-950 rounded-[48px] p-12 text-white shadow-2xl shadow-brand-green/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-10 italic relative z-10">Quick Lanes</h3>
            <div className="space-y-4 relative z-10">
              {quickLinks.map((item) => (
                <Link key={item.to} to={item.to} className="flex items-center gap-6 rounded-3xl border border-white/5 bg-white/5 p-6 hover:bg-white/10 hover:border-white/10 transition-all group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.tone} group-hover:scale-110 transition-transform`}>
                    <item.icon size={24} />
                  </div>
                  <span className="font-black text-sm uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[48px] border border-slate-100 p-12 shadow-2xl shadow-brand-green/10">
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-10 italic">Hub Support</h3>
            <div className="space-y-8">
              <a href="tel:+254700000000" className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-green-50 text-brand-green rounded-2xl flex items-center justify-center border border-green-100 group-hover:bg-brand-green group-hover:text-white transition-all">
                   <Headphones size={24} />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signal Channel</span>
                   <span className="font-black text-lg text-slate-900 group-hover:text-brand-green transition-colors tracking-tight">+254 700 000000</span>
                </div>
              </a>
              <a href="mailto:support@mobimax.io" className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-brand-green group-hover:text-white transition-all">
                   <Mail size={24} />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Encrypted Mail</span>
                   <span className="font-black text-xs text-slate-900 group-hover:text-brand-green transition-colors tracking-widest uppercase">support@mobimax.io</span>
                </div>
              </a>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
