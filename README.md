# Atelier - Modern Fashion E-Commerce Web Application

A modern, full-featured fashion e-commerce store built with **React**, **Vite**, **Tailwind CSS**, and **InsForge BaaS**. Designed with a clean UI, smooth user interaction, user authentication, interactive cart/wishlist management, and dynamic product showcase.

---

## 🚀 Features

- **User Authentication (InsForge SDK)**:
  - Sign up with full name, email, and password.
  - User profile creation & synchronization.
  - Sign in and sign out with persistent session state (`AuthContext`).
  - Password recovery flow UI.
- **Product Catalog & Filtering (`Shop`)**:
  - Filter products by category, price range, rating, and availability.
  - Debounced search functionality for responsive filtering.
  - Quick view modal for rapid product inspection.
- **Cart & Wishlist System**:
  - Slide-over Cart Drawer for quick access.
  - Persistent cart state across sessions using local storage & React Context.
  - Dedicated Wishlist page to save favorite items.
  - Real-time cart badge counters on navbar.
- **Seamless Checkout Flow**:
  - Multi-step order summary and customer details form.
- **Responsive & Elegant UI**:
  - Mobile-responsive navigation drawer and announcement bar.
  - Designed with Tailwind CSS 3.4 and Lucide React icons.
  - Interactive toast notifications for user actions (cart additions, auth status, alerts).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS v3.4, PostCSS, Autoprefixer
- **Backend / Authentication**: `@insforge/sdk` (InsForge BaaS)
- **Icons**: `lucide-react`

---

## 📁 Project Structure

```
Agents/
├── public/                # Static public assets
├── src/
│   ├── assets/            # Project images and icons
│   ├── components/
│   │   ├── common/        # Reusable UI components (Button, Input, Modal, Badge, Toast, etc.)
│   │   ├── layout/        # Navbar, Footer, CartDrawer, MobileMenu, Layout
│   │   └── product/       # ProductCard, ProductGrid, ProductFilters, QuickViewModal
│   ├── context/           # React Context providers (Auth, Cart, Wishlist, Toast)
│   ├── data/              # Mock data / initial data sources
│   ├── hooks/             # Custom React hooks (useDebounce, useLocalStorage)
│   ├── lib/               # Third-party integrations (InsForge SDK client)
│   ├── pages/             # Route pages (Home, Shop, ProductDetails, Cart, Wishlist, Login, Register, etc.)
│   ├── App.jsx            # Main App component with route setup
│   ├── main.jsx           # React DOM entrypoint
│   └── index.css          # Tailwind CSS base styles
├── package.json
└── vite.config.js
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/keval025/Agents.git
   cd Agents
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 🔒 Backend Integration (InsForge)

The application integrates with InsForge for authentication and user profile database management:
- Client configuration located in [`src/lib/insforge.js`](file:///C:/Users/SIS/Documents/Agents/src/lib/insforge.js)
- Authentication state managed globally via [`src/context/AuthContext.jsx`](file:///C:/Users/SIS/Documents/Agents/src/context/AuthContext.jsx)

---

## 📄 License

This project is open source and available for personal or educational use.
