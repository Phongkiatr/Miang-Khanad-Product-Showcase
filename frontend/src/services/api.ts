// ─── Types ที่ตรงกับ Backend Schema ──────────────────────────────────────────

export interface ApiItemVar {
  id: number;
  color: string | null;
  ssize: string | null; // shirt size
  tsize: string | null; // instrument size / other
}

export interface ApiItemType {
  id: number;
  name: string;
}

export interface ApiItem {
  id: number;
  created_at: string;
  name: string;
  description: string | null;
  price: number;
  imgsrc: string | null;
  item_type: ApiItemType | null;
  item_var: ApiItemVar | null;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiSingleResponse<T> {
  success: boolean;
  data: T;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error ${res.status}`);
  }

  return res.json();
}

// ─── Items ────────────────────────────────────────────────────────────────────

export interface GetItemsParams {
  page?: number;
  limit?: number;
  category?: number;
  search?: string;
}

export async function fetchItems(params: GetItemsParams = {}) {
  const qs = new URLSearchParams();
  if (params.page)     qs.set('page',     String(params.page));
  if (params.limit)    qs.set('limit',    String(params.limit));
  if (params.category) qs.set('category', String(params.category));
  if (params.search)   qs.set('search',   params.search);

  const query = qs.toString() ? `?${qs}` : '';
  return apiFetch<ApiListResponse<ApiItem>>(`/api/items${query}`);
}

export async function fetchItemById(id: number) {
  return apiFetch<ApiSingleResponse<ApiItem>>(`/api/items/${id}`);
}

// ─── Item Types ───────────────────────────────────────────────────────────────

export async function fetchItemTypes() {
  return apiFetch<ApiSingleResponse<ApiItemType[]>>('/api/item-types');
}

// ─── Inquiry Logs ─────────────────────────────────────────────────────────────

/**
 * เรียกก่อนเปิด Line OA ทุกครั้ง เพื่อ log ว่าลูกค้าสนใจสินค้าชิ้นไหน
 */
export async function logInquiry(itemId: number) {
  return apiFetch('/api/inquiry-logs', {
    method: 'POST',
    body: JSON.stringify({ items: itemId }),
  });
}
