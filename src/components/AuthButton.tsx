"use client";

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400 hidden sm:block">{user.email}</span>
        <button
          onClick={() => supabase.auth.signOut().then(() => router.refresh())}
          className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
          style={{ background: 'rgba(245, 87, 108, 0.15)', border: '1px solid rgba(245, 87, 108, 0.3)', color: '#fca5a5' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245, 87, 108, 0.25)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(245, 87, 108, 0.15)')}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push('/auth')}
      className="btn-primary text-sm"
    >
      Sign In
    </button>
  );
}
