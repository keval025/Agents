import insforge from '../lib/insforge.js';

/**
 * Validates stock levels and recalculates trusted prices from the live database
 */
export async function validateCartStockAndPrices(cartItems = []) {
  if (!cartItems || cartItems.length === 0) {
    return {
      isValid: false,
      error: 'Your cart is empty.',
      trustedCart: [],
      trustedSubtotal: 0,
    };
  }

  const trustedCart = [];
  let trustedSubtotal = 0;

  for (const item of cartItems) {
    const productId = item.product?.id || item.productId;

    if (!productId) {
      return {
        isValid: false,
        error: 'Invalid product item in cart.',
        trustedCart: [],
        trustedSubtotal: 0,
      };
    }

    // Fetch live product from DB
    const { data: dbProduct, error: prodErr } = await insforge.database
      .from('products')
      .select('*')
      .eq('id', productId)
      .maybeSingle();

    if (prodErr || !dbProduct) {
      return {
        isValid: false,
        error: `Product "${item.product?.name || 'Unknown'}" is no longer available in our catalog.`,
        trustedCart: [],
        trustedSubtotal: 0,
      };
    }

    // Fetch variant if variant details present
    let variantId = null;
    let availableStock = Number(dbProduct.stock_quantity || 0);

    if (item.selectedSize || item.selectedColor?.name) {
      const { data: variants } = await insforge.database
        .from('product_variants')
        .select('*')
        .eq('product_id', productId);

      if (variants && variants.length > 0) {
        const matched = variants.find(
          (v) =>
            (item.selectedSize ? v.size === item.selectedSize : true) &&
            (item.selectedColor?.name ? v.color === item.selectedColor.name : true)
        );

        if (matched) {
          variantId = matched.id;
          availableStock = Number(matched.stock_quantity || 0);
        }
      }
    }

    // Check stock quantity
    if (availableStock < item.quantity) {
      return {
        isValid: false,
        error: `Insufficient stock for "${dbProduct.name}" (${item.selectedSize || 'Standard'}). Available: ${availableStock}, requested: ${item.quantity}.`,
        trustedCart: [],
        trustedSubtotal: 0,
      };
    }

    const trustedUnitPrice = Number(dbProduct.price);
    const itemTotal = trustedUnitPrice * item.quantity;
    trustedSubtotal += itemTotal;

    trustedCart.push({
      ...item,
      product: dbProduct,
      variantId,
      trustedUnitPrice,
      itemTotal,
      productStock: Number(dbProduct.stock_quantity || 0),
      variantStock: availableStock,
    });
  }

  return {
    isValid: true,
    error: null,
    trustedCart,
    trustedSubtotal,
  };
}

/**
 * Creates a persistent order in InsForge database
 */
export async function createOrder({
  userId,
  shippingAddress,
  deliveryMethod = 'standard',
  paymentMethod = 'credit_card',
  cartItems = [],
  discountAmount = 0,
}) {
  if (!userId) {
    return { success: false, error: 'User must be authenticated to place an order.' };
  }

  // 1. Validate stock and trusted prices from live DB
  const validation = await validateCartStockAndPrices(cartItems);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  const { trustedCart, trustedSubtotal } = validation;

  // Calculate totals
  const shippingCost = deliveryMethod === 'express' ? 25 : trustedSubtotal >= 200 ? 0 : 15;
  const grandTotal = Math.max(0, trustedSubtotal - discountAmount + shippingCost);

  // 2. Insert order record
  try {
    const { data: orderData, error: orderErr } = await insforge.database
      .from('orders')
      .insert([
        {
          user_id: userId,
          status: 'processing',
          subtotal: trustedSubtotal,
          shipping_cost: shippingCost,
          total_amount: grandTotal,
          payment_status: 'paid',
          payment_method: paymentMethod,
          shipping_address: shippingAddress,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (orderErr || !orderData) {
      console.error('Order table insert error:', orderErr);
      return { success: false, error: orderErr?.message || 'Failed to create order.' };
    }

    // 3. Insert order items
    const itemsPayload = trustedCart.map((item) => ({
      order_id: orderData.id,
      product_id: item.product.id,
      variant_id: item.variantId || null,
      quantity: item.quantity,
      price: item.trustedUnitPrice,
    }));

    const { data: itemsData, error: itemsErr } = await insforge.database
      .from('order_items')
      .insert(itemsPayload)
      .select();

    if (itemsErr) {
      console.error('Order items insert error:', itemsErr);
      // Clean up order header on item failure
      await insforge.database.from('orders').delete().eq('id', orderData.id);
      return { success: false, error: 'Failed to record order line items.' };
    }

    // 4. Update inventory stock
    for (const item of trustedCart) {
      try {
        if (item.variantId) {
          const newVarStock = Math.max(0, item.variantStock - item.quantity);
          await insforge.database
            .from('product_variants')
            .update({ stock_quantity: newVarStock })
            .eq('id', item.variantId);
        }

        const newProdStock = Math.max(0, item.productStock - item.quantity);
        await insforge.database
          .from('products')
          .update({ stock_quantity: newProdStock })
          .eq('id', item.product.id);
      } catch (stockErr) {
        console.warn('Inventory stock update notice:', stockErr);
      }
    }

    return {
      success: true,
      order: orderData,
      orderItems: itemsData,
    };
  } catch (err) {
    console.error('Unexpected error during order creation:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

/**
 * Fetches order history for a specific user
 */
export async function getUserOrders(userId) {
  if (!userId) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await insforge.database
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(
            *,
            product_images(*)
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      return { data: [], error };
    }

    return { data: data || [], error: null };
  } catch (err) {
    console.error('Unexpected error fetching user orders:', err);
    return { data: [], error: err };
  }
}

/**
 * Fetches detailed info for a single order, strictly scope-checked by user_id
 */
export async function getOrderDetails(orderId, userId) {
  if (!orderId || !userId) {
    return { data: null, error: new Error('Order ID and User ID are required.') };
  }

  try {
    const { data, error } = await insforge.database
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products(
            *,
            product_images(*)
          )
        )
      `)
      .eq('id', orderId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      return { data: null, error: error || new Error('Order not found or unauthorized.') };
    }

    return { data, error: null };
  } catch (err) {
    console.error(`Error fetching order details for order ${orderId}:`, err);
    return { data: null, error: err };
  }
}
