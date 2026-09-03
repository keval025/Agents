import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Shared Layout and Common Utilities
import { Layout } from './components/layout';
import { ScrollToTop } from './components/common';

// Pages
import {
  Home,
  Shop,
  ProductDetails,
  Cart,
  Wishlist,
  Checkout,
  Login,
  Register,
  ForgotPassword,
  NotFound,
} from './pages';

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <ScrollToTop />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                {/* 404 Fallback Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </ToastProvider>
  );
}