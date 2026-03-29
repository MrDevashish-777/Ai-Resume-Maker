"use client";

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await supabase.auth.signUp({ email, password });
        alert('Check your email for confirmation!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>✦</div>
          <h1 className="text-2xl font-bold gradient-text">AI Resume Intelligence</h1>
          <p className="text-slate-500 text-sm mt-1">Your AI-powered career companion</p>
        </div>

        {/* Card */}
        <div className="glass-strong p-8">
          <h2 className="text-xl font-bold text-white mb-1">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-slate-400 text-sm mb-6">{isSignUp ? 'Start building better resumes today.' : 'Sign in to continue to your dashboard.'}</p>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(165, 180, 252, 0.8)' }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(165, 180, 252, 0.8)' }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2">
              {loading ? <><span className="spinner"></span>Please wait...</> : isSignUp ? '✦ Create Account' : '→ Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-slate-500 text-sm">{isSignUp ? 'Already have an account? ' : "Don't have an account? "}</span>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-semibold transition-colors duration-200"
              style={{ color: '#a5b4fc' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#c4b5fd')}
              onMouseLeave={e => (e.currentTarget.style.color = '#a5b4fc')}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>

        {/* Features hint */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[['✦', 'AI Builder'], ['◎', 'ATS Analysis'], ['⟡', 'Job Tailoring']].map(([icon, label]) => (
            <div key={label} className="glass p-3 rounded-xl">
              <div className="text-lg mb-1">{icon}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
