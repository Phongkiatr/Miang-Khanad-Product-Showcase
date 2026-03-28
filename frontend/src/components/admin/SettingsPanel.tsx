import { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Spinner } from './AdminUI';

export default function SettingsPanel() {
  const { settings, loading, update } = useSettings();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(settings);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Sync form with settings once loaded
  useEffect(() => {
    if (!loading) {
      setForm(settings);
    }
  }, [loading, settings]);

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

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Contact & Links */}
        <section>
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gold mb-6 pb-2 border-b border-white/5">
            ข้อมูลการติดต่อ & โซเชียล
          </h3>
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
        </section>

        {/* Hero Section */}
        <section>
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gold mb-6 pb-2 border-b border-white/5">
            ส่วน Hero (หน้าแรก)
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">Hero Label</label>
              <input
                type="text"
                value={form.hero_label}
                onChange={(e) => setForm({ ...form, hero_label: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">Hero Title 1</label>
                <input
                  type="text"
                  value={form.hero_title_1}
                  onChange={(e) => setForm({ ...form, hero_title_1: e.target.value })}
                  className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">Hero Title 2 (เน้นสี)</label>
                <input
                  type="text"
                  value={form.hero_title_2}
                  onChange={(e) => setForm({ ...form, hero_title_2: e.target.value })}
                  className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">Hero Subtitle</label>
              <textarea
                value={form.hero_subtitle}
                onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}
                rows={3}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal resize-none"
              />
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section>
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gold mb-6 pb-2 border-b border-white/5">
            ส่วนเรื่องราว (Brand Story)
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">Title Part 1</label>
                <input
                  type="text"
                  value={form.brand_story_title_1}
                  onChange={(e) => setForm({ ...form, brand_story_title_1: e.target.value })}
                  className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">Title Part 2 (ทอง)</label>
                <input
                  type="text"
                  value={form.brand_story_title_2}
                  onChange={(e) => setForm({ ...form, brand_story_title_2: e.target.value })}
                  className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">คำบรรยาย 1</label>
              <textarea
                value={form.brand_story_desc_1}
                onChange={(e) => setForm({ ...form, brand_story_desc_1: e.target.value })}
                rows={3}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal resize-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">คำบรรยาย 2</label>
              <textarea
                value={form.brand_story_desc_2}
                onChange={(e) => setForm({ ...form, brand_story_desc_2: e.target.value })}
                rows={3}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal resize-none"
              />
            </div>
          </div>
        </section>

        {/* Other Sections */}
        <section>
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gold mb-6 pb-2 border-b border-white/5">
            ส่วนอื่น ๆ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">Featured Label</label>
              <input
                type="text"
                value={form.featured_label}
                onChange={(e) => setForm({ ...form, featured_label: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">Featured Title</label>
              <input
                type="text"
                value={form.featured_title}
                onChange={(e) => setForm({ ...form, featured_title: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
              />
            </div>
            <div className="flex flex-col gap-2 col-span-full">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">Contact Section Title</label>
              <input
                type="text"
                value={form.contact_title}
                onChange={(e) => setForm({ ...form, contact_title: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
              />
            </div>
            <div className="flex flex-col gap-2 col-span-full">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">Contact Section Subtitle</label>
              <input
                type="text"
                value={form.contact_subtitle}
                onChange={(e) => setForm({ ...form, contact_subtitle: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
              />
            </div>
          </div>
        </section>

        {/* Hero Stats */}
        <section>
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gold mb-6 pb-2 border-b border-white/5">
            สถิติ Hero (Stats)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">ตัวเลข 1</label>
              <input type="text" value={form.stat_num_1} onChange={(e) => setForm({ ...form, stat_num_1: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">คำอธิบาย 1</label>
              <input type="text" value={form.stat_label_1} onChange={(e) => setForm({ ...form, stat_label_1: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">ตัวเลข 2</label>
              <input type="text" value={form.stat_num_2} onChange={(e) => setForm({ ...form, stat_num_2: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">คำอธิบาย 2</label>
              <input type="text" value={form.stat_label_2} onChange={(e) => setForm({ ...form, stat_label_2: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">ตัวเลข 3</label>
              <input type="text" value={form.stat_num_3} onChange={(e) => setForm({ ...form, stat_num_3: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">คำอธิบาย 3</label>
              <input type="text" value={form.stat_label_3} onChange={(e) => setForm({ ...form, stat_label_3: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal" />
            </div>
          </div>
        </section>

        {/* Footer */}
        <section>
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gold mb-6 pb-2 border-b border-white/5">
            ส่วนท้าย (Footer)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">ชื่อแบรนด์ (ไทย)</label>
              <input type="text" value={form.footer_brand_name} onChange={(e) => setForm({ ...form, footer_brand_name: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">ชื่อแบรนด์ (EN)</label>
              <input type="text" value={form.footer_brand_name_en} onChange={(e) => setForm({ ...form, footer_brand_name_en: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal" />
            </div>
            <div className="flex flex-col gap-2 col-span-full">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">คำอธิบายแบรนด์ (ขึ้นบรรทัดใหม่ด้วย \n)</label>
              <textarea value={form.footer_brand_desc} onChange={(e) => setForm({ ...form, footer_brand_desc: e.target.value })}
                rows={2} className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal resize-none" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">หัวข้อสินค้า</label>
              <input type="text" value={form.footer_product_heading} onChange={(e) => setForm({ ...form, footer_product_heading: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">หัวข้อติดต่อ</label>
              <input type="text" value={form.footer_contact_heading} onChange={(e) => setForm({ ...form, footer_contact_heading: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal" />
            </div>
            <div className="flex flex-col gap-2 col-span-full">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">รายการสินค้า (คั่นด้วย ,)</label>
              <input type="text" value={form.footer_product_list} onChange={(e) => setForm({ ...form, footer_product_list: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal"
                placeholder="เครื่องแต่งกาย, เครื่องดนตรีพื้นเมือง, คอลเลกชันใหม่" />
            </div>
            <div className="flex flex-col gap-2 col-span-full">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">Copyright</label>
              <input type="text" value={form.footer_copyright} onChange={(e) => setForm({ ...form, footer_copyright: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal" />
            </div>
            <div className="flex flex-col gap-2 col-span-full">
              <label className="text-[11px] tracking-[0.2em] uppercase text-muted font-normal">สโลแกน</label>
              <input type="text" value={form.footer_slogan} onChange={(e) => setForm({ ...form, footer_slogan: e.target.value })}
                className="px-3 py-2 border border-black/15 bg-cream text-sm font-sans focus:outline-none focus:border-charcoal" />
            </div>
          </div>
        </section>

        <div className="pt-4 pb-10">
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
