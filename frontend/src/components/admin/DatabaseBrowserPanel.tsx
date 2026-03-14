import { useState, useEffect } from 'react';
import { fetchTableData } from '../../services/api';

const TABLES = [
  { id: 'items', name: 'Items (สินค้า)' },
  { id: 'item-types', name: 'Item Types (หมวดหมู่)' },
  { id: 'item-vars', name: 'Item Variants (ตัวเลือก)' },
  { id: 'inquiry-logs', name: 'Inquiry Logs (ประวัติการถาม)' },
];

/**
 * DatabaseBrowserPanel Component
 * เครื่องมือสำหรับ Admin ในการสืบค้นข้อมูลดิบจากตารางต่างๆ ใน Database
 * รองรับการเลือกตาราง, การดึงข้อมูลอัตโนมัติ และการแสดงผล Object ให้สวยงาม
 */
export default function DatabaseBrowserPanel() {
  const [selectedTable, setSelectedTable] = useState(TABLES[0].id);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ดึงข้อมูลใหม่ทุกครั้งที่ผู้ใช้เปลี่ยนตาราง
  useEffect(() => {
    loadData();
  }, [selectedTable]);

  /**
   * ฟังก์ชันหลักในการดึงข้อมูลจาก API
   */
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTableData(selectedTable);
      setData(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * ดึงชื่อ Column ทั้งหมดจากข้อมูลแถวแรกมาสร้างหัวตาราง (Dynamic Header)
   */
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header และตัวเลือกตาราง */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal">Database Browser</h2>
          <p className="text-sm text-muted font-light">ดูข้อมูลดิบจากตารางในระบบ</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-charcoal uppercase tracking-wider">เลือกตาราง:</label>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="px-3 py-2 bg-white border border-black/10 text-sm focus:outline-none focus:border-gold"
          >
            {TABLES.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 bg-white border border-black/10 hover:bg-cream-dark transition-colors"
            title="Refresh"
          >
            ↻
          </button>
        </div>
      </div>

      {/* ส่วนตารางแสดงข้อมูล */}
      <div className="bg-white border border-black/10 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center animate-pulse text-muted">กำลังโหลดข้อมูล...</div>
        ) : error ? (
          <div className="p-20 text-center text-vermillion">
            <p className="font-bold mb-2">เกิดข้อผิดพลาด</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="p-20 text-center text-muted">ไม่พบข้อมูลในตารางนี้</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-cream-dark border-b border-black/10">
                  {columns.map((col) => (
                    <th key={col} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-charcoal/60">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {data.map((row, i) => (
                  <tr key={i} className="hover:bg-cream/30 transition-colors">
                    {columns.map((col) => {
                      const val = row[col];
                      let display = '';
                      
                      // Logic การจัดฟอร์แมตข้อมูลในแต่ละ Cell
                      if (val === null || val === undefined) {
                        display = '-';
                      } else if (Array.isArray(val)) {
                        display = `[Array(${val.length})]`;
                      } else if (typeof val === 'object') {
                        // Smart display สำหรับข้อมูลที่เชื่อมโยง (Joined Objects)
                        // พยายามแสดง [#ID] Name ถ้ามีข้อมูลให้แสดง
                        if (val.id && val.name) display = `[#${val.id}] ${val.name}`;
                        else if (val.name) display = String(val.name);
                        else if (val.id) display = `#${val.id}`;
                        else display = JSON.stringify(val);
                      } else {
                        display = String(val);
                      }

                      return (
                        <td key={col} className="px-4 py-3 text-xs font-light text-charcoal truncate max-w-[250px]" title={typeof val === 'object' ? JSON.stringify(val, null, 2) : display}>
                          {display}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="text-[11px] text-muted text-right italic font-light">
        แสดงข้อมูลล่าสุด (Raw Data View)
      </div>
    </div>
  );
}
