export type Brand = "adidas" | "shein" | "nike" | "other";

export type ScanResult = {
  id: string;
  title: string;
  imageUrl: string;
  sourceUrl: string;
  sourceDomain: string;
};

export type ItemSource = {
  id: string;
  brand: Brand;
  sourceUrl: string;
  sourceDomain: string;
  skuOrProductId?: string;
  watching: boolean;
  currentPrice?: number;
  previousPrice?: number;
  currency?: string;
  lastCheckedAt?: string;
};

export type ClosetItem = {
  id: string;
  title: string;
  queryImageUrl: string;
  createdAt: string;
  sources: ItemSource[];
  notes?: string;
};