import { Link } from 'react-router-dom';
import { Headphones, Heart, Mail, ShoppingCart, User } from 'lucide-react';
import { useStore } from '../store/useStore';

const quickLinks = [
  { to: '/wishlist', label: 'Wishlist', icon: Heart, tone: 'text-brand bg-brand/10' },
  { to: '/cart', label: 'Cart', icon: ShoppingCart, tone: 'text-brand-green bg-brand-green/10' },
  { to: '/shop', label: 'Continue Shopping', icon: User, tone: 'text-gray-900 bg-gray-100' },
];

export default function Account() {
  const { cart, wishlist } = useStore();
  const cartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-0.5 bg-brand-green"></div>
            <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em]">Profile Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
            My Account
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-12 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <section className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-premium">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-[24px] bg-brand-green/10 text-brand-green flex items-center justify-center">
                <User size={30} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Guest Session</h2>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Browse, save items, and move to cart without a full sign-in flow yet.
                </p>
              </div>
            </div>
            <Link to="/shop" className="inline-flex items-center justify-center bg-gray-900 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-green transition-all">
              Explore Catalog
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-[28px] border border-gray-100 p-6">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Wishlist Items</span>
              <div className="mt-3 text-4xl font-black text-gray-900 tracking-tighter">{wishlist.length}</div>
              <Link to="/wishlist" className="inline-block mt-4 text-xs font-black uppercase tracking-widest text-brand hover:text-brand-green transition-colors">
                Open Wishlist
              </Link>
            </div>
            <div className="bg-gray-50 rounded-[28px] border border-gray-100 p-6">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cart Quantity</span>
              <div className="mt-3 text-4xl font-black text-gray-900 tracking-tighter">{cartItems}</div>
              <Link to="/cart" className="inline-block mt-4 text-xs font-black uppercase tracking-widest text-brand hover:text-brand-green transition-colors">
                Review Cart
              </Link>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-premium">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-6">Quick Access</h3>
            <div className="space-y-3">
              {quickLinks.map((item) => (
                <Link key={item.to} to={item.to} className="flex items-center gap-4 rounded-[24px] border border-gray-100 p-4 hover:border-gray-200 transition-all">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.tone}`}>
                    <item.icon size={20} />
                  </div>
                  <span className="font-black text-sm text-gray-900 uppercase tracking-tight">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-premium">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-6">Need Help?</h3>
            <div className="space-y-4">
              <a href="tel:+254797674862" className="flex items-center gap-4 text-gray-900 hover:text-brand-green transition-colors">
                <Headphones size={20} className="text-brand-green" />
                <span className="font-black uppercase tracking-tight">+254 797 674862</span>
              </a>
              <a href="mailto:sales@mobimax.co.ke" className="flex items-center gap-4 text-gray-900 hover:text-brand-green transition-colors">
                <Mail size={20} className="text-brand-green" />
                <span className="font-black uppercase tracking-tight">sales@mobimax.co.ke</span>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
