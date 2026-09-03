import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, User, ShoppingBag, Heart, ArrowRight } from 'lucide-react';

export default function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  const navLinks = [
    { label: 'Shop All', to: '/shop' },
    { label: 'Women', to: '/shop?category=Women' },
    { label: 'Men', to: '/shop?category=Men' },
    { label: 'Accessories', to: '/shop?category=Accessories' },
    { label: 'Footwear', to: '/shop?category=Footwear' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <Link to="/" onClick={onClose} className="font-serif text-2xl tracking-[0.25em] font-bold text-zinc-950">
            AURA
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          <p className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">
            Collections
          </p>
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={onClose}
                className="text-lg font-serif tracking-wide text-zinc-800 hover:text-zinc-950 hover:translate-x-1 transition-all flex items-center justify-between py-1 border-b border-zinc-50"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
              </NavLink>
            ))}
          </div>

          <div className="pt-6 border-t border-zinc-100">
            <p className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase mb-4">
              Account & Saved
            </p>
            <div className="space-y-3">
              <Link
                to="/wishlist"
                onClick={onClose}
                className="flex items-center gap-3 text-sm text-zinc-700 hover:text-zinc-950 py-1"
              >
                <Heart className="w-4 h-4 text-[#C5A880]" />
                <span>Wishlist</span>
              </Link>
              <Link
                to="/cart"
                onClick={onClose}
                className="flex items-center gap-3 text-sm text-zinc-700 hover:text-zinc-950 py-1"
              >
                <ShoppingBag className="w-4 h-4 text-zinc-900" />
                <span>Shopping Bag</span>
              </Link>
              <Link
                to="/login"
                onClick={onClose}
                className="flex items-center gap-3 text-sm text-zinc-700 hover:text-zinc-950 py-1"
              >
                <User className="w-4 h-4 text-zinc-900" />
                <span>Sign In / Register</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-100 text-xs text-zinc-500">
          <p className="font-medium text-zinc-900 mb-1">Customer Concierge</p>
          <p>Available Mon-Fri 9am - 6pm CET</p>
          <p className="mt-2 text-[11px] text-[#C5A880] font-semibold">concierge@aura-atelier.com</p>
        </div>
      </div>
    </div>
  );
}
