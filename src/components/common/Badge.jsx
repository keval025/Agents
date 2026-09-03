import React from 'react';

export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    dark: 'bg-zinc-950 text-white border-zinc-900',
    gold: 'bg-[#F9F5F0] text-[#8C6D3F] border-[#E8DCC9]',
    sale: 'bg-rose-50 text-rose-700 border-rose-200',
    accent: 'bg-amber-50 text-amber-800 border-amber-200',
    outline: 'bg-transparent text-zinc-800 border-zinc-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest border ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
}
