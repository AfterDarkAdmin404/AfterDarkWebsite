'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Client-side validation
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      // Generate username from email (everything before @)
      const username = formData.email.split('@')[0];
      const { error } = await signUp(formData.email, formData.password, username);

      if (error) {
        if (error.message.includes('already registered')) {
          setError('An account with this email already exists.');
        } else if (error.message.includes('password')) {
          setError('Password is too weak. Please choose a stronger password.');
        } else {
          setError(error.message || 'Registration failed. Please try again.');
        }
      } else {
        setSuccess('Registration successful! Please check your email to confirm your account.');
        // Don't redirect immediately - user needs to confirm email
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground font-serif mb-2">
            Join AfterDark
          </h2>
          <p className="text-gray-300">
            Create your account and start exploring. Your username will be automatically generated from your email.
          </p>
        </div>
        
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-accent/20">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
              <p className="font-medium mb-2">Check your email!</p>
              <p>{success}</p>
              <p className="mt-2 text-xs text-gray-400">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>

            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-lg text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 disabled:opacity-50"
                placeholder="Enter a valid email address"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-lg text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 disabled:opacity-50"
                placeholder="Create a password (min 6 characters)"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-lg text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 disabled:opacity-50"
                placeholder="Confirm your password"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                required
                checked={formData.agreeToTerms}
                onChange={handleChange}
                disabled={isLoading}
                className="h-4 w-4 text-accent focus:ring-accent border-gray-600 rounded bg-black/60 disabled:opacity-50"
              />
              <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-300">
                I agree to the{' '}
                <Link
                  href="/terms"
                  className="text-accent hover:text-accent-dark transition-colors duration-300"
                >
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link
                  href="/privacy"
                  className="text-accent hover:text-accent-dark transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !formData.agreeToTerms}
              className="w-full bg-gradient-to-r from-accent to-accent-dark text-foreground py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/30 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-accent hover:text-accent-dark transition-colors duration-300 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-accent transition-colors duration-300"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 