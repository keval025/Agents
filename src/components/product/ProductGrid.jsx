import React from 'react';
import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';
import { PackageSearch } from 'lucide-react';

export default function ProductGrid({
  products = [],
  columns = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your filters, searching for a different term, or browsing our full collection.',
  onResetFilters,
}) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title={emptyTitle}
        description={emptyDescription}
        actionText={onResetFilters ? 'Clear All Filters' : 'Browse All Products'}
        actionLink={onResetFilters ? undefined : '/shop'}
        onActionClick={onResetFilters}
      />
    );
  }

  return (
    <div className={`grid ${columns} gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10`}>
      {products.map((product, idx) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={idx < 4}
        />
      ))}
    </div>
  );
}
