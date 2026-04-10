import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import AppFooter from './components/layout/AppFooter';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CategoryBrandHub from './pages/CategoryBrandHub';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import LegalPage from './pages/LegalPage';
import NotFound from './pages/NotFound';
import WhatsAppFloat from './components/ui/WhatsAppFloat';

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 bg-gray-50 relative pb-10">
        <Outlet />
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
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="privacy" element={<LegalPage pageKey="privacy" />} />
          <Route path="terms" element={<LegalPage pageKey="terms" />} />
          <Route path="cookies" element={<LegalPage pageKey="cookies" />} />
          <Route path=":type/:slug" element={<CategoryBrandHub />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
