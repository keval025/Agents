import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match. Please verify.', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast('Welcome to the AURA Atelier community!');
      navigate('/shop');
    }, 800);
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
