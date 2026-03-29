"use client";

import AuthButton from '@/components/AuthButton';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900">AI Resume Intelligence</h1>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}