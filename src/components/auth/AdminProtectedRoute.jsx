import { Navigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAdminSession } from '../../hooks/useAdminSession';

export default function AdminProtectedRoute({ children }) {
  const { loading, authenticated } = useAdminSession();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-10 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-emerald-500/15 text-emerald-400">
            <ShieldCheck size={30} />
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.35em] text-emerald-300">
            Admin Security
          </p>
          <h1 className="mt-4 text-3xl font-black uppercase tracking-tight">
            Checking Session
          </h1>
          <p className="mt-3 text-sm font-medium text-slate-300">
            Validating the admin session before loading the dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
