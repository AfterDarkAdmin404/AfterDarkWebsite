'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Processing...');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          setError('Authentication error. Please try again.');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        // Check if this is a password reset
        const type = searchParams.get('type');
        if (type === 'recovery') {
          setMessage('Password reset successful! Redirecting to login...');
          setTimeout(() => router.push('/login'), 2000);
        } else {
          setMessage('Email confirmed successfully! Redirecting to dashboard...');
          setTimeout(() => router.push('/'), 2000);
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground font-serif mb-2">
            Authentication
          </h2>
          
          <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-accent/20">
            {error ? (
              <div className="text-red-300 text-center">
                <p className="text-lg font-medium mb-2">Error</p>
                <p>{error}</p>
              </div>
            ) : (
              <div className="text-green-300 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-lg font-medium">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground font-serif mb-2">
            Authentication
          </h2>
          
          <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-accent/20">
            <div className="text-green-300 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-lg font-medium">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
} 