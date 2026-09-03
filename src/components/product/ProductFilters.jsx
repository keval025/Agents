import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, Check } from 'lucide-react';
import { formatPrice } from '../../utils/currency';

export default function ProductFilters({
  categories = [],
  selectedCategory,
  onSelectCategory,
  brands = [],
  selectedBrands = [],
  onToggleBrand,
  priceRange = [0, 700],
  maxPossiblePrice = 700,
  onChangePriceRange,
  sizes = [],
  selectedSizes = [],
  onToggleSize,
  colors = [],
  selectedColors = [],
  onToggleColor,
  onResetAll,
  hasActiveFilters = false,
}) {
  const [collapsedSections, setCollapsedSections] = useState({
    categories: false,
    price: false,
    sizes: false,
    colors: false,
    brands: false,
  });

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="space-y-6 text-zinc-900">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
        <h3 className="font-serif text-base font-semibold tracking-wide">
          Filter Collection
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onResetAll}
            className="flex items-center gap-1.5 text-xs text-[#C5A880] hover:text-zinc-950 font-medium transition-colors uppercase tracking-wider"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="border-b border-zinc-100 pb-5">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-widest text-zinc-900 mb-3"
        >
          <span>Category</span>
          {collapsedSections.categories ? (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          )}
        </button>
        {!collapsedSections.categories && (
          <div className="space-y-1.5">
            <button
              onClick={() => onSelectCategory('all')}
              className={`w-full text-left text-xs py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                selectedCategory === 'all'
                  ? 'bg-zinc-100 text-zinc-950 font-semibold'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <span>All Categories</span>
              {selectedCategory === 'all' && <Check className="w-3.5 h-3.5" />}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id || cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`w-full text-left text-xs py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-zinc-100 text-zinc-950 font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <span>{cat.name}</span>
                {selectedCategory.toLowerCase() === cat.name.toLowerCase() && (
                  <Check className="w-3.5 h-3.5" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Slider */}
      <div className="border-b border-zinc-100 pb-5">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-widest text-zinc-900 mb-3"
        >
          <span>Max Price: {formatPrice(priceRange[1])}</span>
          {collapsedSections.price ? (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          )}
        </button>
        {!collapsedSections.price && (
          <div className="space-y-3 px-1">
            <input
              type="range"
              min="50"
              max={maxPossiblePrice}
              step="25"
              value={priceRange[1]}
              onChange={(e) => onChangePriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-zinc-900 cursor-pointer"
            />
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(maxPossiblePrice)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Sizes */}
      <div className="border-b border-zinc-100 pb-5">
        <button
          onClick={() => toggleSection('sizes')}
          className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-widest text-zinc-900 mb-3"
        >
          <span>Size</span>
          {collapsedSections.sizes ? (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          )}
        </button>
        {!collapsedSections.sizes && (
          <div className="flex flex-wrap gap-1.5">
            {sizes.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => onToggleSize(size)}
                  className={`min-w-9 h-8 px-2 text-[11px] font-medium border transition-colors ${
                    isSelected
                      ? 'bg-zinc-950 text-white border-zinc-950'
                      : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-900'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Colors */}
      <div className="border-b border-zinc-100 pb-5">
        <button
          onClick={() => toggleSection('colors')}
          className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-widest text-zinc-900 mb-3"
        >
          <span>Color</span>
          {collapsedSections.colors ? (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          )}
        </button>
        {!collapsedSections.colors && (
          <div className="grid grid-cols-2 gap-2">
            {colors.map((color) => {
              const isSelected = selectedColors.includes(color.name);
              return (
                <button
                  key={color.name}
                  onClick={() => onToggleColor(color.name)}
                  className={`flex items-center gap-2 p-1.5 text-xs rounded transition-colors text-left ${
                    isSelected ? 'bg-zinc-100 font-semibold text-zinc-950' : 'text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-zinc-300 shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="truncate">{color.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Brands */}
      <div>
        <button
          onClick={() => toggleSection('brands')}
          className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-widest text-zinc-900 mb-3"
        >
          <span>Brand</span>
          {collapsedSections.brands ? (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          )}
        </button>
        {!collapsedSections.brands && (
          <div className="space-y-2">
            {brands.map((brand) => {
              const isSelected = selectedBrands.includes(brand);
              return (
                <label
                  key={brand}
                  className="flex items-center gap-2.5 text-xs text-zinc-700 hover:text-zinc-950 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleBrand(brand)}
                    className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 h-3.5 w-3.5 cursor-pointer accent-zinc-950"
                  />
                  <span>{brand}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
