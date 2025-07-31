'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdminUser {
  id: string;
  email: string;
  username: string;
  user_role: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
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
        
        if (data.user.user_role !== 1) {
          router.push('/user');
          return;
        }

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
      <header className="bg-gradient-to-r from-accent to-accent-dark text-foreground p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-serif font-bold">
              AfterDark
            </Link>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Admin Dashboard
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid gap-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6">
            <h1 className="text-3xl font-serif text-foreground mb-2">
              Welcome, {user?.username}!
            </h1>
            <p className="text-gray-300">
              You have administrative privileges on the AfterDark platform.
            </p>
          </div>

          {/* User Credentials Card */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-serif text-foreground mb-4">
              Your Credentials
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
                <span className="bg-accent text-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Admin
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-300">Member Since:</span>
                <span className="text-foreground font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-serif text-foreground mb-4">
              Admin Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/admin/users"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all p-4 rounded-lg text-center"
              >
                <h3 className="font-medium text-white mb-2">Manage Users</h3>
                <p className="text-blue-100 text-sm">View and manage all users</p>
              </Link>
              <Link
                href="/admin/analytics"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all p-4 rounded-lg text-center"
              >
                <h3 className="font-medium text-white mb-2">Analytics</h3>
                <p className="text-green-100 text-sm">View platform statistics</p>
              </Link>
              <Link
                href="/admin/settings"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all p-4 rounded-lg text-center"
              >
                <h3 className="font-medium text-white mb-2">Settings</h3>
                <p className="text-purple-100 text-sm">Platform configuration</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 