import insforge from '../lib/insforge.js';
import { products as fallbackProducts } from '../data/products.js';

// Helper color map for standard color names
const COLOR_HEX_MAP = {
  'Champagne': '#E8D8C8',
  'Midnight Black': '#18181B',
  'Olive Moss': '#556B2F',
  'Camel': '#C19A6B',
  'Charcoal': '#36454F',
  'Ecru': '#F3EFE0',
  'Pinstripe Navy': '#1A2530',
  'Onyx Black': '#111111',
  'Sandstone': '#D7C9B1',
  'Graphite': '#2C2C2C',
  'Chalk White': '#FAF9F6',
  'Ivory': '#FFFFF0',
  'Espresso': '#3B2F2F',
  'Sage': '#9CAF88',
  'Terracotta': '#E2725B',
  'Warm Linen': '#E9DCC9',
  'Charcoal Melange': '#3A3D40',
  'Deep Camel': '#9E7B54',
  'Pitch Black': '#111111',
  'Washed Olive': '#556B2F',
  'Khaki Tan': '#C3B091',
  'Slate Blue': '#4A6B82',
  'Ecru Flax': '#E5DEC9',
  'Navy Ink': '#1C2833',
  'Olive Ash': '#708238',
  'Optic White': '#FFFFFF',
  'Mineral Black': '#1F1F1F',
  'Heather Grey': '#D3D3D3',
  'Mocha': '#6F4E37',
  'Oatmeal': '#D2B48C',
  'Deep Forest': '#1E3F20',
  'Midnight Navy': '#101820',
  'Stone Beige': '#D2C29D',
  'Cognac Brown': '#9A3324',
  'Pure Noir': '#111111',
  'Alabaster Cream': '#EDE6D6',
  '18k Yellow Gold': '#D4AF37',
  'Sterling Silver': '#C0C0C0',
  'Graphite Gray': '#4A4A4A',
  'Oat Milk': '#E8DFC5',
  'Tortoiseshell': '#8B4513',
  'Gloss Black': '#000000',
  'Honey Amber': '#FFBF00',
  'Rich Walnut': '#5C4033',
  'Blackened Steel': '#1A1A1A',
  'Sand': '#C2B280',
  'Midnight': '#1C1C1C',
  'Forest': '#228B22',
  'Black': '#111111',
  'White': '#FFFFFF',
};

export function getColorHex(colorName) {
  if (!colorName) return '#A1A1AA';
  return COLOR_HEX_MAP[colorName] || '#A1A1AA';
}

/**
 * Transforms raw database row into normalized Product object expected by components
 */
export function formatProduct(dbProduct) {
  if (!dbProduct) return null;

  // Extract images
  const rawImages = dbProduct.product_images || [];
  const images = rawImages
    .slice()
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((img) => img.image_url);

  // Extract variants
  const variants = dbProduct.product_variants || [];
  const sizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean)));

  const uniqueColors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean)));
  const colors = uniqueColors.map((name) => ({
    name,
    hex: getColorHex(name),
  }));

  const categoryName =
    dbProduct.categories?.name ||
    dbProduct.category ||
    'Uncategorized';

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug || '',
    brand: dbProduct.brand || 'AURA STUDIO',
    category: categoryName,
    categoryId: dbProduct.category_id,
    gender: dbProduct.gender || 'Unisex',
    price: Number(dbProduct.price),
    originalPrice: dbProduct.original_price ? Number(dbProduct.original_price) : Number(dbProduct.price),
    discount: Number(dbProduct.discount || 0),
    stockQuantity: Number(dbProduct.stock_quantity || 0),
    rating: Number(dbProduct.rating || 5.0),
    reviewCount: Number(dbProduct.review_count || 0),
    isNew: Boolean(dbProduct.is_new),
    isTrending: Boolean(dbProduct.is_trending),
    isBestSeller: Boolean(dbProduct.is_best_seller),
    description: dbProduct.description || '',
    details: dbProduct.details || [
      'Crafted from finest natural materials with precision',
      'Ethically tailored by artisan partners',
      'Specialist dry clean or delicate hand wash recommended',
    ],
    images:
      images.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80'],
    colors: colors.length > 0 ? colors : [{ name: 'Default', hex: '#111111' }],
    sizes: sizes.length > 0 ? sizes : ['One Size'],
    rawVariants: variants,
    rawImages: rawImages,
  };
}

