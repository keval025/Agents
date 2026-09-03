import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items = [], className = '' }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-xs text-zinc-500 overflow-x-auto no-scrollbar py-2 ${className}`}
    >
      <Link to="/" className="hover:text-zinc-950 transition-colors whitespace-nowrap">
        Home
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
            {isLast || !item.to ? (
              <span className="text-zinc-950 font-medium truncate whitespace-nowrap">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className="hover:text-zinc-950 transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}