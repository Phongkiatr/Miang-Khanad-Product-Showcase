import { useState, useEffect } from 'react';
import {
  fetchItems,
  fetchItemById,
  fetchItemTypes,
  GetItemsParams,
  ApiItem,
  ApiItemType,
} from '../services/api';

// ─── useProducts ─────────────────────────────────────────────────────────────

interface UseProductsResult {
  items: ApiItem[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  refetch: () => void;
}

export function useProducts(params: GetItemsParams = {}): UseProductsResult {
  const [items, setItems]           = useState<ApiItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [tick, setTick]             = useState(0);

  // Serialize params so useEffect detects changes
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchItems(params)
      .then((res) => {
        if (cancelled) return;
        setItems(res.data);
        setTotal(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey, tick]);

  return { items, loading, error, total, totalPages, refetch: () => setTick((t) => t + 1) };
}

// ─── useProduct (single) ─────────────────────────────────────────────────────

interface UseProductResult {
  item: ApiItem | null;
  loading: boolean;
  error: string | null;
}

export function useProduct(id: number | null): UseProductResult {
  const [item, setItem]       = useState<ApiItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchItemById(id)
      .then((res) => { if (!cancelled) setItem(res.data); })
      .catch((err: Error) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [id]);

  return { item, loading, error };
}

// ─── useItemTypes ─────────────────────────────────────────────────────────────

interface UseItemTypesResult {
  itemTypes: ApiItemType[];
  loading: boolean;
}

export function useItemTypes(): UseItemTypesResult {
  const [itemTypes, setItemTypes] = useState<ApiItemType[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetchItemTypes()
      .then((res) => setItemTypes(res.data as unknown as ApiItemType[]))
      .catch(() => {/* silently fail — categories still work without it */})
      .finally(() => setLoading(false));
  }, []);

  return { itemTypes, loading };
}
