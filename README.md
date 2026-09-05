# Atelier - Modern Fashion E-Commerce Web Application

A modern, full-featured fashion e-commerce store built with **React**, **Vite**, **Tailwind CSS**, and **InsForge BaaS**. Products, categories, and orders are served from a live InsForge database through a dedicated service layer, with local mock data as an automatic fallback so the storefront stays usable even when the backend is unreachable.

---

## 🚀 Features

- **User Authentication (InsForge SDK)**:
  - Sign up with full name, email, and password.
  - User profile row created and synchronized in the `profiles` table.
  - Sign in and sign out with persistent session state (`AuthContext`).
  - Password recovery flow UI and human-readable auth error messages.
- **Live Product Catalog (`productService`, `categoryService`)**:
  - Products, images, and variants fetched from the InsForge database.
  - Automatic fallback to bundled mock data when a fetch fails or returns empty.
  - Filter by category, price range, rating, and availability.
  - Debounced search on the shop page and in the navbar.
  - Quick view modal for rapid product inspection.
- **Cart & Wishlist System**:
  - Slide-over Cart Drawer for quick access.
  - Persistent cart state across sessions using local storage & React Context.
  - Dedicated Wishlist page to save favorite items.
  - Real-time cart badge counters on the navbar.
- **Validated Checkout (`orderService`)**:
  - Stock levels and prices are re-checked against the live database before an order is placed, so client-side cart data can't set the final total.
  - Variant-aware stock checks (size / color) against `product_variants`.
  - Orders written to `orders` with line items in `order_items`.
- **Order History**:
  - `/orders` lists the signed-in user's past orders.
  - `/orders/:id` shows a single order's items, totals, and status.
- **Responsive & Elegant UI**:
  - Mobile-responsive navigation drawer and announcement bar.
  - Built with Tailwind CSS 3.4 and Lucide React icons.
  - Toast notifications for cart actions, auth status, and errors.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS v3.4, PostCSS, Autoprefixer
- **Backend / Auth / Database**: `@insforge/sdk` (InsForge BaaS)
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
│   ├── data/              # Mock data used as fallback when the backend is unavailable
│   ├── hooks/             # Custom React hooks (useDebounce, useLocalStorage)
│   ├── lib/               # InsForge SDK client configuration
│   ├── pages/             # Route pages (Home, Shop, ProductDetails, Cart, Wishlist,
│   │                      # Checkout, Login, Register, Orders, OrderDetails, ...)
│   ├── services/          # Data layer between the UI and InsForge
│   │   ├── productService.js    # Products, images, variants, color mapping
│   │   ├── categoryService.js   # Categories and per-category product counts
│   │   └── orderService.js      # Cart validation, order creation, order history
│   ├── App.jsx            # Main App component with route setup
│   ├── main.jsx           # React DOM entrypoint
│   └── index.css          # Tailwind CSS base styles
├── package.json
└── vite.config.js
```

---

## 🧭 Routes

| Path | Page | Notes |
| --- | --- | --- |
| `/` | Home | Featured products and categories from the database |
| `/shop` | Shop | Filtering, sorting, and debounced search |
| `/product/:id` | ProductDetails | Resolves by id or slug, with related products |
| `/cart` | Cart | Cart line items |
| `/wishlist` | Wishlist | Saved items |
| `/checkout` | Checkout | Server-validated stock and totals |
| `/orders` | Orders | Signed-in user's order history |
| `/orders/:id` | OrderDetails | Single order with line items |
| `/login`, `/register`, `/forgot-password` | Auth | InsForge authentication |
| `*` | NotFound | 404 fallback |

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

3. **Configure environment variables** (optional — defaults are baked in):
   ```bash
   # .env
   VITE_INSFORGE_URL=https://your-project.insforge.app
   VITE_INSFORGE_ANON_KEY=your_anon_key
   ```
   `.env` is git-ignored. Only the public anon key belongs here; never commit a service key.

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 🔒 Backend Integration (InsForge)

The application uses InsForge for authentication and as its primary datastore:

- Client configuration: [`src/lib/insforge.js`](src/lib/insforge.js)
- Global auth state: [`src/context/AuthContext.jsx`](src/context/AuthContext.jsx)
- Data access lives in [`src/services/`](src/services) — pages never query the database directly.

### Database tables

| Table | Purpose |
| --- | --- |
| `profiles` | User profile row created on sign-up |
| `categories` | Product categories with slug, description, image |
| `products` | Catalog items, pricing, stock, category reference |
| `product_images` | Additional gallery images per product |
| `product_variants` | Size / color variants with their own stock levels |
| `orders` | Order header: user, totals, status, shipping details |
| `order_items` | Line items belonging to an order |

### Fallback behaviour

`productService` and `categoryService` fall back to the mock data in `src/data/` whenever a query errors or returns no rows, so the UI degrades gracefully instead of rendering an empty store. Order operations have no fallback — they require a live database and a signed-in user.

---

## 📄 License

This project is open source and available for personal or educational use.
