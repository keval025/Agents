import React, { createContext, useContext, useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useLocalStorage('aura_cart', []);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscountPercent, setPromoDiscountPercent] = useState(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const { addToast } = useToast();

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const addToCart = (product, selectedSize, selectedColor, quantity = 1, openDrawer = true) => {
    const size = selectedSize || (product.sizes && product.sizes[0]) || 'One Size';
    const color = selectedColor || (product.colors && product.colors[0]) || { name: 'Standard', hex: '#000000' };
    const cartItemId = `${product.id}-${size}-${color.name}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            product,
            selectedSize: size,
            selectedColor: color,
            quantity,
            unitPrice: product.price,
          },
        ];
      }
    });

    addToast(`Added "${product.name}" (${size}) to your bag.`);
    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => {
      const item = prev.find((i) => i.cartItemId === cartItemId);
      if (item) {
        addToast(`Removed "${item.product.name}" from your bag.`, 'info');
      }
      return prev.filter((i) => i.cartItemId !== cartItemId);
    });
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
    setPromoDiscountPercent(0);
  };

  const applyPromo = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'AURA15' || cleanCode === 'WELCOME15') {
      setPromoCode(cleanCode);
      setPromoDiscountPercent(15);
      addToast('Promo code applied: 15% discount!', 'success');
      return { success: true, message: '15% discount applied!' };
    } else if (cleanCode === 'VIP20') {
      setPromoCode(cleanCode);
      setPromoDiscountPercent(20);
      addToast('VIP Promo code applied: 20% discount!', 'success');
      return { success: true, message: '20% discount applied!' };
    } else {
      addToast('Invalid promotional code. Try "AURA15" or "VIP20".', 'error');
      return { success: false, message: 'Invalid promotional code.' };
    }
  };

  const removePromo = () => {
    setPromoCode('');
    setPromoDiscountPercent(0);
    addToast('Promotional code removed.', 'info');
  };

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return (subtotal * promoDiscountPercent) / 100;
  }, [subtotal, promoDiscountPercent]);

  // Free standard shipping on orders over $200
  const shippingCost = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= 200 ? 0 : 15;
  }, [subtotal]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingCost);
  }, [subtotal, discountAmount, shippingCost]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        promoCode,
        promoDiscountPercent,
        applyPromo,
        removePromo,
        subtotal,
        discountAmount,
        shippingCost,
        total,
        totalItems,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}