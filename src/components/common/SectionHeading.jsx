import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionHeading({
  kicker,
  title,
  description,
  actionText,
  actionLink,
  onActionClick,
  align = 'left',
  className = '',
}) {
  const isCentered = align === 'center';

  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-4 mb-10 ${
        isCentered ? 'text-center md:text-center' : ''
      } ${className}`}
    >
      <div className={isCentered ? 'max-w-2xl mx-auto' : ''}>
        {kicker && (
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold block mb-2">
            {kicker}
          </span>
        )}
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-zinc-950 tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-light leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {(actionText && (actionLink || onActionClick)) && (
        <div className="shrink-0">
          {actionLink ? (
            <Link
              to={actionLink}
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-zinc-900 hover:text-[#C5A880] transition-colors"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <button
              onClick={onActionClick}
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-zinc-900 hover:text-[#C5A880] transition-colors"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}