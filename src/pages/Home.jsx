import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Gem, Leaf, Compass } from 'lucide-react';
import { products, categories, promoBanners } from '../data/products';
import ProductGrid from '../components/product/ProductGrid';
import { Button, SectionHeading } from '../components/common';

export default function Home() {
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] min-h-[580px] max-h-[850px] w-full bg-zinc-900 flex items-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
            alt="Aura Autumn Winter Collection"
            className="w-full h-full object-cover object-[center_35%] filter brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[#E5DEC9] text-[10px] sm:text-xs uppercase tracking-[0.25em] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Autumn / Winter 2026 Collection</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.1] text-balance">
              The Architecture of Understated Form.
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
              Sculptural tailoring crafted from virgin Italian wool, Grade-6A mulberry silk, and cruelty-free Mongolian cashmere.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link to="/shop">
                <Button variant="gold" size="lg" fullWidth={false} icon={ArrowRight}>
                  Explore The Collection
                </Button>
              </Link>
              <Link to="/shop?category=Women">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20 hover:text-white hover:border-white backdrop-blur-sm transition-all">
                  Shop Ready-to-Wear
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Curation by Category"
          title="Curated Wardrobe Pillars"
          actionText="View All Categories"
          actionLink="/shop"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group relative h-96 overflow-hidden bg-zinc-100 flex flex-col justify-end p-6 border border-zinc-200/60"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="relative z-10 text-white space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#E5DEC9] font-medium">
                  {category.itemCount} Designs
                </span>
                <h3 className="font-serif text-2xl font-normal tracking-wide">
                  {category.name}
                </h3>
                <p className="text-xs text-zinc-300 font-light line-clamp-1">
                  {category.tagline}
                </p>
                <div className="pt-2 flex items-center gap-1 text-[11px] uppercase tracking-widest font-semibold text-[#C5A880] group-hover:underline">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Just Arrived"
          title="The Seasonal New Arrivals"
          actionText="Browse All New"
          actionLink="/shop"
        />
        <ProductGrid products={newArrivals} />
      </section>

      {/* 4. PROMOTIONAL EDITORIAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#1A1A1A] text-white overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Editorial Copy */}
            <div className="p-8 sm:p-14 lg:p-20 space-y-6">
              <span className="text-xs uppercase tracking-[0.3em] text-[#C5A880] font-semibold">
                Atelier Perspective
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
                Crafted for Decades, Not Single Seasons.
              </h2>
              <p className="text-sm text-zinc-300 font-light leading-relaxed">
                We reject fast cycles in favor of permanent refinement. Every garment is made in limited numbered ateliers across Porto and Biella using certified biological fibers and master hand-finishing techniques.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link to="/shop?category=Women">
                  <Button variant="gold" size="md">
                    Shop The Edit
                  </Button>
                </Link>
                <Link to="/shop">
                  <Button variant="outline" size="md" className="border-white text-white hover:bg-white hover:text-zinc-950">
                    Our Philosophy
                  </Button>
                </Link>
              </div>
            </div>

            {/* Editorial Image */}
            <div className="relative h-80 lg:h-full min-h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80"
                alt="Aura Studio craftsmanship"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRENDING NOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Most Coveted"
          title="Trending Silhouettes"
          actionText="View All Trending"
          actionLink="/shop"
        />
        <ProductGrid products={trendingProducts} />
      </section>

      {/* 6. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Atelier Favorites"
          title="Iconic Best Sellers"
          actionText="Explore The Icons"
          actionLink="/shop"
        />
        <ProductGrid products={bestSellers} />
      </section>

      {/* 7. BRAND PILLARS */}
      <section className="bg-zinc-100 py-16 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white flex items-center justify-center text-zinc-900 shadow-sm">
                <Gem className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-serif text-lg font-medium text-zinc-900 mb-2">Virgin Materials</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Exclusively using certified Grade-6A silk, unblended virgin wool, and pure Peruvian Pima cotton.
              </p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white flex items-center justify-center text-zinc-900 shadow-sm">
                <Compass className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-serif text-lg font-medium text-zinc-900 mb-2">Artisan Provenance</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Partnered exclusively with multi-generational family workshops across Northern Italy and Portugal.
              </p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white flex items-center justify-center text-zinc-900 shadow-sm">
                <Leaf className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-serif text-lg font-medium text-zinc-900 mb-2">Sustainable Impact</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Zero synthetic microfibers, compostable plant packaging, and 100% carbon-neutral worldwide shipping.
              </p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white flex items-center justify-center text-zinc-900 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
              </div>
              <h3 className="font-serif text-lg font-medium text-zinc-900 mb-2">Lifetime Repairs</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Every tailored coat and cashmere piece carries our lifetime repair and seam rejuvenation guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}