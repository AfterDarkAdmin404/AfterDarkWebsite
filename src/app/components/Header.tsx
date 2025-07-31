'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export function Header() {
  const { user, customUser, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = process.env.NEXT_PUBLIC_SITE_URL || '/';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="py-5 relative z-50">
      <div className="max-w-7xl mx-auto px-5">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo.png"
              alt="AfterDark Logo"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <div className="text-3xl font-bold text-foreground font-serif">
              AfterDark
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-12">
            {/* Main Navigation */}
            <ul className="flex gap-8 list-none">
              <li>
                <Link href="#home" className="text-foreground hover:text-accent transition-colors duration-300 relative group">
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="#explore" className="text-foreground hover:text-accent transition-colors duration-300 relative group">
                  Explore
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/community`} className="text-foreground hover:text-accent transition-colors duration-300 relative group">
                  Community
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-foreground hover:text-accent transition-colors duration-300 relative group">
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-foreground hover:text-accent transition-colors duration-300 relative group">
                  Contact
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-foreground">
                  Welcome, {customUser?.username || user.user_metadata?.username || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/login`}
                  className="text-foreground hover:text-accent transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  href={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/register`}
                  className="bg-accent hover:bg-accent-dark text-foreground px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
} 