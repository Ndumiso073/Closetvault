import type { ClosetItem } from "../types";

export const mockCloset: ClosetItem[] = [
  {
    id: "c1",
    title: "Black Tech Hoodie",
    queryImageUrl: "/src/assets/supreme-viewed.jpg",
    createdAt: "2026-02-26",
    notes: "Watch for price drop before end of month.",
    sources: [
      {
        id: "s1",
        brand: "adidas",
        sourceUrl: "https://example.com/adidas/hoodie",
        sourceDomain: "example.com",
        skuOrProductId: "AD-22331",
        watching: true,
        currentPrice: 1299,
        previousPrice: 1499,
        currency: "ZAR",
        lastCheckedAt: "2026-02-26 08:00",
      },
      {
        id: "s2",
        brand: "shein",
        sourceUrl: "https://example.com/shein/hoodie",
        sourceDomain: "example.com",
        watching: true,
        currentPrice: 499,
        previousPrice: 499,
        currency: "ZAR",
        lastCheckedAt: "2026-02-26 08:00",
      },
    ],
  },
  {
    id: "c2",
    title: "White Sneakers",
    queryImageUrl: "/src/assets/nice-airforce1.jpg",
    createdAt: "2026-02-20",
    sources: [
      {
        id: "s3",
        brand: "nike",
        sourceUrl: "https://example.com/nike/shoes",
        sourceDomain: "example.com",
        skuOrProductId: "NK-99810",
        watching: false,
        currentPrice: 1899,
        previousPrice: 2099,
        currency: "ZAR",
        lastCheckedAt: "2026-02-25 12:10",
      },
    ],
  },
];