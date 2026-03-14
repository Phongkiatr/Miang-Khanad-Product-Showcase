import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import { StatCard, Empty, Spinner, Toast } from './AdminUI';

export default function InquiryLogsPanel() {
  const [logs, setLogs]         = useState<any[]>([]);
  const [stats, setStats]       = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [logsRes, statsRes] = await Promise.all([
        api.inquiryLogs.list(),
        api.inquiryLogs.stats(),
      ]);
      setLogs(logsRes.data ?? []);
      setStats(statsRes.data ?? null);
    } catch {
      setToast({ msg: 'โหลดข้อมูลล้มเหลว', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);


  return (
    <div>
      <h2 className="text-xl font-bold text-charcoal mb-6">Inquiry Logs</h2>
      <p className="text-sm text-muted font-light mb-8">
        บันทึกทุกครั้งที่ลูกค้ากดปุ่ม "สั่งซื้อผ่าน Line"
      </p>

      {/* Stats */}
      {stats && (
        <div className="mb-10">
          <p className="label-section mb-4">ภาพรวม</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatCard label="Inquiries ทั้งหมด" value={stats.total} accent />
            {stats.topItems?.[0] && (
              <StatCard label="สินค้ายอดนิยม" value={stats.topItems[0].name} />
            )}
            {stats.topItems?.[0] && (
              <StatCard label="Inquiries สูงสุด" value={`${stats.topItems[0].inquiry_count} ครั้ง`} />
            )}
            <StatCard label="สินค้าที่ถูก inquire" value={stats.topItems?.length ?? 0} />
          </div>

          {/* Top 5 chart */}
          {stats.topItems?.length > 0 && (
            <div>
              <p className="text-[12px] tracking-[0.2em] uppercase text-muted mb-3 font-normal">
                Top 5 สินค้าที่สนใจมากที่สุด
              </p>
              <div className="flex flex-col gap-2">
                {stats.topItems.map((item: any, i: number) => {
                  const max = stats.topItems[0].inquiry_count;
                  const pct = Math.round((item.inquiry_count / max) * 100);
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <span className="text-xs text-muted w-4 text-right">{i + 1}</span>
                      <div className="flex-1 flex items-center gap-3">
                        <span className="text-sm font-semibold text-charcoal w-36 truncate shrink-0">
                          {item.name}
                        </span>
                        <div className="flex-1 bg-cream-dark h-4 relative overflow-hidden">
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-indigo-lanna transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-charcoal w-10 text-right shrink-0">
                          {item.inquiry_count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Log table */}
      <p className="label-section mb-4">รายการล่าสุด</p>

      {loading ? <Spinner /> : logs.length === 0 ? <Empty label="ยังไม่มี inquiry log" /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-black/10">
                {['ID', 'สินค้า', 'เวลา'].map((h) => (
                  <th key={h} className="text-left py-3 px-3 text-[11px] tracking-[0.15em] uppercase text-muted font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-black/5 hover:bg-cream-dark transition-colors">
                  <td className="py-3 px-3 text-muted font-light">{log.id}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      {log.Items?.imgsrc && (
                        <img src={log.Items.imgsrc} alt="" className="w-8 h-8 object-cover bg-cream-dark shrink-0" />
                      )}
                      <span className="font-semibold text-charcoal">
                        {log.Items ? `[#${log.Items.id}] ${log.Items.name}` : '—'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-muted font-light text-xs">
                    {new Date(log.created_at).toLocaleString('th-TH', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
