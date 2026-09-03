import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium tracking-wide uppercase transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]';

  const variants = {
    primary:
      'bg-zinc-950 text-white hover:bg-zinc-800 focus:ring-zinc-900 border border-zinc-950 shadow-sm',
    secondary:
      'bg-white text-zinc-900 border border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50 focus:ring-zinc-900',
    outline:
      'bg-transparent text-zinc-900 border border-zinc-900 hover:bg-zinc-900 hover:text-white focus:ring-zinc-900',
    gold:
      'bg-[#C5A880] text-zinc-950 hover:bg-[#b5956a] focus:ring-[#C5A880] font-semibold',
    ghost:
      'bg-transparent text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 focus:ring-zinc-400',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600 border border-rose-600',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 tracking-wider gap-1.5',
    md: 'text-xs px-6 py-3 tracking-widest gap-2',
    lg: 'text-sm px-8 py-4 tracking-widest gap-2.5',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
}
