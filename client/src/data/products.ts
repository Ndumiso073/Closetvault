// ── Centralized shop image assets ─────────────────────────────────────────
export const IMG_SHOP_HERO = "/src/assets/danny-greenberg.jpg";

export const PRODUCT_IMGS = [
  "/src/assets/SUPERSTARS.jpg",
  "/src/assets/jordans.jpg",
  "/src/assets/air 1.jpg",
  "/src/assets/watches.jpg",
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=70",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=70",
];

// ── Filter option data ─────────────────────────────────────────────────────
export const BRANDS = [
  "Nike", "Adidas", "Jordan", "New Balance",
  "Supreme", "Off-White", "Yeezy", "Bape", "Puma", "Reebok",
];

export const CATEGORIES = ["Shoes", "Clothing", "Accessories", "Bags", "Headwear"];

export const CONDITIONS = ["New", "Like New", "Used"];

export const SIZES = [
  "6", "6.5", "7", "7.5", "8", "8.5",
  "9", "9.5", "10", "10.5", "11", "11.5", "12", "13",
];

export const SORT_OPTIONS: Record<string, string> = {
  newest:      "Newest First",
  "price-asc": "Price ↑",
  "price-desc":"Price ↓",
  popular:     "Most Popular",
};

// ── Product catalogue (mock) ───────────────────────────────────────────────
const PRODUCT_NAMES = [
  "Air Force 1 Low", "Yeezy 350 V2", "Jordan 1 Retro", "Stan Smith",
  "990v5", "Old Skool", "Dunk Low", "Ultra Boost",
  "Chuck 70", "Blazer Mid", "Samba OG", "Foam Runner",
];

const PRODUCT_PRICES = [120, 180, 320, 95, 175, 85, 210, 190, 75, 145, 260, 310];
const SALE_PRICES    = [160, 240, 380, 130];

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  condition: string;
  category: string;
  img: string;
  isNew: boolean;
  isHot: boolean;
}

export const PRODUCTS: Product[] = Array.from({ length: 36 }, (_, i) => ({
  id:            i + 1,
  name:          PRODUCT_NAMES[i % 12],
  brand:         BRANDS[i % BRANDS.length],
  price:         PRODUCT_PRICES[i % 12],
  originalPrice: i % 4 === 0 ? SALE_PRICES[i % 4] : null,
  condition:     CONDITIONS[i % 3],
  category:      CATEGORIES[i % 5],
  img:           PRODUCT_IMGS[i % PRODUCT_IMGS.length],
  isNew:         i % 5 === 0,
  isHot:         i % 7 === 0,
}));
