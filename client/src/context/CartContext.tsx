import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { Product } from "../data/products";

// ── Types ─────────────────────────────────────────────────────────────────
export interface CartItem {
  cartId: string;   // unique per cart line (productId + size)
  product: Product & { original_price?: number | null };
  size: string;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product, size: string, qty?: number) => void;
  removeFromCart: (cartId: string) => void;
  updateQty: (cartId: string, delta: number) => void;
  clearCart: () => void;
}

// ── Context ───────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "cv_cart";

// ── Provider ──────────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: Product, size: string, qty = 1) => {
    const cartId = `${product.id}-${size}`;
    setItems(prev => {
      const existing = prev.find(i => i.cartId === cartId);
      if (existing) {
        // Increment qty (max 10)
        return prev.map(i =>
          i.cartId === cartId
            ? { ...i, qty: Math.min(10, i.qty + qty) }
            : i
        );
      }
      return [...prev, { cartId, product, size, qty }];
    });
  }, []);

  const removeFromCart = useCallback((cartId: string) => {
    setItems(prev => prev.filter(i => i.cartId !== cartId));
  }, []);

  const updateQty = useCallback((cartId: string, delta: number) => {
    setItems(prev =>
      prev.map(i =>
        i.cartId === cartId
          ? { ...i, qty: Math.max(1, Math.min(10, i.qty + delta)) }
          : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = items.reduce((s, i) => s + i.qty, 0);
  const subtotal  = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, subtotal, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
