import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist, moveToCart } = useWishlist();
  const { addToCart } = useCart();

  const handleAddAllToCart = () => {
    wishlist.forEach((product) => {
      addToCart(product, product.sizes?.[0] || 'One Size', product.colors?.[0], 1);
    });
    clearWishlist();
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Save timeless designs you love to your personal wishlist by clicking the heart icon on any product."
          actionText="Discover Collection"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-zinc-950 tracking-tight">
            Saved Pieces
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved in your atelier wishlist
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddAllToCart}
            icon={ShoppingBag}
          >
            Move All To Bag
          </Button>
          <button
            onClick={clearWishlist}
            className="text-xs uppercase tracking-wider text-zinc-400 hover:text-rose-600 font-medium transition-colors"
          >
            Clear Wishlist
          </button>
        </div>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="group flex flex-col bg-white border border-zinc-200/80 p-3 transition-all hover:shadow-soft"
          >
            {/* Image Box */}
            <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 right-2 p-1.5 bg-white/90 text-zinc-400 hover:text-rose-600 rounded-full shadow-sm transition-colors"
                title="Remove from saved"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="pt-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold block">
                  {product.brand}
                </span>
                <h4 className="text-xs sm:text-sm font-medium text-zinc-900 mt-1 line-clamp-1">
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h4>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-zinc-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-zinc-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Move to Bag Button */}
              <div className="mt-4 pt-3 border-t border-zinc-100">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  icon={ShoppingBag}
                  onClick={() => moveToCart(product, product.sizes?.[0] || 'One Size', product.colors?.[0])}
                >
                  Move to Bag
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
