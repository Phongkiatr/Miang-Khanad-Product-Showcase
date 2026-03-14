const BASE = import.meta.env.VITE_API_URL || '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = sessionStorage.getItem('mk_admin_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    headers,
    ...options,
  });
  
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Request failed');
  return json;
}

// ── Items ─────────────────────────────────────────────────────────────────────
export const api = {
  items: {
    list:   (params: { search?: string; category?: number; page?: number; limit?: number } = {}) => {
      const qs = new URLSearchParams();
      if (params.search) qs.set('search', params.search);
      if (params.category) qs.set('category', String(params.category));
      if (params.page) qs.set('page', String(params.page));
      qs.set('limit', String(params.limit || 100));
      return request<any>(`/api/items?${qs.toString()}`);
    },
    get:    (id: number) => request<any>(`/api/items/${id}`),
    create: (body: object) => request<any>('/api/items', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: number, body: object) => request<any>(`/api/items/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: number) => request<any>(`/api/items/${id}`, { method: 'DELETE' }),
  },
  itemTypes: {
    list:   () => request<any>('/api/item-types'),
    create: (body: object) => request<any>('/api/item-types', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: number, body: object) => request<any>(`/api/item-types/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: number) => request<any>(`/api/item-types/${id}`, { method: 'DELETE' }),
  },
  itemVars: {
    list:   () => request<any>('/api/item-vars'),
    create: (body: object) => request<any>('/api/item-vars', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: number, body: object) => request<any>(`/api/item-vars/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (id: number) => request<any>(`/api/item-vars/${id}`, { method: 'DELETE' }),
  },
  inquiryLogs: {
    list:  (q = '') => request<any>(`/api/inquiry-logs?limit=100${q}`),
    stats: () => request<any>('/api/inquiry-logs/stats'),
    delete: (id: number) => request<any>(`/api/inquiry-logs/${id}`, { method: 'DELETE' }),
  },
  auth: {
    login: (password: string) => request<any>('/api/auth/login', { method: 'POST', body: JSON.stringify({ password }) }),
  },
  settings: {
    get:    () => request<any>('/api/settings'),
    update: (body: object) => request<any>('/api/settings', { method: 'PATCH', body: JSON.stringify(body) }),
  },
};
