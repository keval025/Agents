import insforge from '../lib/insforge.js';
import { categories as fallbackCategories, products as fallbackProducts } from '../data/products.js';

/**
 * Format category object for UI components
 */
function formatCategory(dbCat, productCountMap = {}) {
  return {
    id: dbCat.id,
    name: dbCat.name,
    slug: dbCat.slug,
    description: dbCat.description || '',
    tagline: dbCat.description || '',
    image: dbCat.image_url || '',
    image_url: dbCat.image_url || '',
    itemCount: productCountMap[dbCat.id] || productCountMap[dbCat.name] || 0,
    created_at: dbCat.created_at,
  };
}

/**
 * Fetch all categories from InsForge database
 */
export async function getCategories() {
  try {
    const { data: dbCategories, error } = await insforge.database
      .from('categories')
      .select('*');

    if (error || !dbCategories || dbCategories.length === 0) {
      console.warn('InsForge categories fetch warning, using fallback:', error?.message);
      return { data: fallbackCategories, error: null, isFallback: true };
    }

    // Optionally count products per category
    const { data: dbProducts } = await insforge.database
      .from('products')
      .select('category_id');

    const countMap = {};
    if (dbProducts) {
      dbProducts.forEach((p) => {
        if (p.category_id) {
          countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
        }
      });
    }

    const formatted = dbCategories.map((cat) => formatCategory(cat, countMap));
    return { data: formatted, error: null, isFallback: false };
  } catch (err) {
    console.error('Error fetching categories from InsForge:', err);
    return { data: fallbackCategories, error: err, isFallback: true };
  }
}

/**
 * Fetch single category by ID
 */
export async function getCategoryById(id) {
  try {
    const { data, error } = await insforge.database
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      const fallback = fallbackCategories.find((c) => c.id === id);
      return { data: fallback || null, error };
    }

    return { data: formatCategory(data), error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Fetch single category by slug
 */
export async function getCategoryBySlug(slug) {
  try {
    const { data, error } = await insforge.database
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const fallback = fallbackCategories.find((c) => c.name.toLowerCase() === slug.toLowerCase());
      return { data: fallback || null, error };
    }

    return { data: formatCategory(data), error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}
