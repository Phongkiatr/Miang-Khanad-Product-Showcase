/**
 * API Service Layer
 * Handles communication with the backend API.
 */

// ─── Backend Schema Types ──────────────────────────────────────────────────

export interface ApiItemVar {
  id: number;
  color: string | null;
  ssize: string | null; // shirt size
  tsize: string | null; // instrument size / other
  imgsrc: string | null; // image for this specific variant
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
  variants: ApiItemVar[]; // Array of variants (formerly item_var)
}

/**
 * Standardized Pagination Response from API
 */
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

// ─── API Configuration ──────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Custom fetch wrapper with error handling and default headers
 */
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = sessionStorage.getItem('mk_admin_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error ${res.status}`);
  }

  return res.json();
}

// ─── Item Endpoints ──────────────────────────────────────────────────────────

export interface GetItemsParams {
  page?: number;
  limit?: number;
  category?: number;
  search?: string;
}

/**
 * Fetch products with pagination and filters
 */
export async function fetchItems(params: GetItemsParams = {}) {
  const qs = new URLSearchParams();
  if (params.page)     qs.set('page',     String(params.page));
  if (params.limit)    qs.set('limit',    String(params.limit));
  if (params.category) qs.set('category', String(params.category));
  if (params.search)   qs.set('search',   params.search);

  const query = qs.toString() ? `?${qs}` : '';
  return apiFetch<ApiListResponse<ApiItem>>(`/api/items${query}`);
}

/**
 * Fetch a single product by ID
 */
export async function fetchItemById(id: number) {
  return apiFetch<ApiSingleResponse<ApiItem>>(`/api/items/${id}`);
}

// ─── Category Endpoints ──────────────────────────────────────────────────────

/**
 * Fetch all product categories
 */
export async function fetchItemTypes() {
  return apiFetch<ApiSingleResponse<ApiItemType[]>>('/api/item-types');
}

// ─── Inquiry Logging ──────────────────────────────────────────────────────────

/**
 * Records a customer's interest in a specific item.
 * Called immediately before redirection to LINE OA.
 */
export async function logInquiry(itemId: number) {
  return apiFetch('/api/inquiry-logs', {
    method: 'POST',
    body: JSON.stringify({ items: itemId }),
  });
}

// ─── Admin Tools ─────────────────────────────────────────────────────────────

/**
 * Generic fetcher for the Database Browser panel
 */
export async function fetchTableData(tableName: string, page: number = 1, limit: number = 100) {
  const qs = new URLSearchParams();
  qs.set('page', String(page));
  qs.set('limit', String(limit));
  
  // Resolve endpoint name from table identifier
  const endpoint = tableName.startsWith('/') ? tableName : `/api/${tableName}`;
  
  return apiFetch<ApiListResponse<any>>(`${endpoint}?${qs}`);
}

/**
 * Authentication
 */
export async function login(password: string) {
  return apiFetch<ApiSingleResponse<{ token: string }>>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

// ─── Media Management ─────────────────────────────────────────────────────────

export interface ApiMediaFile {
  name: string;
  url: string;
  created_at: string;
  metadata: {
    mimetype: string;
    size: number;
  };
}

/**
 * Fetch all images from the gallery storage
 */
export async function fetchMediaList() {
  return apiFetch<ApiSingleResponse<ApiMediaFile[]>>('/api/media');
}

/**
 * Upload an image to storage
 */
export async function uploadImage(file: File, customName?: string) {
  const formData = new FormData();
  formData.append('image', file);
  if (customName) {
    formData.append('customName', customName);
  }

  const token = sessionStorage.getItem('mk_admin_token');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}/api/media/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Upload error ${res.status}`);
  }

  return res.json() as Promise<ApiSingleResponse<{ name: string; url: string }>>;
}

/**
 * Delete an image by name
 */
export async function deleteImage(name: string) {
  return apiFetch(`/api/media/${name}`, {
    method: 'DELETE',
  });
}
