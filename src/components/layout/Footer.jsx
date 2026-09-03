import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Instagram, Twitter, Facebook, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      addToast('Welcome to the AURA Atelier Inner Circle. Check your inbox soon!');
      setEmail('');
    } else {
      addToast('Please provide a valid email address.', 'error');
    }
  };

  return (
    <footer className="bg-[#111111] text-zinc-300 pt-16 pb-12 border-t border-zinc-800">
      {/* Brand Values / Assurance Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-zinc-800/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[#C5A880] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-widest font-semibold">Complimentary Delivery</h4>
              <p className="text-xs text-zinc-400 mt-1">On all global orders exceeding $200</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[#C5A880] shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-widest font-semibold">30-Day Atelier Returns</h4>
              <p className="text-xs text-zinc-400 mt-1">Hassle-free complimentary returns & exchanges</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[#C5A880] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-widest font-semibold">Artisanal Provenance</h4>
              <p className="text-xs text-zinc-400 mt-1">Sustainably tailored in Italy & Portugal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-[0.25em] text-white">
                AURA
              </span>
              <span className="block text-[8px] uppercase tracking-[0.4em] text-[#C5A880] font-sans font-semibold">
                ATELIER
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Founded on the principles of architectural restraint, pure natural fabrics, and thoughtful longevity. A luxury wardrobe crafted for enduring elegance.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="#instagram" className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#twitter" className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#facebook" className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h5 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link to="/shop?category=Women" className="hover:text-white transition-colors">Women's Ready-To-Wear</Link>
              </li>
              <li>
                <Link to="/shop?category=Men" className="hover:text-white transition-colors">Men's Wardrobe</Link>
              </li>
              <li>
                <Link to="/shop?category=Accessories" className="hover:text-white transition-colors">Fine Leather & Accents</Link>
              </li>
              <li>
                <Link to="/shop?category=Footwear" className="hover:text-white transition-colors">Artisanal Footwear</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">New Arrivals</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-4">
              Client Concierge
            </h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link to="/checkout" className="hover:text-white transition-colors">Shipping & Customs</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">Returns & Exchanges</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">Size Guide & Tailoring</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">Private Appointments</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">Account Portal</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-3">
              The Newsletter
            </h5>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Subscribe to receive exclusive access to private salon previews, seasonal drops, and editorial features.
            </p>
            {isSubscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#C5A880] font-medium bg-zinc-900 p-3 border border-zinc-800">
                <Check className="w-4 h-4 text-[#C5A880]" />
                <span>You are subscribed to the Inner Circle.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 text-xs px-3.5 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-[#C5A880]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-zinc-800 hover:bg-[#C5A880] hover:text-zinc-950 text-white transition-colors text-xs"
                    aria-label="Submit newsletter subscription"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500">
                  By joining, you agree to our Privacy Terms. Unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
        <p>© {new Date().getFullYear()} AURA ATELIER INC. All rights reserved.</p>
        <div className="flex items-center space-x-6">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Cookie Preferences</span>
        </div>
      </div>
    </footer>
  );
}
