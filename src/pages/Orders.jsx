import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ArrowRight, Clock, AlertCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/orderService.js';
import { formatPrice } from '../utils/currency';
import { Button, Loader, EmptyState, Badge } from '../components/common';

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await getUserOrders(user.id);
      if (err) {
        setError(err.message || 'Failed to load order history.');
      } else {
        setOrders(data || []);
      }
    } catch (err) {
      console.error('Error in Orders page:', err);
      setError('An unexpected error occurred while fetching your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <Loader text="Retrieving your order history..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-12 h-12 text-zinc-300 mx-auto" />
        <h2 className="font-serif text-2xl font-medium text-zinc-900">Sign In to View Orders</h2>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto">
          Please sign in to view your order history and track recent purchases.
        </p>
        <Link to="/login?redirect=/orders">
          <Button variant="primary">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-6 mb-8">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block mb-1">
          Account Atelier
        </span>
        <h1 className="font-serif text-3xl font-normal text-zinc-950">
          Your Order History
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          {orders.length} persistent order{orders.length === 1 ? '' : 's'} placed
        </p>
      </div>

      {/* ERROR STATE */}
      {error && (
        <EmptyState
          icon={AlertCircle}
          title="Unable to load order history"
          description={error}
          actionText="Try Again"
          onActionClick={fetchOrders}
        />
      )}

      {/* EMPTY STATE */}
      {!error && orders.length === 0 && (
        <EmptyState
          icon={ShoppingBag}
          title="No Orders Placed Yet"
          description="You have not placed any orders yet. Discover our curated collections and elevate your wardrobe."
          actionText="Explore Collections"
          actionLink="/shop"
        />
      )}

      {/* ORDERS LIST */}
      {!error && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => {
            const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
            const itemCount = order.order_items?.length || 0;

            return (
              <div
                key={order.id}
                className="bg-white border border-zinc-200 p-6 hover:border-zinc-400 transition-all duration-200 space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400 uppercase">ID: {order.id}</span>
                      <span className="text-xs text-zinc-300">•</span>
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        {formattedDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={order.status === 'completed' ? 'gold' : 'dark'}>
                      {order.status}
                    </Badge>
                    <Badge variant={order.payment_status === 'paid' ? 'sale' : 'dark'}>
                      {order.payment_status}
                    </Badge>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-x-auto py-1">
                    {order.order_items?.slice(0, 4).map((item, idx) => {
                      const prod = item.products;
                      const image = prod?.product_images?.[0]?.image_url || prod?.images?.[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80';
                      return (
                        <div key={idx} className="relative w-14 h-16 bg-zinc-100 shrink-0 border border-zinc-200">
                          <img src={image} alt={prod?.name || 'Item'} className="w-full h-full object-cover" />
                        </div>
                      );
                    })}
                    {itemCount > 4 && (
                      <div className="w-14 h-16 bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-semibold text-zinc-500 shrink-0">
                        +{itemCount - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                    <div className="text-left md:text-right">
                      <span className="text-[11px] text-zinc-400 block uppercase tracking-wider">Total</span>
                      <span className="text-lg font-serif font-semibold text-zinc-950">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>

                    <Link to={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm" icon={ArrowRight}>
                        Order Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
