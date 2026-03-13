const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Request failed');
  return json;
}

// ── Items ─────────────────────────────────────────────────────────────────────
export const api = {
  items: {
    list:   (q = '') => request<any>(`/api/items?limit=100${q}`),
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
};
