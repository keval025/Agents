import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import RatingStars from './RatingStars';
import { formatPrice } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function QuickViewModal({ product, isOpen, onClose }) {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'One Size');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.brand} maxWidth="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Product Images */}
        <div className="space-y-3">
          <div className="aspect-[3/4] bg-zinc-100 overflow-hidden relative">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.discount > 0 && (
              <div className="absolute top-3 left-3">
                <Badge variant="sale">-{product.discount}%</Badge>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-16 border-2 overflow-hidden transition-all ${
                    activeImageIndex === idx ? 'border-zinc-900' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Controls */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">{product.brand}</p>
              <h2 className="text-xl font-serif font-medium text-zinc-900 mt-1">{product.name}</h2>
            </div>

            <div className="flex items-center gap-3">
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
              <span className="text-xs text-zinc-400">•</span>
              <span className="text-xs text-emerald-700 font-medium">In Stock</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-zinc-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-zinc-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-800">
                  Color: <span className="font-normal text-zinc-500">{selectedColor?.name}</span>
                </span>
                <div className="flex gap-2 mt-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      title={c.name}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        selectedColor?.name === c.name ? 'ring-2 ring-zinc-900 ring-offset-2 border-white' : 'border-zinc-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      aria-label={`Select color ${c.name}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-800">
                  Size: <span className="font-normal text-zinc-500">{selectedSize}</span>
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 text-xs font-medium border transition-all ${
                        selectedSize === s
                          ? 'bg-zinc-950 text-white border-zinc-950'
                          : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-900'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-800">
                Quantity
              </span>
              <div className="flex items-center border border-zinc-200 w-28 mt-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-zinc-600 hover:text-zinc-950"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="flex-1 text-center text-xs font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-zinc-600 hover:text-zinc-950"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-zinc-100 flex flex-col gap-2 mt-6">
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                icon={ShoppingBag}
                onClick={handleAddToCart}
              >
                Add To Bag
              </Button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 border transition-colors ${
                  isSaved
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-zinc-200 hover:border-zinc-900 text-zinc-700'
                }`}
                aria-label="Save to wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="text-center text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-900 font-medium py-1 flex items-center justify-center gap-1.5 mt-1"
            >
              <span>View Full Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
