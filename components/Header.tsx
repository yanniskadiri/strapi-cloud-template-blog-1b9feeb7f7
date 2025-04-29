'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full p-6 border-b flex justify-between items-center bg-white sticky top-0 z-50">
      <div className="text-2xl font-bold">
        <Link href="/">My Blog</Link>
      </div>
      <nav className="flex space-x-6 text-sm font-medium">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
      </nav>
    </header>
  );
}