import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5, reviewCount, size = 'sm' }) {
  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSizes[size] || starSizes.sm} ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-zinc-200 fill-zinc-100'
            }`}
          />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-[11px] text-zinc-500 font-medium">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
