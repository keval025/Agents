import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Mail, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { insforge } from '../lib/insforge';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const { data, error } = await insforge.auth.sendResetPasswordEmail({
        email,
      });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send reset email. Please try again.');
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
            Recovery
          </span>
          <h1 className="font-serif text-3xl font-medium text-zinc-950">
            Reset Password
          </h1>
          <p className="text-xs text-zinc-500 mt-2">
            Enter the email address associated with your atelier account.
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-medium text-sm text-zinc-900">Check Your Email</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              We've dispatched password reset instructions to <strong className="text-zinc-900">{email}</strong>.
            </p>
            <div className="pt-4">
              <Link to="/login">
                <Button variant="primary" size="md" fullWidth>
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="mt-6 py-4"
            >
              Send Reset Instructions
            </Button>

            <div className="pt-4 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
