'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  user_role: number;
}

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      window.location.href = '/';
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
                <Link href="/community" className="text-foreground hover:text-accent transition-colors duration-300 relative group">
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
            
            {/* Separator */}
            <div className="w-px h-8 bg-gray-600"></div>
            
            {/* Auth Buttons or User Info */}
            <div className="flex items-center gap-4">
              {loading ? (
                <div className="text-gray-400">Loading...</div>
              ) : user ? (
                <div className="flex items-center gap-4">
                  <span className="text-foreground font-medium">
                    {user.username}
                  </span>
                  <div className="w-px h-4 bg-gray-600"></div>
                  <Link 
                    href="/profile"
                    className="text-foreground hover:text-accent transition-colors duration-300 font-medium"
                  >
                    Profile
                  </Link>
                  <div className="w-px h-4 bg-gray-600"></div>
                  <button
                    onClick={handleLogout}
                    className="text-foreground hover:text-accent transition-colors duration-300 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="text-foreground hover:text-accent transition-colors duration-300 font-medium"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register"
                    className="bg-gradient-to-r from-accent to-accent-dark text-foreground px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/30"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            {loading ? (
              <div className="text-gray-400 text-sm">Loading...</div>
            ) : user ? (
              <>
                <span className="text-foreground font-medium text-sm">
                  {user.username}
                </span>
                <div className="w-px h-4 bg-gray-600"></div>
                <Link 
                  href="/profile"
                  className="text-foreground hover:text-accent transition-colors duration-300 font-medium text-sm"
                >
                  Profile
                </Link>
                <div className="w-px h-4 bg-gray-600"></div>
                <button
                  onClick={handleLogout}
                  className="text-foreground hover:text-accent transition-colors duration-300 font-medium text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="text-foreground hover:text-accent transition-colors duration-300 font-medium text-sm"
                >
                  Login
                </Link>
                <div className="w-px h-4 bg-gray-600"></div>
                <Link 
                  href="/register"
                  className="bg-gradient-to-r from-accent to-accent-dark text-foreground px-3 py-1.5 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105"
                >
                  Register
                </Link>
              </>
            )}
            <div className="w-px h-4 bg-gray-600"></div>
            <button className="text-foreground hover:text-accent transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
} 