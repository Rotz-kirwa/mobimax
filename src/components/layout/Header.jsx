import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Headphones, Menu, X, ChevronDown, Heart } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { categories } from '../../data/mockData';
import clsx from 'clsx';

const megaMenuData = {
  Apple: {
    to: '/brand/apple',
    subcategories: [
      { name: 'iPhones', to: '/category/phones?subcategory=iPhones' },
      { name: 'AirPods', to: '/category/audio?subcategory=Earbuds' },
      { name: 'MacBooks', to: '/category/computing?subcategory=MacBooks' },
      { name: 'Apple Watch', to: '/category/wearables?subcategory=Smartwatches' },
      { name: 'iPads', to: '/category/tablets?subcategory=iPads' },
      { name: 'Apple Accessories', to: '/category/accessories' },
    ]
  },
  Samsung: {
    to: '/brand/samsung',
    subcategories: [
      { name: 'Galaxy S Series', to: '/category/phones?subcategory=Samsung Galaxy' },
      { name: 'Galaxy A Series', to: '/category/phones?subcategory=Samsung Galaxy' },
      { name: 'Galaxy Tablets', to: '/category/tablets?subcategory=Android Tablets' },
      { name: 'Galaxy Buds', to: '/category/audio?subcategory=Earbuds' },
      { name: 'Galaxy Watch', to: '/category/wearables?subcategory=Smartwatches' },
    ]
  },
  'Ex-UK Used': {
    to: '/shop?condition=Ex-UK Used',
    subcategories: [
      { name: 'Ex-UK iPhones', to: '/brand/apple?condition=Ex-UK Used' },
      { name: 'Ex-UK Samsung', to: '/brand/samsung?condition=Ex-UK Used' },
      { name: 'Ex-UK Laptops', to: '/category/computing?condition=Ex-UK Used' },
      { name: 'Ex-UK Pixels', to: '/brand/google?condition=Ex-UK Used' },
    ]
  },
  'Audio & Sound': {
    to: '/category/audio',
    subcategories: [
      { name: 'Bose', to: '/brand/bose' },
      { name: 'Sony Audio', to: '/brand/sony' },
      { name: 'JBL Speakers', to: '/brand/jbl' },
      { name: 'Earbuds', to: '/category/audio?subcategory=Earbuds' },
      { name: 'Headphones', to: '/category/audio?subcategory=Headphones' },
    ]
  }
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useStore();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const cartTotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="bg-white w-full z-50 relative border-b border-gray-100 shadow-sm">
        {/* Top bar with promotional message */}
        <div className="bg-gray-900 text-white py-2 overflow-hidden">
          <div className="container mx-auto px-4 max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.08em] sm:tracking-[0.12em] md:tracking-[0.2em] text-center sm:text-left">
            <div className="flex flex-col md:flex-row justify-center sm:justify-start gap-1 md:gap-6">
              <span>Pay on Delivery Website</span>
              <span className="hidden md:inline">Countrywide Delivery</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-1 sm:gap-4">
              <Link to="/deals" className="text-brand hover:text-white transition-colors">🔥 Hot Deals</Link>
              <Link to="/shop" className="hover:text-brand transition-colors">New Arrivals</Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          <div className="py-6 flex items-center justify-between gap-4 lg:gap-12">
            
            {/* Logo */}
            <Link to="/" className="flex flex-col items-center gap-0 group shrink-0">
               <div className="flex items-center gap-2">
                 <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-green/20">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                 </div>
                 <div className="flex flex-col leading-none">
                   <span className="text-2xl font-black text-gray-900 tracking-tighter">MobiMax</span>
                   <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em] ml-0.5">Premium</span>
                 </div>
               </div>
            </Link>

            {/* Search Bar - Desktop */}
            <form 
              onSubmit={handleSearch}
              className="hidden lg:flex flex-1 max-w-2xl relative bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-green/20 focus-within:border-brand-green transition-all group"
            >
              <div className="flex items-center px-4 py-3 bg-white border-r border-gray-100 cursor-pointer min-w-[140px] text-[12px] font-bold text-gray-700 hover:bg-gray-50 transition-colors uppercase tracking-tight">
                All Collections <ChevronDown size={14} className="ml-auto text-gray-400" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..." 
                className="w-full bg-transparent text-gray-900 px-5 py-3 focus:outline-none placeholder-gray-400 text-sm font-medium"
              />
              <button type="submit" className="bg-brand-green text-white px-8 py-3 hover:bg-brand-green-hover transition-colors">
                <Search size={20} />
              </button>
            </form>

            {/* User Actions - Desktop */}
            <div className="hidden lg:flex items-center gap-8 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                   <Headphones size={20} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Talk to Us</span>
                  <a href="tel:+254797674862" className="text-sm font-black text-gray-900 hover:text-brand-green transition-colors">+254 797 674862</a>
                </div>
              </div>

              <div className="flex items-center gap-6 border-l border-gray-100 pl-8">
                <Link to="/account" className="relative group text-gray-400 hover:text-gray-900 transition-colors">
                  <User size={24} strokeWidth={2} />
                </Link>
                <Link to="/wishlist" className="relative group text-gray-400 hover:text-gray-900 transition-colors">
                  <Heart size={24} strokeWidth={2} />
                </Link>
                <Link to="/cart" className="relative flex items-center gap-3 group">
                  <div className="relative">
                    <ShoppingCart size={24} className="text-gray-400 group-hover:text-gray-900 transition-colors" strokeWidth={2} />
                    <span className="absolute -top-1.5 -right-2 bg-brand text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-brand/10 transition-all">
                      {cartItemsCount}
                    </span>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">My Cart</span>
                    <span className="text-sm font-black text-gray-900">KSh {cartTotal.toLocaleString()}</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1 lg:hidden ml-auto">
               <button className="p-2 text-gray-500 hover:text-brand-green"><Search size={24} /></button>
               <Link to="/cart" className="relative p-2 text-gray-500 hover:text-brand-green">
                <ShoppingCart size={24} />
                {cartItemsCount > 0 && (
                  <span className="absolute top-1 right-1 bg-brand text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="p-2 ml-1 w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 border border-gray-100"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* Navigation Categories Row - Desktop with Mega Menu */}
        <div className="hidden lg:block border-t border-gray-50 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <nav className="flex items-center gap-10">
               {/* Main Categories with Hover Mega Menus */}
               {Object.entries(megaMenuData).map(([key, data]) => (
                 <div 
                   key={key} 
                   className="relative py-4 group"
                   onMouseEnter={() => setActiveMegaMenu(key)}
                   onMouseLeave={() => setActiveMegaMenu(null)}
                 >
                   <Link 
                     to={data.to} 
                     className="text-[13px] font-black text-gray-900 uppercase tracking-tight flex items-center gap-1.5 hover:text-brand-green transition-colors"
                   >
                     {key} <ChevronDown size={14} className={clsx("transition-transform", activeMegaMenu === key && "rotate-180")} />
                   </Link>

                   {/* Mega Menu Content */}
                   <div className={clsx(
                     "absolute top-full left-0 pt-2 transition-all duration-300 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-50",
                     activeMegaMenu === key ? "opacity-100 visible translate-y-0" : ""
                   )}>
                     <div className="bg-white border border-gray-100 shadow-premium-hover rounded-2xl p-6 min-w-[280px]">
                        <div className="grid grid-cols-1 gap-4">
                           {data.subcategories.map((sub, idx) => (
                             <Link 
                               key={idx} 
                               to={sub.to}
                               className="flex items-center justify-between text-[13px] font-bold text-gray-500 hover:text-brand-green transition-colors group/item"
                             >
                               {sub.name}
                               <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover/item:opacity-100 transition-all translate-x-[-4px] group-hover/item:translate-x-0" />
                             </Link>
                           ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Promotion Available</span>
                            <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse"></span>
                        </div>
                     </div>
                   </div>
                 </div>
               ))}

               {/* Regular Links */}
               <Link to="/shop?category=gaming" className="py-4 text-[13px] font-black text-gray-900 uppercase tracking-tight hover:text-brand-green transition-colors">Gaming</Link>
               <Link to="/shop?category=computing" className="py-4 text-[13px] font-black text-gray-900 uppercase tracking-tight hover:text-brand-green transition-colors">Computing</Link>
               <Link to="/shop?category=accessories" className="py-4 text-[13px] font-black text-gray-900 uppercase tracking-tight hover:text-brand-green transition-colors">Accessories</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white w-[85%] h-full p-8 shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-10">
               <span className="text-2xl font-black text-gray-900 tracking-tighter">Menu</span>
               <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center"><X size={20} className="text-gray-900" /></button>
            </div>
            
            <div className="flex flex-col gap-6">
              {Object.entries(megaMenuData).map(([key, data]) => (
                <div key={key} className="flex flex-col gap-3">
                   <Link to={data.to} onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-gray-900 uppercase tracking-tight">{key}</Link>
                   <div className="grid grid-cols-2 gap-x-4 gap-y-2 pl-4 border-l-2 border-gray-100">
                      {data.subcategories.map((sub, idx) => (
                        <Link 
                          key={idx} 
                          to={sub.to} 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-[13px] font-bold text-gray-400"
                        >
                          {sub.name}
                        </Link>
                      ))}
                   </div>
                </div>
              ))}
              <div className="flex flex-col gap-4 pt-6 mt-6 border-t border-gray-100">
                 <Link to="/shop?category=gaming" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-gray-900 uppercase">Gaming</Link>
                 <Link to="/shop?category=computing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-gray-900 uppercase">Computing</Link>
                 <Link to="/shop?category=accessories" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-gray-900 uppercase">Accessories</Link>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-8 pt-10 border-t border-gray-100">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green">
                   <Headphones size={24} />
                 </div>
                 <div className="flex flex-col leading-tight">
                    <span className="text-xs font-bold text-gray-400 uppercase">Call Support</span>
                    <a href="tel:+254797674862" className="text-lg font-black text-gray-900">+254 797 674862</a>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="bg-gray-50 p-4 rounded-2xl flex flex-col gap-2 font-bold text-gray-900">
                    <User size={20} className="text-gray-400" /> Account
                  </Link>
                  <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="bg-gray-50 p-4 rounded-2xl flex flex-col gap-2 font-bold text-gray-900">
                    <Heart size={20} className="text-gray-400" /> Wishlist
                  </Link>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
