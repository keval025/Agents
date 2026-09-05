import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { addToast } = useToast();
  const { signIn } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await signIn({ email, password });
      addToast('Welcome back! You have successfully signed in.');
      navigate('/shop');
    } catch (err) {
      setErrorMessage(err.message || err.error || 'Failed to sign in. Please check your credentials.');
      addToast(err.message || 'Invalid credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('client@aura-atelier.com');
    setPassword('atelier2026!');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white border border-zinc-200 p-8 sm:p-10 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block mb-1">
            Client Portal
          </span>
          <h1 className="font-serif text-3xl font-medium text-zinc-950">
            Sign In
          </h1>
          <p className="text-xs text-zinc-500 mt-2">
            Access your order history, curated private salon, and saved wishlist.
          </p>
        </div>

        {/* Demo button */}
        <div className="mb-6 p-3 bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
          <span className="text-zinc-600">Quick test credentials</span>
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-[#C5A880] hover:text-zinc-950 font-semibold underline underline-offset-2 uppercase tracking-wider text-[10px]"
          >
            Fill Demo Data
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs p-3.5 bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-[#C5A880] hover:text-zinc-950 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-3.5 bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-zinc-950 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-zinc-400 hover:text-zinc-700 absolute right-3.5 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-zinc-600 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="accent-zinc-950 rounded border-zinc-300 h-3.5 w-3.5"
              />
              <span>Remember me</span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            icon={ArrowRight}
            className="mt-6 py-4"
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-zinc-100 text-center text-xs text-zinc-500">
          <span>Don't have an account? </span>
          <Link
            to="/register"
            className="text-zinc-950 font-semibold hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
