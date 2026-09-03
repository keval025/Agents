import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Sparkles, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/currency';
import Drawer from '../common/Drawer';
import Button from '../common/Button';

export default function CartDrawer() {
  const {
    cart,
    isCartDrawerOpen,
    closeCartDrawer,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingCost,
    totalItems,
  } = useCart();

  const navigate = useNavigate();

  const freeShippingThreshold = 200;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <Drawer
      isOpen={isCartDrawerOpen}
      onClose={closeCartDrawer}
      title={`Shopping Bag (${totalItems})`}
      position="right"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col h-full justify-between -mx-5 -my-5 sm:-mx-6 sm:-my-6">
        {/* Shipping notice bar */}
        <div className="p-4 bg-zinc-50 border-b border-zinc-200">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-800 mb-1.5">
            {amountNeeded > 0 ? (
              <span>
                Add <strong className="text-zinc-950 font-bold">{formatPrice(amountNeeded)}</strong> for <span className="text-[#C5A880] font-semibold">Free Delivery</span>
              </span>
            ) : (
              <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                Complimentary Shipping Unlocked!
              </span>
            )}
            <span className="text-zinc-400 text-[11px] font-semibold">{progressToFreeShipping}%</span>
          </div>
          <div className="w-full h-1 bg-zinc-200 overflow-hidden">
            <div
              className="h-full bg-zinc-900 transition-all duration-300"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-zinc-100">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto">
                <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h4 className="font-serif text-lg font-medium text-zinc-900">Your Bag is Empty</h4>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Discover pieces from our latest Autumn / Winter atelier edit.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    closeCartDrawer();
                    navigate('/shop');
                  }}
                  className="px-5 py-2.5 bg-zinc-950 text-white text-xs uppercase tracking-widest font-semibold hover:bg-zinc-800 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartItemId} className="py-4 flex gap-4 first:pt-0">
                <Link
                  to={`/product/${item.product.id}`}
                  onClick={closeCartDrawer}
                  className="w-16 h-20 bg-zinc-100 shrink-0 overflow-hidden"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">{item.product.brand}</p>
                      <h5 className="text-xs font-medium text-zinc-900 truncate">
                        <Link to={`/product/${item.product.id}`} onClick={closeCartDrawer}>
                          {item.product.name}
                        </Link>
                      </h5>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-500">
                    {item.selectedSize} • {item.selectedColor.name}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-zinc-200">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-zinc-950 text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-zinc-950 text-xs"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-semibold text-zinc-950">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer summary and actions */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-6 bg-zinc-50 border-t border-zinc-200 space-y-3">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-zinc-600">Subtotal</span>
              <span className="font-semibold text-zinc-950 font-serif text-base">{formatPrice(subtotal)}</span>
            </div>

            <p className="text-[10px] text-zinc-400">
              Taxes and international shipping calculated at checkout.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  closeCartDrawer();
                  navigate('/checkout');
                }}
                className="w-full bg-zinc-950 text-white py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  closeCartDrawer();
                  navigate('/cart');
                }}
                className="w-full bg-white text-zinc-900 border border-zinc-300 py-3 text-xs uppercase tracking-widest font-semibold hover:border-zinc-950 transition-colors"
              >
                View Full Bag
              </button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}