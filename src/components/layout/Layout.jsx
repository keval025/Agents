import React from 'react';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFB] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Sticky Navigation */}
      <Navbar />

      {/* Slide-over Mini Bag Drawer */}
      <CartDrawer />

      {/* Page Content View */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Atelier Footer */}
      <Footer />
    </div>
  );
}