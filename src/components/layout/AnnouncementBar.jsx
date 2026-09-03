import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#111111] text-[#E5DEC9] text-[11px] font-medium tracking-widest uppercase py-2.5 px-4 relative border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#C5A880] shrink-0 animate-pulse hidden sm:inline-block" />
        <span>
          Complimentary shipping on all orders over $200 — Use code <strong className="text-white font-semibold underline underline-offset-2">AURA15</strong> for 15% off your first atelier purchase
        </span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
