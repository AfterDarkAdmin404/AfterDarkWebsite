'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  username: string;
  user_role: number;
  createdAt: string;
  last_login: string | null;
  is_active: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Not authenticated');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError('Authentication failed');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-700 to-gray-800 text-foreground p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-serif font-bold">
              AfterDark
            </Link>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Profile
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="grid gap-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6">
            <h1 className="text-3xl font-serif text-foreground mb-2">
              Your Profile
            </h1>
            <p className="text-gray-300">
              Manage your account and view your information.
            </p>
          </div>

          {/* User Credentials Card */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-serif text-foreground mb-4">
              Account Information
            </h2>
            <div className="grid gap-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-300">Username:</span>
                <span className="text-foreground font-medium">{user?.username}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-300">Email:</span>
                <span className="text-foreground font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-300">Role:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user?.user_role === 1 
                    ? 'bg-accent text-foreground' 
                    : 'bg-blue-600 text-white'
                }`}>
                  {user?.user_role === 1 ? 'Admin' : 'User'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-300">Member Since:</span>
                <span className="text-foreground font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-300">Last Login:</span>
                <span className="text-foreground font-medium">
                  {user?.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-300">Account Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user?.is_active 
                    ? 'bg-green-600 text-white' 
                    : 'bg-red-600 text-white'
                }`}>
                  {user?.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-serif text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all p-4 rounded-lg text-center"
              >
                <h3 className="font-medium text-white mb-2">Back to Home</h3>
                <p className="text-blue-100 text-sm">Return to the main page</p>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all p-4 rounded-lg text-center"
              >
                <h3 className="font-medium text-white mb-2">Logout</h3>
                <p className="text-red-100 text-sm">Sign out of your account</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 