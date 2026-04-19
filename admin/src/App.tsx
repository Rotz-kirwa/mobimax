import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import AdminProtectedRoute from './components/AdminProtectedRoute';

const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 font-sans">
      <div className="text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing Intelligence</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Legacy or explicit /admin redirect */}
          <Route path="/admin" element={<Navigate to="/" replace />} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          
          <Route path="/login" element={<AdminLogin />} />
          
          <Route path="/" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } />
          
          <Route path="/products" element={
            <AdminProtectedRoute>
              <AdminProducts />
            </AdminProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <AdminProtectedRoute>
              <AdminOrders />
            </AdminProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
