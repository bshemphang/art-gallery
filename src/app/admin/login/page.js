'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { EyeIcon, EyeSlashIcon, KeyIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/admin/dashboard');
    } catch (error) {
      setError(error.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Gallery
          </a>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-6 px-8">
            <div className="flex items-center justify-center gap-3">
              <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <KeyIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Artist Portal</h1>
            </div>
            <p className="text-center text-amber-100 mt-2 text-sm">
              Manage your artwork collection
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4 text-amber-600" />
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 pl-10 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <EnvelopeIcon className="h-5 w-5 text-amber-400" />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <KeyIcon className="h-4 w-4 text-amber-600" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pl-10 pr-10 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <KeyIcon className="h-5 w-5 text-amber-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-500 hover:text-amber-700"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <KeyIcon className="h-5 w-5" />
                  Sign In to Dashboard
                </>
              )}
            </button>

            {/* Help Text */}
            <div className="text-center pt-4 border-t border-amber-50">
              <p className="text-sm text-gray-500">
                Forgot your password? Contact the developer
              </p>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Secure admin access for managing artworks
          </p>
        </div>
      </div>
    </div>
  );
}