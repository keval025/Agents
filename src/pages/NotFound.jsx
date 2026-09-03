import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 sm:py-32 text-center">
      <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 mx-auto mb-6">
        <Compass className="w-8 h-8 stroke-[1.5]" />
      </div>

      <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold block mb-2">
        Error 404
      </span>

      <h1 className="font-serif text-3xl sm:text-4xl font-normal text-zinc-950 mb-4 tracking-tight">
        Atelier Page Not Located
      </h1>

      <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed mb-8">
        The design, collection, or address you are searching for does not exist or has been relocated to another section of the catalog.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to="/shop">
          <Button variant="primary" size="md" icon={ArrowRight}>
            Explore The Collections
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" size="md" icon={ArrowLeft}>
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}