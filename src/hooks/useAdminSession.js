import { useEffect, useState } from 'react';

const INITIAL_STATE = {
  loading: true,
  authenticated: false,
  username: '',
};

export function useAdminSession() {
  const [session, setSession] = useState(INITIAL_STATE);

  const refreshSession = async () => {
    setSession((current) => ({ ...current, loading: true }));

    try {
      const response = await fetch('/api/admin/session', {
        credentials: 'include',
      });
      const result = await response.json().catch(() => ({}));

      setSession({
        loading: false,
        authenticated: Boolean(result.authenticated),
        username: result.username || '',
      });
    } catch {
      setSession({
        loading: false,
        authenticated: false,
        username: '',
      });
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadSession = async () => {
      try {
        const response = await fetch('/api/admin/session', {
          credentials: 'include',
        });
        const result = await response.json().catch(() => ({}));

        if (cancelled) {
          return;
        }

        setSession({
          loading: false,
          authenticated: Boolean(result.authenticated),
          username: result.username || '',
        });
      } catch {
        if (cancelled) {
          return;
        }

        setSession({
          loading: false,
          authenticated: false,
          username: '',
        });
      }
    };

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    ...session,
    refreshSession,
  };
}
