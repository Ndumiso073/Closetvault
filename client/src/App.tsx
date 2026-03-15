import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage            from "./pages/LandingPage";
import ShopPage               from "./pages/ShopPage";
import ProductDetailsPage     from "./pages/ProductDetailsPage";
import LaunchesPage           from "./pages/LaunchesPage";
import SearchResultsPage      from "./pages/SearchResultsPage";
import SellerPage             from "./pages/SellerPage";
import HelpPage               from "./pages/HelpPage";
import ReturnsPage            from "./pages/ReturnsPage";
import OrderTrackerPage       from "./pages/OrderTrackerPage";
import LoginPage              from "./pages/auth/LoginPage";
import RegisterPage           from "./pages/auth/RegisterPage";
import ForgotPasswordPage     from "./pages/auth/ForgotPasswordPage";
import VaultPage              from "./pages/user/VaultPage";
import WishlistPage           from "./pages/user/WishlistPage";
import CartPage               from "./pages/user/CartPage";
import CheckoutPage           from "./pages/user/CheckoutPage";
import OrdersPage             from "./pages/user/OrdersPage";
import ProfilePage            from "./pages/user/ProfilePage";
import SellerDashboard        from "./pages/seller/SellerDashboard";
import SellerProducts         from "./pages/seller/SellerProducts";
import SellerOrders           from "./pages/seller/SellerOrders";
import SellerAddProduct       from "./pages/seller/SellerAddProduct";
import ClosetPage             from "./pages/ClosetPage";
import ClosetItemDetailsPage  from "./pages/ClosetItemDetailsPage";
import BecomeSellerPage       from "./pages/BecomeSellerPage";
import SellerProtectedRoute   from "./components/SellerProtectedRoute";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* ── LANDING ── */}
          <Route path="/" element={<Layout><LandingPage /></Layout>} />

          {/* ── SHOP ── */}
          <Route path="/shop"           element={<Layout><ShopPage /></Layout>} />
          <Route path="/shop/:category" element={<Layout><ShopPage /></Layout>} />
          <Route path="/product/:id"    element={<Layout><ProductDetailsPage /></Layout>} />
          <Route path="/launches"       element={<Layout><LaunchesPage /></Layout>} />
          <Route path="/search"         element={<Layout><SearchResultsPage /></Layout>} />

          {/* ── INFO ── */}
          <Route path="/help"           element={<Layout><HelpPage /></Layout>} />
          <Route path="/returns"        element={<Layout><ReturnsPage /></Layout>} />
          <Route path="/order-tracker"  element={<Layout><OrderTrackerPage /></Layout>} />

          {/* ── AUTH ── */}
          <Route path="/auth/login"     element={<Layout><LoginPage /></Layout>} />
          <Route path="/auth/register"  element={<Layout><RegisterPage /></Layout>} />
          <Route path="/auth/forgot"    element={<Layout><ForgotPasswordPage /></Layout>} />

          {/* ── USER ── */}
          <Route path="/vault"          element={<Layout><VaultPage /></Layout>} />
          <Route path="/wishlist"       element={<Layout><WishlistPage /></Layout>} />
          <Route path="/cart"           element={<Layout><CartPage /></Layout>} />
         <Route path="/checkout" element={<Layout><ProtectedRoute><CheckoutPage /></ProtectedRoute></Layout>} />
          <Route path="/orders"         element={<Layout><OrdersPage /></Layout>} />
          <Route path="/profile"        element={<Layout><ProfilePage /></Layout>} />
          <Route path="/become-seller"  element={<Layout><BecomeSellerPage /></Layout>} />

          {/* ── CLOSET ── */}
          <Route path="/closet"         element={<Layout><ClosetPage /></Layout>} />
          <Route path="/closet/:id"     element={<Layout><ClosetItemDetailsPage /></Layout>} />

          import ProtectedRoute from "./components/ProtectedRoute";

    // Replace your seller routes with:
         <Route path="/seller/dashboard" element={<Layout><SellerProtectedRoute><SellerDashboard /></SellerProtectedRoute></Layout>} />
<Route path="/seller/products"  element={<Layout><SellerProtectedRoute><SellerProducts /></SellerProtectedRoute></Layout>} />
<Route path="/seller/orders"    element={<Layout><SellerProtectedRoute><SellerOrders /></SellerProtectedRoute></Layout>} />
<Route path="/seller/add"       element={<Layout><SellerProtectedRoute><SellerAddProduct /></SellerProtectedRoute></Layout>} />
<Route path="/sell/dashboard"   element={<Layout><SellerProtectedRoute><SellerDashboard /></SellerProtectedRoute></Layout>} />
<Route path="/sell/products"    element={<Layout><SellerProtectedRoute><SellerProducts /></SellerProtectedRoute></Layout>} />
<Route path="/sell/orders"      element={<Layout><SellerProtectedRoute><SellerOrders /></SellerProtectedRoute></Layout>} />
<Route path="/sell/add"         element={<Layout><SellerProtectedRoute><SellerAddProduct /></SellerProtectedRoute></Layout>} />

          {/* ── SELLER PROFILE (dynamic — must be last) ── */}
          <Route path="/seller/:id"     element={<Layout><SellerPage /></Layout>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}