/**
 * 1. Get all products with joined categories, images, and variants
 */
export async function getAllProducts(options = {}) {
  try {
    let query = insforge.database
      .from('products')
      .select(`
        *,
        categories(id, name, slug),
        product_images(id, image_url, display_order),
        product_variants(id, size, color, stock_quantity)
      `);

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data: dbProducts, error } = await query;

    if (error || !dbProducts) {
      console.warn('InsForge getAllProducts warning, using fallback:', error?.message);
      return { data: fallbackProducts, error: null, isFallback: true };
    }

    const formatted = dbProducts.map(formatProduct);
    return { data: formatted, error: null, isFallback: false };
  } catch (err) {
    console.error('Error fetching products from InsForge:', err);
    return { data: fallbackProducts, error: err, isFallback: true };
  }
}

/**
 * 2. Get product by ID
 */
export async function getProductById(id) {
  try {
    const { data, error } = await insforge.database
      .from('products')
      .select(`
        *,
        categories(id, name, slug),
        product_images(id, image_url, display_order),
        product_variants(id, size, color, stock_quantity)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      // Fallback check
      const fallback = fallbackProducts.find((p) => p.id === id);
      if (fallback) {
        return { data: fallback, error: null, isFallback: true };
      }
      return { data: null, error: error || new Error('Product not found'), isFallback: false };
    }

    return { data: formatProduct(data), error: null, isFallback: false };
  } catch (err) {
    console.error(`Error fetching product ${id} from InsForge:`, err);
    const fallback = fallbackProducts.find((p) => p.id === id);
    return { data: fallback || null, error: err, isFallback: Boolean(fallback) };
  }
}

/**
 * 3. Get product by Slug
 */
export async function getProductBySlug(slug) {
  try {
    const { data, error } = await insforge.database
      .from('products')
      .select(`
        *,
        categories(id, name, slug),
        product_images(id, image_url, display_order),
        product_variants(id, size, color, stock_quantity)
      `)
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      const fallback = fallbackProducts.find((p) => p.slug === slug || p.id === slug);
      if (fallback) {
        return { data: fallback, error: null, isFallback: true };
      }
      return { data: null, error: error || new Error('Product not found'), isFallback: false };
    }

    return { data: formatProduct(data), error: null, isFallback: false };
  } catch (err) {
    console.error(`Error fetching product by slug ${slug}:`, err);
    const fallback = fallbackProducts.find((p) => p.slug === slug || p.id === slug);
    return { data: fallback || null, error: err, isFallback: Boolean(fallback) };
  }
}

/**
 * 4. Get products by Category ID or Category Name
 */
export async function getProductsByCategory(categoryIdentifier) {
  try {
    const { data: allProds, error } = await getAllProducts();
    if (error || !allProds) {
      const fallback = fallbackProducts.filter(
        (p) => p.category.toLowerCase() === String(categoryIdentifier).toLowerCase()
      );
      return { data: fallback, error: null, isFallback: true };
    }

    const filtered = allProds.filter(
      (p) =>
        p.categoryId === categoryIdentifier ||
        p.category.toLowerCase() === String(categoryIdentifier).toLowerCase()
    );

    return { data: filtered, error: null, isFallback: false };
  } catch (err) {
    console.error(`Error fetching products by category ${categoryIdentifier}:`, err);
    return { data: [], error: err, isFallback: false };
  }
}

/**
 * 5. Get product images for a specific product ID
 */
export async function getProductImages(productId) {
  try {
    const { data, error } = await insforge.database
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('display_order', { ascending: true });

    if (error) {
      return { data: [], error };
    }
    return { data: data || [], error: null };
  } catch (err) {
    console.error(`Error fetching product images for product ${productId}:`, err);
    return { data: [], error: err };
  }
}

/**
 * 6. Get product variants for a specific product ID
 */
export async function getProductVariants(productId) {
  try {
    const { data, error } = await insforge.database
      .from('product_variants')
      .select('*')
      .eq('product_id', productId);

    if (error) {
      return { data: [], error };
    }
    return { data: data || [], error: null };
  } catch (err) {
    console.error(`Error fetching product variants for product ${productId}:`, err);
    return { data: [], error: err };
  }
}
