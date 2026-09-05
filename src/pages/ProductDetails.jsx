import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RefreshCw, ChevronDown, ChevronUp, Share2, Check, AlertCircle } from 'lucide-react';
import { getProductById, getProductBySlug, getAllProducts } from '../services/productService.js';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductGallery from '../components/product/ProductGallery';
import RatingStars from '../components/product/RatingStars';
import ProductGrid from '../components/product/ProductGrid';
import { Button, Breadcrumbs, Loader, EmptyState } from '../components/common';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Purchasing selections
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // details, shipping, care

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      let res = await getProductById(id);
      if (!res.data) {
        res = await getProductBySlug(id);
      }

      if (res.error && !res.data) {
        setError(res.error.message || 'Product not found');
      } else {
        const prod = res.data;
        setProduct(prod);

        if (prod) {
          setSelectedColor(prod.colors?.[0] || null);
          setSelectedSize(prod.sizes?.[0] || 'One Size');
          setQuantity(1);

          // Fetch related products in same category
          const allRes = await getAllProducts();
          if (allRes.data) {
            const related = allRes.data
              .filter((p) => p.category === prod.category && p.id !== prod.id)
              .slice(0, 4);
            setRelatedProducts(related);
          }
        }
      }
    } catch (err) {
      console.error(`Error loading product ${id}:`, err);
      setError('An error occurred while loading product details.');
    } finally {
      setLoading(false);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <Loader text="Loading garment details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <EmptyState
          icon={AlertCircle}
          title="Product Not Found"
          description="The requested garment could not be found in our current catalog."
          actionText="Return to Shop"
          actionLink="/shop"
        />
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-100 text-xs text-zinc-500">
        <Breadcrumbs
          items={[
            { label: 'Shop', to: '/shop' },
            { label: product.category, to: `/shop?category=${encodeURIComponent(product.category)}` },
            { label: product.name },
          ]}
        />

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-950 transition-colors uppercase tracking-wider text-[11px]"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Media Gallery (7 columns) */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images}
            name={product.name}
            discount={product.discount}
            isNew={product.isNew}
          />
        </div>

        {/* Right: Purchasing Details (5 columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header / Brand / Rating */}
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                {product.brand}
              </p>
              <h1 className="text-2xl sm:text-3xl font-serif font-normal text-zinc-950 mt-1.5 tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mt-3">
                <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
                <span className="text-zinc-300">•</span>
                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock & Ready to Ship
                </span>
              </div>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-3 pb-6 border-b border-zinc-100">
              <span className="text-3xl font-serif font-semibold text-zinc-950">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-zinc-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-xs text-rose-700 font-semibold uppercase tracking-wider bg-rose-50 px-2 py-0.5 border border-rose-200">
                  Save {product.discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-600 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-zinc-900 mb-2.5">
                  <span>Color:</span>
                  <span className="font-normal text-zinc-500">{selectedColor?.name}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor?.name === c.name
                          ? 'ring-2 ring-zinc-950 ring-offset-2 border-white scale-105'
                          : 'border-zinc-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                      aria-label={`Select color ${c.name}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-zinc-900 mb-2.5">
                  <span>Select Size:</span>
                  <button
                    onClick={() => addToast('Standard international sizing. Fits true to size.', 'info')}
                    className="text-[11px] text-[#C5A880] underline font-normal lowercase tracking-normal"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-12 h-10 px-3 text-xs font-semibold uppercase tracking-wider border transition-all ${
                        selectedSize === s
                          ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                          : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-950'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900 block mb-2.5">
                Quantity:
              </span>
              <div className="flex items-center border border-zinc-200 w-32 bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 flex items-center justify-center font-medium"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="flex-1 text-center text-xs font-semibold text-zinc-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 flex items-center justify-center font-medium"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={ShoppingBag}
                onClick={handleAddToCart}
                className="py-4"
              >
                Add To Shopping Bag
              </Button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 border transition-all shrink-0 ${
                  isSaved
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-zinc-300 hover:border-zinc-950 text-zinc-700'
                }`}
                aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>
            </div>

            {/* Atelier Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-4 text-center border-t border-zinc-100 text-[11px] text-zinc-500">
              <div className="flex flex-col items-center p-2">
                <Truck className="w-4 h-4 text-[#C5A880] mb-1" />
                <span>Complimentary Shipping</span>
              </div>
              <div className="flex flex-col items-center p-2">
                <RefreshCw className="w-4 h-4 text-[#C5A880] mb-1" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex flex-col items-center p-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A880] mb-1" />
                <span>Authentic Atelier</span>
              </div>
            </div>

            {/* Tabbed Specifications Accordion */}
            <div className="border-t border-zinc-200 pt-4 space-y-3">
              {/* Product Details Tab */}
              <div className="border-b border-zinc-100 pb-3">
                <button
                  onClick={() => setActiveTab(activeTab === 'details' ? '' : 'details')}
                  className="flex items-center justify-between w-full text-xs uppercase tracking-widest font-semibold text-zinc-900 py-1"
                >
                  <span>Composition & Specifications</span>
                  {activeTab === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeTab === 'details' && (
                  <ul className="mt-3 text-xs text-zinc-600 space-y-2 list-disc pl-4">
                    {product.details?.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    )) || <li>Finest natural materials crafted with precision.</li>}
                  </ul>
                )}
              </div>

              {/* Shipping & Delivery Tab */}
              <div className="border-b border-zinc-100 pb-3">
                <button
                  onClick={() => setActiveTab(activeTab === 'shipping' ? '' : 'shipping')}
                  className="flex items-center justify-between w-full text-xs uppercase tracking-widest font-semibold text-zinc-900 py-1"
                >
                  <span>Shipping & Atelier Returns</span>
                  {activeTab === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeTab === 'shipping' && (
                  <div className="mt-3 text-xs text-zinc-600 space-y-2 leading-relaxed">
                    <p>Standard Delivery: 2-4 business days. Free on orders exceeding $200.</p>
                    <p>Express Express Courier: 1-2 business days ($25).</p>
                    <p>Complimentary return label included in your box for seamless 30-day returns.</p>
                  </div>
                )}
              </div>

              {/* Garment Care Tab */}
              <div className="border-b border-zinc-100 pb-3">
                <button
                  onClick={() => setActiveTab(activeTab === 'care' ? '' : 'care')}
                  className="flex items-center justify-between w-full text-xs uppercase tracking-widest font-semibold text-zinc-900 py-1"
                >
                  <span>Care & Preservation</span>
                  {activeTab === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeTab === 'care' && (
                  <div className="mt-3 text-xs text-zinc-600 space-y-2 leading-relaxed">
                    <p>To preserve natural drape, store garments on broad contoured hangers.</p>
                    <p>Steam gently to release creases. Avoid high direct heat on natural virgin fibers.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-zinc-200">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block mb-1">
                Complete The Look
              </span>
              <h3 className="font-serif text-2xl font-medium text-zinc-950">
                Pairs Well With
              </h3>
            </div>
            <Link
              to={`/shop?category=${encodeURIComponent(product.category)}`}
              className="text-xs uppercase tracking-widest font-semibold text-zinc-900 hover:text-[#C5A880]"
            >
              More from {product.category}
            </Link>
          </div>
          <ProductGrid products={relatedProducts} columns="grid-cols-2 md:grid-cols-4" />
        </section>
      )}
    </div>
  );
}
