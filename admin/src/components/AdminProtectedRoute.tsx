import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('mbx_admin_token');
      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      // In a real app, we would verify the token with the server here
      // For this implementation, we assume if it exists it's valid for now
      // The API routes will handle actual validation
      setAuthenticated(true);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 animate-pulse">
            <ShieldAlert size={24} />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">Verifying Session</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
