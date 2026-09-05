import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowUpDown, Search, AlertCircle } from 'lucide-react';
import { getAllProducts } from '../services/productService.js';
import { getCategories } from '../services/categoryService.js';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import { Loader, EmptyState } from '../components/common';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract query params
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('newest'); // newest, popularity, price-asc, price-desc
  const [priceRange, setPriceRange] = useState([0, 700]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Fetch data from InsForge services
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        getAllProducts(),
        getCategories(),
      ]);

      if (prodsRes.error) {
        setError(prodsRes.error.message || 'Failed to load products');
      } else {
        setProducts(prodsRes.data || []);
      }

      if (catsRes.data) {
        setCategories(catsRes.data);
      }
    } catch (err) {
      console.error('Error in Shop component data fetch:', err);
      setError('An error occurred while loading products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync state if URL searchParams change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
    const q = searchParams.get('search');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Derived filter options from live database products
  const availableBrands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean));
    return Array.from(set);
  }, [products]);

  const availableSizes = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p.sizes?.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [products]);

  const availableColors = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      p.colors?.forEach((c) => {
        if (!map.has(c.name)) {
          map.set(c.name, c);
        }
      });
    });
    return Array.from(map.values());
  }, [products]);

  // Filter handlers
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleToggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleToggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleToggleColor = (colorName) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const handleResetAll = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('newest');
    setPriceRange([0, 700]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setSearchParams({});
  };

  const hasActiveFilters = useMemo(() => {
    return (
      selectedCategory !== 'all' ||
      searchQuery.trim() !== '' ||
      priceRange[1] < 700 ||
      selectedSizes.length > 0 ||
      selectedColors.length > 0 ||
      selectedBrands.length > 0
    );
  }, [selectedCategory, searchQuery, priceRange, selectedSizes, selectedColors, selectedBrands]);

  // Compute filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // 1. Search Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(q);
          const matchBrand = product.brand.toLowerCase().includes(q);
          const matchCat = product.category.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchCat && !matchDesc) return false;
        }

        // 2. Category filter
        if (
          selectedCategory !== 'all' &&
          product.category.toLowerCase() !== selectedCategory.toLowerCase()
        ) {
          return false;
        }

        // 3. Price filter
        if (product.price < priceRange[0] || product.price > priceRange[1]) {
          return false;
        }

        // 4. Brand filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
          return false;
        }

        // 5. Size filter
        if (selectedSizes.length > 0) {
          const hasMatchingSize = product.sizes?.some((s) => selectedSizes.includes(s));
          if (!hasMatchingSize) return false;
        }

        // 6. Color filter
        if (selectedColors.length > 0) {
          const hasMatchingColor = product.colors?.some((c) => selectedColors.includes(c.name));
          if (!hasMatchingColor) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'popularity') return (b.reviewCount || 0) - (a.reviewCount || 0);
        if (sortBy === 'newest') {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        }
        return 0;
      });
  }, [
    products,
    searchQuery,
    selectedCategory,
    priceRange,
    selectedBrands,
    selectedSizes,
    selectedColors,
    sortBy,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title & Breadcrumb Header */}
      <div className="border-b border-zinc-200 pb-8 mb-8">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block mb-2">
          Atelier Catalog
        </span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-zinc-950 tracking-tight">
              {selectedCategory === 'all' ? 'All Collections' : selectedCategory}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Showing {filteredProducts.length} of {products.length} designed pieces
            </p>
          </div>

          {/* Quick Search bar */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-none focus:outline-none focus:border-zinc-950"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex items-center justify-between gap-4 py-3 border-b border-zinc-100 mb-8">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 border border-zinc-300 text-xs font-medium uppercase tracking-wider text-zinc-800 hover:border-zinc-950 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters {hasActiveFilters ? '•' : ''}</span>
        </button>

        {/* Category Pill Tabs for fast desktop navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          {['all', ...categories.map((c) => c.name)].map((cat) => (
            <button
              key={cat}
              onClick={() => handleSelectCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-widest transition-all ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-zinc-950 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="hidden sm:inline-block text-xs uppercase tracking-wider text-zinc-500 font-medium">
            Sort by:
          </span>
          <div className="relative inline-block">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-zinc-300 text-xs font-medium px-3.5 py-2 pr-8 focus:outline-none focus:border-zinc-950 cursor-pointer uppercase tracking-wider"
            >
              <option value="newest">Newest First</option>
              <option value="popularity">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-8 p-3 bg-zinc-50 border border-zinc-200">
          <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mr-1">
            Active Filters:
          </span>

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-zinc-200 text-xs text-zinc-800">
              Category: {selectedCategory}
              <button onClick={() => handleSelectCategory('all')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-zinc-200 text-xs text-zinc-800">
              "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {priceRange[1] < 700 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-zinc-200 text-xs text-zinc-800">
              Under ${priceRange[1]}
              <button onClick={() => setPriceRange([0, 700])} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedSizes.map((size) => (
            <span key={size} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-zinc-200 text-xs text-zinc-800">
              Size: {size}
              <button onClick={() => handleToggleSize(size)} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {selectedColors.map((color) => (
            <span key={color} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-zinc-200 text-xs text-zinc-800">
              Color: {color}
              <button onClick={() => handleToggleColor(color)} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {selectedBrands.map((brand) => (
            <span key={brand} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-zinc-200 text-xs text-zinc-800">
              Brand: {brand}
              <button onClick={() => handleToggleBrand(brand)} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            onClick={handleResetAll}
            className="text-xs text-[#C5A880] hover:text-zinc-950 font-semibold underline underline-offset-4 ml-auto"
          >
            Clear All
          </button>
        </div>
      )}

      {/* ERROR STATE */}
      {error && (
        <div className="py-12">
          <EmptyState
            icon={AlertCircle}
            title="Failed to load catalog"
            description={error}
            actionText="Retry Loading"
            onActionClick={fetchData}
          />
        </div>
      )}

      {/* LOADING STATE */}
      {loading && !error && (
        <div className="py-16">
          <Loader text="Fetching catalog from InsForge..." />
        </div>
      )}

      {/* Main Layout: Filters Sidebar + Product Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 bg-white p-6 border border-zinc-200 sticky top-28">
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              brands={availableBrands}
              selectedBrands={selectedBrands}
              onToggleBrand={handleToggleBrand}
              priceRange={priceRange}
              maxPossiblePrice={700}
              onChangePriceRange={setPriceRange}
              sizes={availableSizes}
              selectedSizes={selectedSizes}
              onToggleSize={handleToggleSize}
              colors={availableColors}
              selectedColors={selectedColors}
              onToggleColor={handleToggleColor}
              onResetAll={handleResetAll}
              hasActiveFilters={hasActiveFilters}
            />
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            <ProductGrid
              products={filteredProducts}
              columns="grid-cols-2 sm:grid-cols-2 md:grid-cols-3"
              onResetFilters={hasActiveFilters ? handleResetAll : undefined}
            />
          </main>
        </div>
      )}

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-10">
            <div className="flex items-center justify-between p-5 border-b border-zinc-200">
              <h3 className="font-serif text-lg font-medium text-zinc-950">Filters</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                brands={availableBrands}
                selectedBrands={selectedBrands}
                onToggleBrand={handleToggleBrand}
                priceRange={priceRange}
                maxPossiblePrice={700}
                onChangePriceRange={setPriceRange}
                sizes={availableSizes}
                selectedSizes={selectedSizes}
                onToggleSize={handleToggleSize}
                colors={availableColors}
                selectedColors={selectedColors}
                onToggleColor={handleToggleColor}
                onResetAll={handleResetAll}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
            <div className="p-4 border-t border-zinc-200 bg-zinc-50">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full bg-zinc-950 text-white py-3 text-xs uppercase tracking-widest font-semibold hover:bg-zinc-800 transition-colors"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
