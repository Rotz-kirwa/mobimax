import { Link } from 'react-router-dom';
import { Share2, MessageCircle, Instagram, Youtube, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { useCatalogStore } from '../../store/useCatalogStore';

export default function Footer() {
  const categories = useCatalogStore((state) => state.categories);
  const brands = useCatalogStore((state) => state.brands);
  const socialLinks = [
    { label: 'Share on WhatsApp', href: 'https://wa.me/254797674862', icon: Share2 },
    { label: 'Chat on WhatsApp', href: 'https://wa.me/254797674862', icon: MessageCircle },
    { label: 'Visit Instagram', href: 'https://instagram.com', icon: Instagram },
    { label: 'Visit YouTube', href: 'https://youtube.com', icon: Youtube },
  ];

  return (
    <footer className="bg-white pt-20 mt-auto border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-8">
            <Link to="/" className="flex items-center gap-2">
               <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-green/20">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
               </div>
               <div className="flex flex-col leading-none">
                 <span className="text-2xl font-black text-gray-900 tracking-tighter">MobiMax</span>
                 <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em] ml-0.5">Premium</span>
               </div>
            </Link>
            
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              MobiMax is Kenya's premier destination for authentic electronics. We specialize in flagships, premium computing, and high-fidelity audio with a focus on trust and speed.
            </p>
            
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-brand-green hover:text-white hover:-translate-y-1 transition-all duration-300"
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[11px] font-black text-gray-900 mb-8 uppercase tracking-[0.2em] relative inline-block">
              Shop Categories
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-brand-green"></span>
            </h3>
            <ul className="flex flex-col gap-4">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link to={`/shop?category=${category.id}`} className="text-gray-500 hover:text-brand-green text-sm font-bold transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand Links */}
          <div>
            <h3 className="text-[11px] font-black text-gray-900 mb-8 uppercase tracking-[0.2em] relative inline-block">
              Top Brands
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-brand-green"></span>
            </h3>
            <ul className="flex flex-col gap-4">
              {brands.slice(0, 6).map((brand) => (
                <li key={brand.id}>
                  <Link to={`/shop?brand=${brand.slug}`} className="text-gray-500 hover:text-brand-green text-sm font-bold transition-colors">
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-black text-gray-900 mb-8 uppercase tracking-[0.2em] relative inline-block">
              Get in Touch
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-brand-green"></span>
            </h3>
            <ul className="flex flex-col gap-6">
              <li className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                  <MapPin size={18} className="text-brand-green" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Our Store</span>
                   <span className="text-sm font-black text-gray-900 leading-tight mt-0.5">MobiMax Tower, Nairobi</span>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                  <Phone size={18} className="text-brand-green" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone Support</span>
                   <a href="tel:+254797674862" className="text-sm font-black text-gray-900 hover:text-brand-green transition-colors mt-0.5">+254 797 674862</a>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                  <Mail size={18} className="text-brand-green" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Us</span>
                   <span className="text-sm font-black text-gray-900 leading-tight mt-0.5">sales@mobimax.co.ke</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Newsletter Banner */}
        <div className="bg-gray-900 rounded-[32px] p-8 md:p-12 mb-20 relative overflow-hidden group">
           <div className="absolute inset-0 bg-brand-green opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
           <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="max-w-md text-center md:text-left">
                 <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Join the MobiMax Club</h2>
                 <p className="text-gray-400 font-bold text-sm">Subscribe to get notified about hot deals and new tech drops.</p>
              </div>
              <form 
                className="flex flex-col sm:flex-row w-full md:w-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-brand-green transition-all"
                onSubmit={(e) => e.preventDefault()}
              >
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="bg-transparent text-white px-4 py-3 focus:outline-none w-full md:w-64 font-bold text-sm" 
                />
                <button type="submit" className="w-full sm:w-auto justify-center bg-brand-green text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-brand-green transition-all flex items-center gap-2">
                  Join <ArrowRight size={14} />
                </button>
              </form>
           </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-gray-50 border-t border-gray-200/50 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-2 items-center md:items-start">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">&copy; {new Date().getFullYear()} MobiMax Premium Storefront. Designed for Excellence.</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Link to="/about" className="text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">About</Link>
                <Link to="/contact" className="text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Contact</Link>
                <Link to="/faq" className="text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">FAQ</Link>
                <Link to="/privacy" className="text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Privacy</Link>
                <Link to="/terms" className="text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Terms</Link>
                <Link to="/cookies" className="text-[11px] font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">Cookies</Link>
              </div>
            </div>
            
            {/* Payment Icons Placeholder */}
            <div className="flex flex-wrap items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-black text-gray-400">VISA</div>
                <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-black text-gray-400">M-PESA</div>
                <div className="h-6 w-10 bg-gray-200 rounded flex items-center justify-center text-[8px] font-black text-gray-400">MASTERCARD</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
