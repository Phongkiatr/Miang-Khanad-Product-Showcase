import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Spinner } from './AdminUI';

export default function SettingsPanel() {
  const { settings, loading, update } = useSettings();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(settings);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await update(form);
      setToast({ msg: 'บันทึกการตั้งค่าสำเร็จ', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      setToast({ msg: err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-charcoal">ค่ากำหนด (Settings)</h2>
        <p className="text-sm text-muted font-light">จัดการข้อมูลการติดต่อและลิงก์โซเชียลของร้าน</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">Line OA ID</label>
            <input
              type="text"
              value={form.line_id}
              onChange={(e) => setForm({ ...form, line_id: e.target.value })}
              className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
              placeholder="@example"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">ที่อยู่ / พิกัด</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">Facebook URL</label>
            <input
              type="text"
              value={form.facebook}
              onChange={(e) => setForm({ ...form, facebook: e.target.value })}
              className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
              placeholder="https://facebook.com/..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">Instagram URL</label>
            <input
              type="text"
              value={form.instagram}
              onChange={(e) => setForm({ ...form, instagram: e.target.value })}
              className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-2.5 bg-charcoal text-white text-sm border-none cursor-pointer
                       hover:bg-charcoal-light transition-colors font-sans tracking-widest uppercase disabled:opacity-50"
          >
            {saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
          </button>
        </div>
      </form>

      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-3 text-sm text-white shadow-lg z-[100] animate-slide-up
                        ${toast.type === 'success' ? 'bg-charcoal' : 'bg-vermillion'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
