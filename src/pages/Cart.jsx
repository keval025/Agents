import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    shippingCost,
    total,
    promoCode,
    promoDiscountPercent,
    applyPromo,
    removePromo,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyPromo(inputCoupon.trim());
      setInputCoupon('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Bag is Empty"
          description="You haven't added any luxury pieces to your atelier bag yet. Explore our curated collections to begin."
          actionText="Explore Collections"
          actionLink="/shop"
        />
      </div>
    );
  }

  const freeShippingThreshold = 200;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-zinc-950 tracking-tight">
          Shopping Bag
        </h1>
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
          {cart.reduce((total, i) => total + i.quantity, 0)} Items Selected
        </span>
      </div>

      {/* Free Shipping Progress Bar */}
      <div className="mb-8 p-4 bg-zinc-50 border border-zinc-200">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-800 mb-2">
          {amountNeeded > 0 ? (
            <span>
              Add <strong className="text-zinc-950 font-bold">{formatPrice(amountNeeded)}</strong> more to unlock <strong className="text-[#C5A880]">Complimentary Worldwide Shipping</strong>
            </span>
          ) : (
            <span className="text-emerald-700 flex items-center gap-1 font-semibold">
              <Sparkles className="w-4 h-4 text-[#C5A880]" />
              You have qualified for Complimentary Worldwide Shipping!
            </span>
          )}
          <span className="text-zinc-400 font-semibold">{progressToFreeShipping}%</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-200 overflow-hidden">
          <div
            className="h-full bg-zinc-900 transition-all duration-500 ease-out"
            style={{ width: `${progressToFreeShipping}%` }}
          />
        </div>
      </div>

      {/* Main 2-column Grid: Items + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Cart Items (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="border-b border-zinc-200 pb-2 hidden sm:grid grid-cols-12 text-[11px] uppercase tracking-widest text-zinc-400 font-semibold">
            <span className="col-span-6">Product</span>
            <span className="col-span-2 text-center">Price</span>
            <span className="col-span-2 text-center">Quantity</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          <div className="divide-y divide-zinc-200">
            {cart.map((item) => {
              const itemTotal = item.unitPrice * item.quantity;
              return (
                <div
                  key={item.cartItemId}
                  className="py-6 flex flex-col sm:grid sm:grid-cols-12 items-center gap-4 sm:gap-2"
                >
                  {/* Product Details (6 cols) */}
                  <div className="col-span-6 flex items-center gap-4 w-full">
                    <Link
                      to={`/product/${item.product.id}`}
                      className="w-20 sm:w-24 aspect-[3/4] bg-zinc-100 shrink-0 overflow-hidden"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </Link>
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
                        {item.product.brand}
                      </span>
                      <h4 className="text-sm font-medium text-zinc-900 hover:text-zinc-700">
                        <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span>Size: <strong className="text-zinc-800 font-semibold">{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          Color:
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-zinc-300 inline-block"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <strong className="text-zinc-800 font-semibold">{item.selectedColor.name}</strong>
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-[11px] text-zinc-400 hover:text-rose-600 transition-colors pt-2 flex items-center gap-1 sm:hidden"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Unit Price (2 cols) */}
                  <div className="col-span-2 text-center hidden sm:block">
                    <span className="text-sm font-medium text-zinc-900">
                      {formatPrice(item.unitPrice)}
                    </span>
                  </div>

                  {/* Quantity modifier (2 cols) */}
                  <div className="col-span-2 flex items-center justify-between sm:justify-center w-full sm:w-auto">
                    <span className="sm:hidden text-xs text-zinc-500">Quantity:</span>
                    <div className="flex items-center border border-zinc-200">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-zinc-950 text-sm font-medium hover:bg-zinc-50"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-zinc-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-zinc-950 text-sm font-medium hover:bg-zinc-50"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total & Desktop Remove (2 cols) */}
                  <div className="col-span-2 flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <span className="sm:hidden text-xs text-zinc-500">Total:</span>
                    <span className="text-sm font-semibold text-zinc-950">
                      {formatPrice(itemTotal)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-zinc-400 hover:text-rose-600 transition-colors p-1 hidden sm:inline-block"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Back to Shop Link */}
          <div className="pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Card (4 columns) */}
        <div className="lg:col-span-4 bg-zinc-50 border border-zinc-200 p-6 sm:p-8 sticky top-28 space-y-6">
          <h3 className="font-serif text-lg font-medium text-zinc-950 border-b border-zinc-200 pb-3">
            Order Summary
          </h3>

          {/* Coupon Code Box */}
          <div>
            <label className="text-[11px] uppercase tracking-widest font-semibold text-zinc-700 block mb-2">
              Promotional Code
            </label>
            {promoCode ? (
              <div className="flex items-center justify-between p-2.5 bg-white border border-emerald-300 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-medium">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{promoCode} ({promoDiscountPercent}% off)</span>
                </div>
                <button
                  onClick={removePromo}
                  className="text-zinc-400 hover:text-rose-600 text-xs underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  placeholder="e.g. AURA15 or VIP20"
                  className="flex-1 bg-white border border-zinc-300 text-xs px-3 py-2.5 uppercase focus:outline-none focus:border-zinc-950"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-zinc-900 text-white hover:bg-zinc-800 text-xs uppercase tracking-wider font-semibold"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Calculation breakdown */}
          <div className="space-y-3 text-xs text-zinc-600 border-t border-zinc-200 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-zinc-900">{formatPrice(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount ({promoCode})</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span>Shipping Estimate</span>
              <span className="font-semibold text-zinc-900">
                {shippingCost === 0 ? (
                  <span className="text-emerald-700 uppercase tracking-wider text-[11px] font-bold">Complimentary</span>
                ) : (
                  formatPrice(shippingCost)
                )}
              </span>
            </div>

            <div className="border-t border-zinc-200 pt-4 flex justify-between items-baseline text-zinc-950">
              <span className="font-serif text-base font-medium">Estimated Total</span>
              <span className="font-serif text-2xl font-bold">{formatPrice(total)}</span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-tight">
              Taxes and duties included where applicable. Worldwide express courier options selectable at checkout.
            </p>
          </div>

          {/* Checkout CTA Button */}
          <Link to="/checkout" className="block">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              icon={ArrowRight}
              className="py-4 shadow-md"
            >
              Proceed to Checkout
            </Button>
          </Link>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted SSL 256-Bit Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
