import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import Badge from '../common/Badge';
import { formatPrice } from '../../utils/currency';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import QuickViewModal from './QuickViewModal';

export default function ProductCard({ product, priority = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isSaved = isInWishlist(product.id);
  const hasSecondaryImage = product.images && product.images.length > 1;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes?.[0] || 'One Size', product.colors?.[0], 1);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div
        className="group relative flex flex-col bg-white transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container with 3:4 Ratio */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100">
          <Link to={`/product/${product.id}`} className="block w-full h-full">
            <img
              src={product.images[0]}
              alt={product.name}
              loading={priority ? 'eager' : 'lazy'}
              className={`h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 ${
                hasSecondaryImage && isHovered ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {hasSecondaryImage && (
              <img
                src={product.images[1]}
                alt={`${product.name} alternate angle`}
                className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
            {product.discount > 0 && (
              <Badge variant="sale">-{product.discount}%</Badge>
            )}
            {product.isNew && (
              <Badge variant="dark">New</Badge>
            )}
            {product.isBestSeller && !product.isNew && (
              <Badge variant="gold">Bestseller</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
              isSaved
                ? 'bg-white text-rose-600 shadow-md scale-110'
                : 'bg-white/80 text-zinc-700 hover:bg-white hover:text-zinc-950 shadow-sm'
            }`}
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-200 ${
                isSaved ? 'fill-rose-600 text-rose-600' : ''
              }`}
            />
          </button>

          {/* Quick Actions Hover Overlay */}
          <div className="absolute inset-x-2 bottom-2 z-10 hidden sm:flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleQuickViewClick}
              className="flex-1 bg-white/95 backdrop-blur-sm text-zinc-900 hover:bg-zinc-950 hover:text-white text-[10px] uppercase font-semibold tracking-widest py-2.5 px-2 flex items-center justify-center gap-1.5 shadow-md transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
            <button
              onClick={handleQuickAdd}
              title="Quick add default size to bag"
              className="bg-white/95 backdrop-blur-sm text-zinc-900 hover:bg-[#C5A880] hover:text-zinc-950 p-2.5 shadow-md transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="pt-3 pb-2 flex flex-col flex-grow">
          {/* Brand */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-zinc-400 font-medium">
            <span>{product.brand}</span>
            <span className="text-zinc-400 font-normal">{product.category}</span>
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.id}`}
            className="mt-1 text-sm font-medium text-zinc-800 group-hover:text-zinc-950 transition-colors line-clamp-1"
          >
            {product.name}
          </Link>

          {/* Price & Rating */}
          <div className="mt-1.5 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-zinc-950">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-zinc-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Colors Swatches Dots */}
            {product.colors && product.colors.length > 1 && (
              <div className="flex items-center gap-1">
                {product.colors.slice(0, 3).map((c) => (
                  <span
                    key={c.name}
                    className="w-2.5 h-2.5 rounded-full border border-zinc-300"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="text-[9px] text-zinc-400 font-medium ml-0.5">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Dialog */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
