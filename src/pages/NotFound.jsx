import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 max-w-5xl py-28 text-center">
      <div className="bg-white rounded-[40px] border border-gray-100 p-12 md:p-16 shadow-premium">
        <span className="text-[10px] font-black text-brand uppercase tracking-[0.4em] block mb-4">404</span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
          Route Not Found
        </h1>
        <p className="text-sm text-gray-500 font-medium max-w-2xl mx-auto mb-10">
          The page you requested does not exist in the current storefront map. Use one of the routes below to get back into the main flow.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-brand-green transition-all">
            Go Home
          </Link>
          <Link to="/shop" className="w-full sm:w-auto bg-white text-gray-900 border border-gray-100 px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:border-gray-200 transition-all">
            Browse Shop
          </Link>
          <Link to="/deals" className="w-full sm:w-auto bg-white text-gray-900 border border-gray-100 px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:border-gray-200 transition-all">
            View Deals
          </Link>
        </div>
      </div>
    </div>
  );
}
