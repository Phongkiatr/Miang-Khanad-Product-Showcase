import { useSettings } from '../context/SettingsContext';

const LineIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.63 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

/**
 * Footer Component
 * ส่วนท้ายของเว็บไซต์ แสดงข้อมูลแบรนด์ ลิงก์สินค้า และช่องทางการติดต่อ
 */

export default function Footer() {
  const { settings } = useSettings();
  const lineUrl = `https://line.me/R/ti/p/${settings.line_id.startsWith('@') ? settings.line_id : `@${settings.line_id}`}`;

  return (
    <footer className="bg-charcoal text-white px-6 pt-16 pb-10 mt-30">
      <div className="max-w-6xl mx-auto">

        {/* ตารางข้อมูลหลัก (Top Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-16">

          {/* ข้อมูลแบรนด์และปรัชญา (Brand Identity) */}
          <div>
            <div className="mb-4">
              <div className="text-2xl font-bold tracking-wide mb-1">เมียงขนาด</div>
              <div className="text-[10px] text-gold tracking-[0.3em] uppercase font-light">MIANG KHANAD</div>
            </div>
            <p className="text-sm font-light text-white/60 leading-loose max-w-[260px]">
              ยกระดับงานหัตถกรรมล้านนาสู่ Minimal Luxury
              <br />ด้วยคุณภาพที่ไม่ประนีประนอม
            </p>
          </div>

          {/* รายการหมวดหมู่สินค้าหลัก (Quick Links) */}
          <div>
            <h4 className="text-[12px] tracking-[0.25em] uppercase text-gold font-normal mb-5">สินค้า</h4>
            <ul className="flex flex-col gap-3">
              {['เครื่องแต่งกาย', 'เครื่องดนตรีพื้นเมือง', 'คอลเลกชันใหม่'].map((item) => (
                <li
                  key={item}
                  className="text-sm font-light text-white/60 cursor-pointer hover:text-white transition-colors duration-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ข้อมูลการติดต่อและที่อยู่ (Contact Info) */}
          <div>
            <h4 className="text-[12px] tracking-[0.25em] uppercase text-gold font-normal mb-5">ติดต่อ</h4>
            <div className="flex flex-col gap-3">
              <a
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm font-light text-white/60
                           no-underline transition-colors duration-200 hover:text-[#06C755]"
              >
                <LineIcon />
                Line OA: {settings.line_id}
              </a>
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" 
                   className="text-sm font-light text-white/60 hover:text-white transition-colors">Facebook</a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" 
                   className="text-sm font-light text-white/60 hover:text-white transition-colors">Instagram</a>
              )}
              <span className="text-sm font-light text-white/60">📍 {settings.location}</span>
            </div>
          </div>
        </div>

        {/* แถบล่างสุด: ลิขสิทธิ์และสโลแกน (Bottom Bar) */}
        <div className="border-t border-white/10 pt-8 flex flex-wrap justify-between items-center gap-4">
          <p className="text-[13px] font-light text-white/35">
            © 2025 เมียงขนาด. สงวนลิขสิทธิ์
          </p>
          <p className="text-[11px] text-gold tracking-[0.2em] uppercase font-light">
            ลำดับแห่งล้านนา — crafted with love
          </p>
        </div>
      </div>
    </footer>
  );
}
