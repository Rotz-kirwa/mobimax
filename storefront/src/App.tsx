import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from './components/layout/Header';
import AppFooter from './components/layout/AppFooter';
import WhatsAppFloat from './components/ui/WhatsAppFloat';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CategoryBrandHub = lazy(() => import('./pages/CategoryBrandHub'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Account = lazy(() => import('./pages/Account'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Compare = lazy(() => import('./pages/Compare'));
const Laptops = lazy(() => import('./pages/Laptops'));
const Smartwatches = lazy(() => import('./pages/Smartwatches'));
const Powerbanks = lazy(() => import('./pages/Powerbanks'));
const Chargers = lazy(() => import('./pages/Chargers'));
const Huawei = lazy(() => import('./pages/Huawei'));

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-md rounded-[32px] border border-gray-100 bg-white p-10 text-center shadow-premium">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#4f46e5]">
          Loading
        </p>
        <h2 className="mt-4 text-2xl font-black uppercase tracking-tight text-gray-900">
          Preparing the next page
        </h2>
        <p className="mt-3 text-sm font-medium text-gray-500">
          Pulling in the storefront view you requested.
        </p>
      </div>
    </div>
  );
}

function AppOutlet() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="relative flex-1 bg-gray-50">
        <AppOutlet />
      </main>
      <AppFooter />
      <WhatsAppFloat />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="deals" element={<Shop />} />
          <Route path="account" element={<Account />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="privacy" element={<LegalPage pageKey="privacy" />} />
          <Route path="terms" element={<LegalPage pageKey="terms" />} />
          <Route path="cookies" element={<LegalPage pageKey="cookies" />} />
          <Route path=":type/:slug" element={<CategoryBrandHub />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="compare" element={<Compare />} />
          <Route path="laptops" element={<Laptops />} />
          <Route path="smartwatches" element={<Smartwatches />} />
          <Route path="powerbanks" element={<Powerbanks />} />
          <Route path="chargers" element={<Chargers />} />
          <Route path="huawei" element={<Huawei />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
