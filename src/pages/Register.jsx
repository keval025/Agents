import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { addToast } = useToast();
  const { signUp } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      const msg = 'Passwords do not match. Please verify.';
      setErrorMessage(msg);
      addToast(msg, 'error');
      return;
    }

    if (formData.password.length < 6) {
      const msg = 'Password must be at least 6 characters long.';
      setErrorMessage(msg);
      addToast(msg, 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      if (res?.requireEmailVerification) {
        addToast('Registration successful! Please check your email to verify your account.', 'success');
        navigate('/login');
      } else {
        addToast('Welcome! Your account has been created successfully.');
        navigate('/shop');
      }
    } catch (err) {
      const errorText = err.message || err.error || 'Failed to create account. Please try again.';
      setErrorMessage(errorText);
      addToast(errorText, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white border border-zinc-200 p-8 sm:p-10 shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block mb-1">
            New Client
          </span>
          <h1 className="font-serif text-3xl font-medium text-zinc-950">
            Create Account
          </h1>
          <p className="text-xs text-zinc-500 mt-2">
            Enjoy personal styling recommendations and private salon previews.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Eleanor Vance"
              className="w-full text-xs p-3.5 bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-zinc-950 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="eleanor@example.com"
              className="w-full text-xs p-3.5 bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-zinc-950 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
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

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700 block mb-1.5">
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              className="w-full text-xs p-3.5 bg-zinc-50 border border-zinc-300 focus:outline-none focus:border-zinc-950 focus:bg-white"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2 text-xs text-zinc-600 cursor-pointer">
              <input
                type="checkbox"
                required
                defaultChecked
                className="accent-zinc-950 rounded border-zinc-300 h-3.5 w-3.5 mt-0.5"
              />
              <span className="leading-tight">
                I agree to the Terms of Service and Privacy Policy.
              </span>
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
            Create Account
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-zinc-100 text-center text-xs text-zinc-500">
          <span>Already have an account? </span>
          <Link to="/login" className="text-zinc-950 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
