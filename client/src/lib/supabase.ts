import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

/* ── Typed helpers ─────────────────────────────────────────────── */

export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: "buyer" | "seller" | "admin";
  created_at: string;
};

export type Product = {
  id: string;
  seller_id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  original_price: number | null;
  condition: string;
  size: string;
  gender: "men" | "women" | "unisex";
  description: string | null;
  images: string[];
  tags: string[];
  status: "active" | "draft" | "out_of_stock";
  created_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  size: string;
  product?: Product;
};

export type Order = {
  id: string;
  user_id: string;
  status: "pending" | "paid" | "packed" | "shipped" | "delivered" | "cancelled";
  total: number;
  shipping_address: Record<string, string>;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  size: string;
  price_at_purchase: number;
  product?: Product;
};

export type WishlistItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
};
