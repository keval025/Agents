import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Lock, CheckCircle2, ArrowRight, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService.js';
import { formatPrice } from '../utils/currency';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

export default function Checkout() {
  const { cart, subtotal, discountAmount, shippingCost, clearCart } = useCart();
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form States
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  const [deliveryMethod, setDeliveryMethod] = useState('standard'); // standard, express
  const [paymentMethod, setPaymentMethod] = useState('card'); // card, applepay, cod
  const [cardDetails, setCardDetails] = useState({
    number: '•••• •••• •••• 4242',
    name: '',
    expiry: '12/28',
    cvv: '888',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Sync logged in user profile defaults
  useEffect(() => {
    if (user) {
      const nameParts = (profile?.full_name || '').split(' ');
      setFormData((prev) => ({
        ...prev,
        email: user.email || '',
        firstName: prev.firstName || nameParts[0] || '',
        lastName: prev.lastName || nameParts.slice(1).join(' ') || '',
      }));
      setCardDetails((prev) => ({
        ...prev,
        name: prev.name || profile?.full_name || 'Valued Atelier Client',
      }));
    }
  }, [user, profile]);

  // Shipping calculation
  const expressFee = deliveryMethod === 'express' ? 25 : 0;
  const effectiveShipping = deliveryMethod === 'express' ? 25 : (subtotal >= 200 ? 0 : 15);
  const grandTotal = Math.max(0, subtotal - discountAmount + effectiveShipping);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }

    if (cart.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    setIsProcessing(true);
    setCheckoutError(null);

    const shippingAddressPayload = {
      email: formData.email,
      phone: formData.phone,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      apartment: formData.apartment,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country,
    };

    const res = await createOrder({
      userId: user.id,
      shippingAddress: shippingAddressPayload,
      deliveryMethod,
      paymentMethod,
      cartItems: cart,
      discountAmount,
    });

    setIsProcessing(false);

    if (!res.success) {
      // Order creation failed: preserve cart, display error message
      setCheckoutError(res.error || 'Failed to process order. Please try again.');
      return;
    }

    // Order creation succeeded: clear cart only after confirmation
    setPlacedOrder(res.order);
    clearCart();
  };

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-zinc-500 uppercase tracking-widest font-medium">
        Verifying secure session...
      </div>
    );
  }

  // 1. Requirement: Authenticated users only
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <Lock className="w-12 h-12 text-[#C5A880] mx-auto" />
        <h2 className="font-serif text-2xl font-medium text-zinc-900">Sign In Required for Checkout</h2>
        <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
          Please sign in to your Atelier account to complete your secure purchase and save order history.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link to={`/login?redirect=${encodeURIComponent(location.pathname)}`}>
            <Button variant="primary" size="md">Sign In to Continue</Button>
          </Link>
          <Link to={`/register?redirect=${encodeURIComponent(location.pathname)}`}>
            <Button variant="outline" size="md">Create Account</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 2. Requirement: Prevent checkout with empty cart
  if (cart.length === 0 && !placedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-medium text-zinc-900 mb-2">Nothing to Checkout</h2>
        <p className="text-sm text-zinc-500 mb-6">Your shopping bag is currently empty.</p>
        <Link to="/shop">
          <Button variant="primary">Browse Collections</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Checkout Breadcrumb */}
      <div className="border-b border-zinc-200 pb-6 mb-8">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block mb-1">
          Secure Atelier Checkout
        </span>
        <h1 className="font-serif text-3xl font-normal text-zinc-950">
          Order Finalization
        </h1>
      </div>

      {/* Checkout Failure Error Banner */}
      {checkoutError && (
        <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3 rounded-none">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold uppercase tracking-wider text-[11px]">Checkout Could Not Be Completed</p>
            <p className="mt-0.5">{checkoutError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form Details (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Step 1: Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-medium text-zinc-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-center font-sans">
                    1
                  </span>
                  Contact Information
                </h3>
                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated Account
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 bg-white border border-zinc-300 focus:outline-none focus:border-zinc-950"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-700 block mb-1">Phone (for courier updates)</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 bg-white border border-zinc-300 focus:outline-none focus:border-zinc-950"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="space-y-4 pt-6 border-t border-zinc-200">
              <h3 className="font-serif text-lg font-medium text-zinc-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-center font-sans">
                  2
                </span>
                Shipping Destination
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-700 block mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 bg-white border border-zinc-300 focus:outline-none focus:border-zinc-950"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 bg-white border border-zinc-300 focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-zinc-700 block mb-1">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 bg-white border border-zinc-300 focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-700 block mb-1">Apartment, Suite, Unit</label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 bg-white border border-zinc-300 focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-700 block mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 bg-white border border-zinc-300 focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-700 block mb-1">State / Province</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 bg-white border border-zinc-300 focus:outline-none focus:border-zinc-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-700 block mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 bg-white border border-zinc-300 focus:outline-none focus:border-zinc-950"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Delivery Options */}
            <div className="space-y-4 pt-6 border-t border-zinc-200">
              <h3 className="font-serif text-lg font-medium text-zinc-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-center font-sans">
                  3
                </span>
                Delivery Method
              </h3>

              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                  deliveryMethod === 'standard' ? 'border-zinc-950 bg-zinc-50/70 ring-1 ring-zinc-950' : 'border-zinc-200 hover:border-zinc-400'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'standard'}
                      onChange={() => setDeliveryMethod('standard')}
                      className="accent-zinc-950"
                    />
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Standard Atelier Delivery</p>
                      <p className="text-xs text-zinc-500">Delivered within 3-5 business days via carbon-neutral courier</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-zinc-900">
                    {subtotal >= 200 ? 'COMPLIMENTARY' : '$15.00'}
                  </span>
                </label>

                <label className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
                  deliveryMethod === 'express' ? 'border-zinc-950 bg-zinc-50/70 ring-1 ring-zinc-950' : 'border-zinc-200 hover:border-zinc-400'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'express'}
                      onChange={() => setDeliveryMethod('express')}
                      className="accent-zinc-950"
                    />
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Express Priority Air</p>
                      <p className="text-xs text-zinc-500">Guaranteed next-day or 2-day delivery with signature release</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-zinc-900">
                    $25.00
                  </span>
                </label>
              </div>
            </div>

            {/* Step 4: Payment Simulation */}
            <div className="space-y-4 pt-6 border-t border-zinc-200">
              <h3 className="font-serif text-lg font-medium text-zinc-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-center font-sans">
                  4
                </span>
                Payment Method
              </h3>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 text-xs font-semibold uppercase tracking-wider border text-center transition-all ${
                    paymentMethod === 'card' ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-white text-zinc-700 border-zinc-200'
                  }`}
                >
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('applepay')}
                  className={`p-3 text-xs font-semibold uppercase tracking-wider border text-center transition-all ${
                    paymentMethod === 'applepay' ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-white text-zinc-700 border-zinc-200'
                  }`}
                >
                  Apple Pay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 text-xs font-semibold uppercase tracking-wider border text-center transition-all ${
                    paymentMethod === 'cod' ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-white text-zinc-700 border-zinc-200'
                  }`}
                >
                  Cash on Delivery
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4 p-4 bg-zinc-50 border border-zinc-200">
                  <div className="flex items-center justify-between text-xs text-zinc-500 pb-2 border-b border-zinc-200">
                    <span className="flex items-center gap-1.5 font-medium text-zinc-800">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      Mock Secure Card Sandbox
                    </span>
                    <span>Visa / MasterCard / Amex</span>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-700 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="w-full text-xs p-3 bg-white border border-zinc-300 focus:outline-none focus:border-zinc-950"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-700 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full text-xs p-3 bg-white border border-zinc-300 focus:outline-none focus:border-zinc-950"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-zinc-700 block mb-1">Expiration (MM/YY)</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full text-xs p-3 bg-white border border-zinc-300 focus:outline-none focus:border-zinc-950"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-700 block mb-1">CVC / CVV</label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full text-xs p-3 bg-white border border-zinc-300 focus:outline-none focus:border-zinc-950"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'applepay' && (
                <div className="p-6 bg-zinc-900 text-white text-center rounded-none space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-300">Apple Pay Express Checkout</p>
                  <p className="text-xs text-zinc-400">Your Apple device will prompt TouchID or FaceID upon clicking "Place Order".</p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  Pay securely with exact cash upon hand-delivery by our certified courier.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Order Summary (5 cols) */}
          <div className="lg:col-span-5 bg-zinc-50 border border-zinc-200 p-6 sm:p-8 sticky top-28 space-y-6">
            <h3 className="font-serif text-lg font-medium text-zinc-950 border-b border-zinc-200 pb-3">
              Order Summary ({cart.length} items)
            </h3>

            {/* Thumbnail items review */}
            <div className="divide-y divide-zinc-200 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.cartItemId} className="py-3 flex items-center gap-3 text-xs">
                  <img
                    src={item.product?.images?.[0]}
                    alt={item.product?.name}
                    className="w-12 h-14 object-cover bg-zinc-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-zinc-900 truncate">{item.product?.name}</h5>
                    <p className="text-zinc-500 text-[11px]">
                      {item.selectedSize} • {item.selectedColor?.name || 'Standard'} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-zinc-900">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 text-xs text-zinc-600 border-t border-zinc-200 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promotional Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping ({deliveryMethod === 'express' ? 'Express' : 'Standard'})</span>
                <span className="font-semibold text-zinc-900">
                  {effectiveShipping === 0 ? (
                    <span className="text-emerald-700 uppercase tracking-wider font-bold">Complimentary</span>
                  ) : (
                    formatPrice(effectiveShipping)
                  )}
                </span>
              </div>

              <div className="border-t border-zinc-200 pt-4 flex justify-between items-baseline text-zinc-950">
                <span className="font-serif text-base font-semibold">Total</span>
                <span className="font-serif text-2xl font-bold">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isProcessing}
              className="py-4 shadow-md"
            >
              {isProcessing ? 'Validating Stock & Authorizing Order...' : `Place Order • ${formatPrice(grandTotal)}`}
            </Button>

            <div className="text-center">
              <p className="text-[10px] text-zinc-400">
                By placing this order you acknowledge our Atelier terms and 30-day return policy.
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Order Complete Modal */}
      <Modal
        isOpen={Boolean(placedOrder)}
        onClose={() => {
          if (placedOrder) {
            navigate(`/orders/${placedOrder.id}`);
          }
        }}
        title="Order Confirmed & Saved"
      >
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9 stroke-[1.5]" />
          </div>

          <h3 className="font-serif text-2xl font-medium text-zinc-900">
            Thank you for your order, {formData.firstName}.
          </h3>

          <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Your order has been recorded in our InsForge database. Reference ID: <strong className="text-zinc-950 font-mono">{placedOrder?.id}</strong>.
          </p>

          <div className="p-4 bg-zinc-50 border border-zinc-200 text-xs text-left space-y-2 max-w-sm mx-auto">
            <div className="flex justify-between">
              <span className="text-zinc-500">Order Status:</span>
              <span className="font-semibold text-emerald-700 uppercase tracking-wider">{placedOrder?.status || 'Processing'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Total Charged:</span>
              <span className="font-semibold text-zinc-900">{placedOrder && formatPrice(placedOrder.total_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Delivery:</span>
              <span className="font-medium text-zinc-900">
                {deliveryMethod === 'express' ? '1-2 Business Days' : '3-5 Business Days'}
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/orders/${placedOrder.id}`)}
            >
              View Order Details
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/orders')}
            >
              All Order History
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
