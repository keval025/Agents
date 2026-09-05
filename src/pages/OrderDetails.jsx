import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ShieldCheck, Truck, CreditCard, Package, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getOrderDetails } from '../services/orderService.js';
import { formatPrice } from '../utils/currency';
import { Button, Loader, EmptyState, Breadcrumbs, Badge } from '../components/common';

export default function OrderDetails() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = async () => {
    if (!user || !id) return;
    setLoading(true);
    setError(null);

    try {
      const { data, error: err } = await getOrderDetails(id, user.id);
      if (err || !data) {
        setError(err?.message || 'Order not found or unauthorized access.');
      } else {
        setOrder(data);
      }
    } catch (err) {
      console.error(`Error fetching order ${id}:`, err);
      setError('An unexpected error occurred while loading order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDetails();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [id, user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <Loader text="Loading order details..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-12 h-12 text-zinc-300 mx-auto" />
        <h2 className="font-serif text-2xl font-medium text-zinc-900">Sign In Required</h2>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto">
          Please sign in to your account to view this order.
        </p>
        <Link to={`/login?redirect=/orders/${id}`}>
          <Button variant="primary">Sign In</Button>
        </Link>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <EmptyState
          icon={AlertCircle}
          title="Order Not Found"
          description={error || 'This order does not exist or you do not have permission to access it.'}
          actionText="Back to My Orders"
          actionLink="/orders"
        />
      </div>
    );
  }

  const addr = order.shipping_address || {};
  const formattedDate = new Date(order.created_at).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-100 text-xs">
        <Breadcrumbs
          items={[
            { label: 'My Orders', to: '/orders' },
            { label: `Order #${order.id.slice(0, 8)}` },
          ]}
        />
        <Link to="/orders" className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>
      </div>

      {/* Main Order Header */}
      <div className="bg-zinc-900 text-white p-6 sm:p-10 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-semibold block mb-1">
              Atelier Order Receipt
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight">
              Order Details
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-1">ID: {order.id}</p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="gold">{order.status}</Badge>
            <Badge variant="sale">{order.payment_status}</Badge>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex items-center gap-2 text-xs text-zinc-400">
          <Clock className="w-4 h-4 text-[#C5A880]" />
          <span>Placed on {formattedDate}</span>
        </div>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Ordered Items (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-serif text-xl font-medium text-zinc-900 border-b border-zinc-200 pb-3">
            Purchased Items ({order.order_items?.length || 0})
          </h3>

          <div className="divide-y divide-zinc-200 bg-white border border-zinc-200">
            {order.order_items?.map((item) => {
              const prod = item.products || {};
              const images = prod.product_images || [];
              const imageUrl = images[0]?.image_url || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80';

              return (
                <div key={item.id} className="p-4 sm:p-5 flex items-center gap-4">
                  <Link to={`/product/${prod.id || item.product_id}`} className="shrink-0">
                    <img
                      src={imageUrl}
                      alt={prod.name || 'Item'}
                      className="w-16 h-20 object-cover bg-zinc-100 border border-zinc-200 hover:opacity-90 transition-opacity"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                      {prod.brand || 'AURA STUDIO'}
                    </p>
                    <Link
                      to={`/product/${prod.id || item.product_id}`}
                      className="text-sm font-medium text-zinc-900 hover:underline line-clamp-1"
                    >
                      {prod.name || 'Atelier Garment'}
                    </Link>
                    <p className="text-xs text-zinc-500 mt-1">
                      Quantity: <span className="font-semibold text-zinc-900">{item.quantity}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-semibold text-zinc-950 block">
                      {formatPrice((item.price || prod.price || 0) * item.quantity)}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {formatPrice(item.price || prod.price || 0)} each
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Address & Financial Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Shipping Address Box */}
          <div className="bg-zinc-50 border border-zinc-200 p-6 space-y-3">
            <h4 className="font-serif text-base font-semibold text-zinc-900 flex items-center gap-2 border-b border-zinc-200 pb-2">
              <Truck className="w-4 h-4 text-[#C5A880]" />
              Shipping Destination
            </h4>
            <div className="text-xs text-zinc-600 space-y-1 leading-relaxed">
              <p className="font-semibold text-zinc-900">{addr.firstName} {addr.lastName}</p>
              <p>{addr.address} {addr.apartment ? `, ${addr.apartment}` : ''}</p>
              <p>{addr.city}, {addr.state} {addr.postalCode}</p>
              <p>{addr.country}</p>
              {addr.phone && <p className="pt-1 text-zinc-500">Phone: {addr.phone}</p>}
              {addr.email && <p className="text-zinc-500">Email: {addr.email}</p>}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-zinc-50 border border-zinc-200 p-6 space-y-4">
            <h4 className="font-serif text-base font-semibold text-zinc-900 border-b border-zinc-200 pb-2">
              Payment Summary
            </h4>

            <div className="space-y-2 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-zinc-900">
                  {order.shipping_cost === 0 ? 'COMPLIMENTARY' : formatPrice(order.shipping_cost)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Payment Method</span>
                <span className="font-medium text-zinc-900 uppercase">{order.payment_method}</span>
              </div>
              <div className="border-t border-zinc-200 pt-3 flex justify-between items-baseline text-zinc-950">
                <span className="font-serif text-base font-semibold">Total Paid</span>
                <span className="font-serif text-2xl font-bold">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
