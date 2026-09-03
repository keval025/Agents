import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, User, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { products } from '../../data/products';
import { formatPrice } from '../../utils/currency';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const { totalItems, openCartDrawer } = useCart();
  const { totalWishlistItems } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchResults = searchQuery.trim() === ''
    ? []
    : products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Shop All', to: '/shop' },
    { label: 'Women', to: '/shop?category=Women' },
    { label: 'Men', to: '/shop?category=Men' },
    { label: 'Accessories', to: '/shop?category=Accessories' },
    { label: 'Footwear', to: '/shop?category=Footwear' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-zinc-200/80 py-3.5'
            : 'bg-white border-b border-zinc-200 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Mobile hamburger & Desktop Nav Links */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-1.5 text-zinc-800 hover:text-zinc-950 focus:outline-none"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <nav className="hidden lg:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    className={({ isActive }) =>
                      `text-xs uppercase tracking-[0.2em] font-medium transition-colors hover:text-zinc-950 ${
                        isActive ? 'text-zinc-950 font-semibold' : 'text-zinc-500'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Center: Brand Identity */}
            <div className="text-center">
              <Link to="/" className="inline-block group">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-zinc-950 group-hover:opacity-85 transition-opacity">
                  AURA
                </span>
                <span className="block text-[8px] sm:text-[9px] uppercase tracking-[0.45em] text-zinc-400 font-sans font-medium -mt-1">
                  ATELIER
                </span>
              </Link>
            </div>

            {/* Right: Actions (Search, Wishlist, Cart, User) */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-colors"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5 stroke-[1.75]" />
              </button>

              {/* User Account */}
              <Link
                to="/login"
                className="hidden sm:inline-flex p-2 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-colors"
                aria-label="User Account"
              >
                <User className="w-5 h-5 stroke-[1.75]" />
              </Link>

              {/* Wishlist Icon with Counter */}
              <Link
                to="/wishlist"
                className="relative p-2 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-colors"
                aria-label="Saved Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.75]" />
                {totalWishlistItems > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-[#C5A880] rounded-full">
                    {totalWishlistItems}
                  </span>
                )}
              </Link>

              {/* Shopping Bag with Counter */}
              <button
                onClick={openCartDrawer}
                className="relative p-2 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-colors"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-zinc-950 rounded-full animate-scale">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Search Overlay Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
          <div
            className="fixed inset-0"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="relative bg-white w-full max-w-2xl shadow-2xl p-6 sm:p-8 z-10 animate-fade-in border border-zinc-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                Search The Atelier
              </span>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-zinc-400 hover:text-zinc-900 transition-colors p-1"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-4 relative">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-zinc-400 absolute left-3" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product name, category, or brand (e.g., Silk, Blazer, Coat)..."
                  className="w-full pl-11 pr-24 py-3.5 bg-zinc-50 border border-zinc-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                />
                <button
                  type="submit"
                  className="absolute right-2 text-xs uppercase tracking-widest font-semibold px-4 py-2 bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick suggestions or results */}
            {searchResults.length > 0 ? (
              <div className="mt-6">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400 mb-3">
                  Matching Products ({searchResults.length})
                </p>
                <div className="divide-y divide-zinc-100 max-h-72 overflow-y-auto">
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate(`/product/${p.id}`);
                      }}
                      className="py-3 flex items-center gap-4 hover:bg-zinc-50 p-2 cursor-pointer transition-colors"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-12 h-14 object-cover object-center bg-zinc-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-zinc-400 uppercase tracking-wider">{p.brand}</p>
                        <h4 className="text-sm font-medium text-zinc-900 truncate">{p.name}</h4>
                        <span className="text-xs font-semibold text-zinc-900">{formatPrice(p.price)}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-400" />
                    </div>
                  ))}
                </div>
              </div>
            ) : searchQuery.trim() !== '' ? (
              <div className="py-8 text-center text-sm text-zinc-500">
                No items matching "{searchQuery}". Press Enter to view full shop search.
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap gap-2 text-xs">
                <span className="text-zinc-400 text-[11px] self-center mr-2 uppercase tracking-wider">
                  Popular:
                </span>
                {['Silk Dress', 'Cashmere Coat', 'Wide-Leg Trousers', 'Leather Sneaker', 'Mule'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag);
                      navigate(`/shop?search=${encodeURIComponent(tag)}`);
                      setIsSearchOpen(false);
                    }}
                    className="px-3 py-1.5 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors uppercase tracking-wider text-[10px] font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
