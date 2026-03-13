import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import { Modal, Confirm, Field, SubmitBtn, Empty, Spinner, Toast } from './AdminUI';
import { formatPrice } from '../../data/mockData';

const EMPTY_FORM = { name: '', description: '', price: '', item_type: '', item_var: '', imgsrc: '' };

export default function ItemsPanel() {
  const [items, setItems]       = useState<any[]>([]);
  const [types, setTypes]       = useState<any[]>([]);
  const [vars, setVars]         = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editing, setEditing]   = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsRes, typesRes, varsRes] = await Promise.all([
        api.items.list(),
        api.itemTypes.list(),
        api.itemVars.list(),
      ]);
      setItems(itemsRes.data ?? []);
      setTypes(typesRes.data ?? []);
      setVars(varsRes.data ?? []);
    } catch {
      setToast({ msg: 'โหลดข้อมูลล้มเหลว', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(EMPTY_FORM); setEditing(null); setShowModal(true); };
  const openEdit = (item: any) => {
    setForm({
      name: item.name ?? '',
      description: item.description ?? '',
      price: String(item.price ?? ''),
      item_type: String(item.item_type?.id ?? ''),
      item_var: String(item.item_var?.id ?? ''),
      imgsrc: item.imgsrc ?? '',
    });
    setEditing(item.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        name: form.name,
        description: form.description || undefined,
        price: parseFloat(form.price),
        item_type: form.item_type ? parseInt(form.item_type) : undefined,
        item_var: form.item_var ? parseInt(form.item_var) : undefined,
        imgsrc: form.imgsrc || undefined,
      };
      if (editing) await api.items.update(editing, body);
      else await api.items.create(body);
      setToast({ msg: editing ? 'แก้ไขสำเร็จ' : 'เพิ่มสินค้าสำเร็จ', type: 'success' });
      setShowModal(false);
      load();
    } catch (err: any) {
      setToast({ msg: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      await api.items.delete(confirmId);
      setToast({ msg: 'ลบสินค้าสำเร็จ', type: 'success' });
      load();
    } catch (err: any) {
      setToast({ msg: err.message, type: 'error' });
    } finally {
      setConfirmId(null);
    }
  };

  const filtered = items.filter((i) =>
    i.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-charcoal">สินค้า</h2>
          <p className="text-sm text-muted font-light">{items.length} รายการ</p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="ค้นหาชื่อสินค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans
                       focus:outline-none focus:border-charcoal w-52"
          />
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-charcoal text-white text-sm border-none cursor-pointer
                       hover:bg-charcoal-light transition-colors font-sans tracking-wide"
          >
            + เพิ่มสินค้า
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? <Spinner /> : filtered.length === 0 ? <Empty label="ยังไม่มีสินค้า" /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-black/10">
                {['ID', 'ภาพ', 'ชื่อสินค้า', 'หมวดหมู่', 'ราคา', 'Variant', ''].map((h) => (
                  <th key={h} className="text-left py-3 px-3 text-[11px] tracking-[0.15em] uppercase
                                         text-muted font-normal whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-black/5 hover:bg-cream-dark transition-colors">
                  <td className="py-3 px-3 text-muted font-light">{item.id}</td>
                  <td className="py-3 px-3">
                    {item.imgsrc
                      ? <img src={item.imgsrc} alt="" className="w-10 h-10 object-cover bg-cream-dark" />
                      : <div className="w-10 h-10 bg-cream-dark flex items-center justify-center text-muted text-xs">—</div>
                    }
                  </td>
                  <td className="py-3 px-3 font-semibold text-charcoal">{item.name}</td>
                  <td className="py-3 px-3 text-muted font-light">{item.item_type?.name ?? '—'}</td>
                  <td className="py-3 px-3 text-vermillion font-semibold">{formatPrice(item.price)}</td>
                  <td className="py-3 px-3 text-muted font-light text-xs">
                    {item.item_var ? `${item.item_var.color ?? ''} ${item.item_var.ssize ?? item.item_var.tsize ?? ''}`.trim() : '—'}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="text-xs px-3 py-1 border border-black/15 text-charcoal bg-transparent
                                   hover:bg-cream-dark cursor-pointer transition-colors font-sans"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => setConfirmId(item.id)}
                        className="text-xs px-3 py-1 border border-vermillion/30 text-vermillion bg-transparent
                                   hover:bg-vermillion hover:text-white cursor-pointer transition-colors font-sans"
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal title={editing ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'} onClose={() => setShowModal(false)} wide>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="ชื่อสินค้า" required>
              <input
                className="w-full px-3 py-2.5 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
              />
            </Field>
            <Field label="คำอธิบาย">
              <textarea
                rows={3}
                className="w-full px-3 py-2.5 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal resize-none"
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="ราคา (฿)" required>
                <input
                  type="number" min="0" step="0.01"
                  className="w-full px-3 py-2.5 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
                  value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required
                />
              </Field>
              <Field label="URL รูปภาพ">
                <input
                  className="w-full px-3 py-2.5 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
                  value={form.imgsrc} onChange={(e) => setForm({ ...form, imgsrc: e.target.value })}
                  placeholder="https://..."
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="หมวดหมู่ (item_type)">
                <select
                  className="w-full px-3 py-2.5 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal appearance-none"
                  value={form.item_type} onChange={(e) => setForm({ ...form, item_type: e.target.value })}
                >
                  <option value="">— เลือกหมวดหมู่ —</option>
                  {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </Field>
              <Field label="Variant (item_var)">
                <select
                  className="w-full px-3 py-2.5 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal appearance-none"
                  value={form.item_var} onChange={(e) => setForm({ ...form, item_var: e.target.value })}
                >
                  <option value="">— เลือก variant —</option>
                  {vars.map((v) => (
                    <option key={v.id} value={v.id}>
                      {[v.color, v.ssize, v.tsize].filter(Boolean).join(' / ')}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <SubmitBtn loading={saving} />
          </form>
        </Modal>
      )}

      {confirmId && (
        <Confirm
          message="ต้องการลบสินค้านี้ถาวรหรือไม่?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
