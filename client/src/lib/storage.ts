import type { Brand, ClosetItem, ItemSource, ScanResult } from "../types";

const KEY = "closetVault:closetItems";
const _DEMO_USER_ID = "demo-user-1"; void _DEMO_USER_ID;

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getClosetItems(): ClosetItem[] {
  return safeParse<ClosetItem[]>(localStorage.getItem(KEY), []);
}

export function saveClosetItems(items: ClosetItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function getClosetItemById(id: string): ClosetItem | undefined {
  return getClosetItems().find((x) => x.id === id);
}

export function createClosetItemFromScan(params: {
  title: string;
  queryImageUrl: string; // local preview for now
  result: ScanResult;
  brand?: Brand;
  skuOrProductId?: string;
}): ClosetItem {
  const now = new Date();
  const id = crypto.randomUUID();

  const firstSource: ItemSource = {
    id: crypto.randomUUID(),
    brand: params.brand ?? "other",
    sourceUrl: params.result.sourceUrl,
    sourceDomain: params.result.sourceDomain,
    skuOrProductId: params.skuOrProductId,
    watching: true,
    currentPrice: undefined,
    previousPrice: undefined,
    currency: undefined,
    lastCheckedAt: undefined,
  };

  const item: ClosetItem = {
    id,
    title: params.title,
    queryImageUrl: params.queryImageUrl,
    createdAt: now.toISOString().slice(0, 10),
    sources: [firstSource],
    notes: "",
  };

  const all = getClosetItems();
  saveClosetItems([item, ...all]);
  return item;
}

export function updateClosetItem(id: string, patch: Partial<ClosetItem>) {
  const all = getClosetItems();
  const next = all.map((x) => (x.id === id ? { ...x, ...patch } : x));
  saveClosetItems(next);
}

export function addSourceToClosetItem(
  closetItemId: string,
  source: Omit<ItemSource, "id">
) {
  const all = getClosetItems();
  const next = all.map((x) => {
    if (x.id !== closetItemId) return x;
    const newSource: ItemSource = { ...source, id: crypto.randomUUID() };
    return { ...x, sources: [newSource, ...x.sources] };
  });
  saveClosetItems(next);
}

export function toggleSourceWatching(sourceId: string) {
  const all = getClosetItems();
  const next = all.map((item) => ({
    ...item,
    sources: item.sources.map((s) =>
      s.id === sourceId ? { ...s, watching: !s.watching } : s
    ),
  }));
  saveClosetItems(next);
}

export function clearCloset() {
  localStorage.removeItem(KEY);
}
