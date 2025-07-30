'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground font-serif mb-2">
            Profile
          </h1>
          <p className="text-gray-300">
            Manage your account settings
          </p>
        </div>
        
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-accent/20">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Account Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-foreground">{user.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Username
                  </label>
                  <p className="text-foreground">{user.user_metadata?.username || 'Not set'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Account Created
                  </label>
                  <p className="text-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Last Sign In
                  </label>
                  <p className="text-foreground">
                    {new Date(user.last_sign_in_at || user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-600 pt-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Account Actions
              </h2>
              
              <div className="space-y-3">
                <button
                  onClick={handleSignOut}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
                >
                  Sign Out
                </button>
                
                <Link
                  href="/"
                  className="block w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black text-center"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 