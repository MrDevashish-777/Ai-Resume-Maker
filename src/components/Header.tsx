"use client";

import AuthButton from '@/components/AuthButton';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50" style={{ background: 'rgba(10, 10, 26, 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              ✦
            </div>
            <div>
              <span className="text-lg font-bold gradient-text">AI Resume</span>
              <span className="text-lg font-bold text-slate-300"> Intelligence</span>
            </div>
          </Link>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
