import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { useAdminSession } from '../../hooks/useAdminSession';

export default function AdminLogin() {
  const { loading, authenticated, refreshSession } = useAdminSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!loading && authenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Unable to sign in to the admin dashboard.');
      }

      await refreshSession();
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (error) {
      setErrorMessage(error.message || 'Unable to sign in to the admin dashboard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[40px] border border-white/10 bg-slate-900/60 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.85)] backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden border-b border-white/10 p-10 lg:border-b-0 lg:border-r lg:p-14">
            <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-emerald-500/20 blur-[120px]"></div>
            <div className="relative z-10 max-w-lg">
              <div className="inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-emerald-300">
                <ShieldCheck size={14} />
                Admin Control
              </div>

              <h1 className="mt-8 text-4xl font-black uppercase leading-none tracking-tighter md:text-6xl">
                Mobimax Operations Center
              </h1>

              <p className="mt-6 max-w-md text-sm font-medium leading-relaxed text-slate-300 md:text-base">
                Securely manage products, merchandising, categories, brands, and order operations from one production-style control panel.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {[
                  'Product catalog management',
                  'Order visibility and status control',
                  'Inventory and merchandising flags',
                  'Brand and category maintenance',
                ].map((item) => (
                  <div key={item} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-10 lg:p-14">
            <div className="mx-auto max-w-md">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-300">
                Sign In
              </p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-tight">
                Admin Login
              </h2>
              <p className="mt-3 text-sm font-medium text-slate-400">
                Use the admin credentials configured on the server environment.
              </p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                    Username
                  </label>
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(event) =>
                      setCredentials((current) => ({ ...current, username: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white outline-none transition focus:border-emerald-400"
                    placeholder="admin@mobimax.local"
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="password"
                      value={credentials.password}
                      onChange={(event) =>
                        setCredentials((current) => ({ ...current, password: event.target.value }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-5 font-bold text-white outline-none transition focus:border-emerald-400"
                      placeholder="Enter the secure admin password"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-4 text-sm font-bold text-red-200">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-[11px] font-black uppercase tracking-[0.25em] text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Signing In…' : 'Unlock Dashboard'}
                </button>
              </form>

              <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">
                  Environment Note
                </p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-400">
                  Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in your environment variables before deploying.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
