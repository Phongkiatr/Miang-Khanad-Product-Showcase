import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import { Modal, Confirm, Field, Empty, Spinner, Toast, SubmitBtn } from './AdminUI';

// ─── Generic CRUD panel used by both item_type and item_var ───────────────────
function SimpleListPanel<T extends { id: number; name?: string; color?: string; ssize?: string; tsize?: string }>({
  title,
  items,
  loading,
  onAdd,
  onEdit,
  onDelete,
  renderRow,
  renderBadge,
}: {
  title: string;
  items: T[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
  renderRow: (item: T) => React.ReactNode;
  renderBadge?: (item: T) => React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-charcoal">{title}</h3>
          <p className="text-xs text-muted font-light">{items.length} รายการ</p>
        </div>
        <button
          onClick={onAdd}
          className="px-3 py-1.5 bg-charcoal text-white text-xs border-none cursor-pointer
                     hover:bg-charcoal-light transition-colors font-sans"
        >
          + เพิ่ม
        </button>
      </div>

      {loading ? <Spinner /> : items.length === 0 ? <Empty label="ยังไม่มีข้อมูล" /> : (
        <div className="flex flex-col gap-0 border border-black/10">
          {items.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center justify-between px-4 py-3
                           ${i < items.length - 1 ? 'border-b border-black/5' : ''}
                           hover:bg-cream-dark transition-colors`}
            >
              <div className="flex items-center gap-3">
                {renderBadge?.(item)}
                <div>{renderRow(item)}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="text-xs px-2.5 py-1 border border-black/15 text-charcoal bg-transparent
                             hover:bg-cream-dark cursor-pointer transition-colors font-sans"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-xs px-2.5 py-1 border border-vermillion/30 text-vermillion bg-transparent
                             hover:bg-vermillion hover:text-white cursor-pointer transition-colors font-sans"
                >
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Item Types ───────────────────────────────────────────────────────────────
function ItemTypesSection() {
  const [types, setTypes]         = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState<number | null>(null);
  const [name, setName]           = useState('');
  const [saving, setSaving]       = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [toast, setToast]         = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.itemTypes.list();
      setTypes(res.data ?? []);
    } catch (err: any) {
      setToast({ msg: 'โหลดหมวดหมู่ล้มเหลว: ' + err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setName(''); setEditing(null); setShowModal(true); };
  const openEdit = (t: any) => { setName(t.name); setEditing(t.id); setShowModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.itemTypes.update(editing, { name });
      else await api.itemTypes.create({ name });
      setToast({ msg: editing ? 'แก้ไขสำเร็จ' : 'เพิ่มหมวดหมู่สำเร็จ', type: 'success' });
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
      await api.itemTypes.delete(confirmId);
      setToast({ msg: 'ลบหมวดหมู่สำเร็จ', type: 'success' });
      load();
    } catch (err: any) {
      setToast({ msg: err.message, type: 'error' });
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <>
      <SimpleListPanel
        title="หมวดหมู่สินค้า (item_type)"
        items={types}
        loading={loading}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={setConfirmId}
        renderBadge={(t) => (
          <span className="w-7 h-7 flex items-center justify-center bg-indigo-lanna text-white text-xs font-bold">
            {t.id}
          </span>
        )}
        renderRow={(t) => (
          <span className="text-sm font-semibold text-charcoal">{t.name}</span>
        )}
      />

      {showModal && (
        <Modal title={editing ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="ชื่อหมวดหมู่" required>
              <input
                className="w-full px-3 py-2.5 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
                value={name} onChange={(e) => setName(e.target.value)} required autoFocus
              />
            </Field>
            <SubmitBtn loading={saving} />
          </form>
        </Modal>
      )}

      {confirmId && (
        <Confirm
          message="ต้องการลบหมวดหมู่นี้หรือไม่? อาจส่งผลต่อสินค้าที่ใช้หมวดหมู่นี้อยู่"
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </>
  );
}

// ─── Item Vars ────────────────────────────────────────────────────────────────
const EMPTY_VAR = { color: '', ssize: '', tsize: '' };

function ItemVarsSection() {
  const [vars, setVars]           = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState<number | null>(null);
  const [form, setForm]           = useState(EMPTY_VAR);
  const [saving, setSaving]       = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [toast, setToast]         = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.itemVars.list();
      setVars(res.data ?? []);
    } catch (err: any) {
      setToast({ msg: 'โหลด variant ล้มเหลว: ' + err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(EMPTY_VAR); setEditing(null); setShowModal(true); };
  const openEdit = (v: any) => {
    setForm({ color: v.color ?? '', ssize: v.ssize ?? '', tsize: v.tsize ?? '' });
    setEditing(v.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        color: form.color || undefined,
        ssize: form.ssize || undefined,
        tsize: form.tsize || undefined,
      };
      if (editing) await api.itemVars.update(editing, body);
      else await api.itemVars.create(body);
      setToast({ msg: editing ? 'แก้ไขสำเร็จ' : 'เพิ่ม variant สำเร็จ', type: 'success' });
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
      await api.itemVars.delete(confirmId);
      setToast({ msg: 'ลบ variant สำเร็จ', type: 'success' });
      load();
    } catch (err: any) {
      setToast({ msg: err.message, type: 'error' });
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <>
      <SimpleListPanel
        title="ตัวเลือกสินค้า (item_var)"
        items={vars}
        loading={loading}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={setConfirmId}
        renderBadge={(v) => v.color ? (
          <div
            className="w-6 h-6 rounded-full border border-black/10 shrink-0"
            style={{ background: v.color }}
          />
        ) : (
          <span className="w-6 h-6 flex items-center justify-center bg-cream-dark text-muted text-xs">—</span>
        )}
        renderRow={(v) => (
          <div className="flex items-center gap-2 flex-wrap">
            {v.color && <span className="text-sm font-semibold text-charcoal">{v.color}</span>}
            {v.ssize && (
              <span className="text-xs px-2 py-0.5 bg-indigo-lanna/10 text-indigo-lanna font-semibold">
                เสื้อ: {v.ssize}
              </span>
            )}
            {v.tsize && (
              <span className="text-xs px-2 py-0.5 bg-gold/15 text-charcoal font-semibold">
                ทั่วไป: {v.tsize}
              </span>
            )}
          </div>
        )}
      />

      {showModal && (
        <Modal title={editing ? 'แก้ไข Variant' : 'เพิ่ม Variant ใหม่'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="สี" hint="ชื่อสีภาษาไทย เช่น ครามเข้ม, แดงชาด">
              <input
                className="w-full px-3 py-2.5 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
                value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="เช่น ครามเข้ม"
              />
            </Field>
            <Field label="ไซส์เสื้อ (ssize)" hint="S, M, L, XL">
              <input
                className="w-full px-3 py-2.5 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
                value={form.ssize} onChange={(e) => setForm({ ...form, ssize: e.target.value })}
                placeholder="M"
              />
            </Field>
            <Field label="ไซส์ทั่วไป (tsize)" hint="สำหรับเครื่องดนตรีหรือสินค้าอื่น">
              <input
                className="w-full px-3 py-2.5 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
                value={form.tsize} onChange={(e) => setForm({ ...form, tsize: e.target.value })}
                placeholder="เช่น มาตรฐาน, ใหญ่พิเศษ"
              />
            </Field>
            <SubmitBtn loading={saving} />
          </form>
        </Modal>
      )}

      {confirmId && (
        <Confirm
          message="ต้องการลบ variant นี้หรือไม่?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </>
  );
}

// ─── Export combined panel ────────────────────────────────────────────────────
export default function VariantsPanel() {
  return (
    <div>
      <h2 className="text-xl font-bold text-charcoal mb-8">หมวดหมู่ & Variants</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ItemTypesSection />
        <ItemVarsSection />
      </div>
    </div>
  );
}
