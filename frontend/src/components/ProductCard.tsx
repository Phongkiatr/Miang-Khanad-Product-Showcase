import { useState } from 'react';
import { ApiItem, logInquiry } from '../services/api';
import { formatPrice, buildLineMessage, buildLineUrl } from '../utils/productUtils';

interface ProductCardProps {
  item: ApiItem;
  onSelect: (id: number) => void;
}

const LineIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.63 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

/**
 * ProductCard Component
 * แสดงหน้าปกสินค้าในรูปแบบ Card สำหรับหน้าแรกและหน้ารวมสินค้า
 * มาพร้อมระบบ Hover Effect และปุ่มลัดสำหรับติดต่อผ่าน LINE
 */
export default function ProductCard({ item, onSelect }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  // เตรียมข้อมูลพื้นฐาน
  const categoryLabel = item.item_type?.name ?? 'สินค้า';
  const imgSrc = item.imgsrc ?? 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80';

  /**
   * จัดการเมื่อผู้ใช้กดปุ่ม LINE บนตัวบัตรสินค้า
   * - บันทึก Log การสอบถามลงฐานข้อมูล (Log Inquiry)
   * - เปิดแอป LINE พร้อมข้อความอัตโนมัติ
   */
  const handleLineClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // สำคัญ: ป้องกันไม่ให้ Event ไหลไปที่ตัว Card (ซึ่งจะทำให้เปลี่ยนหน้า)
    
    try {
      // บันทึกความสนใจสินค้าชิ้นนี้ลง Database
      await logInquiry(item.id);
    } catch (err) {
      console.warn('Failed to log inquiry:', err);
    }

    // สร้างข้อความและเปิดลิงก์ LINE OA
    const variants = Array.isArray(item.variants) ? item.variants : [];
    const firstColor = variants.length > 0 ? variants[0].color : undefined;
    const msg = buildLineMessage(item.name, firstColor || undefined);
    window.open(buildLineUrl(msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      onClick={() => onSelect(item.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col cursor-pointer group"
    >
      {/* ส่วนรูปภาพสินค้าและปุ่มสั่งซื้อที่ซ่อนไว้ */}
      <div
        className="relative overflow-hidden bg-cream-dark"
        style={{ aspectRatio: '3 / 4' }}
      >
        <img
          src={imgSrc}
          alt={item.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500
            ${hovered ? 'scale-[1.04]' : 'scale-100'}`}
        />

        {/* ป้ายแสดงหมวดหมู่สินค้า */}
        <span className="absolute top-4 left-4 bg-cream/90 backdrop-blur-sm
                          px-2.5 py-1 text-[10px] tracking-[0.15em] text-charcoal">
          {categoryLabel}
        </span>

        {/* ปุ่ม LINE ที่จะปรากฏขึ้นเมื่อเอาเมาส์มาวาง (Hover) */}
        <div 
          className={`absolute bottom-4 right-4 transition-all duration-300 transform
                      ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          <button
            onClick={handleLineClick}
            className="w-10 h-10 bg-[#06C755] text-white flex items-center justify-center
                       rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform
                       cursor-pointer border-none"
            title="สอบถามผ่าน Line"
          >
            <LineIcon />
          </button>
        </div>

        {/* Overlay แสดงข้อความ "ดูรายละเอียด" เมื่อ Hover */}
        <div
          className={`absolute inset-0 bg-charcoal/10 transition-opacity duration-300
                      flex items-center justify-center pointer-events-none
                      ${hovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <span
            className={`text-white text-[10px] bg-charcoal/40 px-3 py-1.5 backdrop-blur-sm
                        tracking-[0.2em] uppercase transition-transform duration-300
                        ${hovered ? 'translate-y-0' : 'translate-y-1'}`}
          >
            ดูรายละเอียด
          </span>
        </div>
      </div>

      {/* ส่วนแสดงข้อมูลทางข้อความ (ชื่อสินค้า, ตัวเลือก, ราคา) */}
      <div className="pt-5 border-t border-black/10 flex flex-col gap-1.5">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-charcoal leading-snug">
              {item.name}
            </h3>
            
            {/* รายละเอียดตัวเลือก (เช่น สี, ไซส์) ถ้ามีข้อมูล */}
            {Array.isArray(item.variants) && item.variants.length > 0 && (
              <p className="text-[13px] font-light text-muted mt-0.5 truncate">
                {[
                  ...Array.from(new Set(item.variants.map(v => v.color).filter(Boolean))),
                  ...Array.from(new Set(item.variants.map(v => v.ssize || v.tsize).filter(Boolean)))
                ].join(', ')}
              </p>
            )}
          </div>

          {/* ราคาแสดงผลสินค้า */}
          <span className={`text-base font-semibold ml-4 shrink-0 whitespace-nowrap transition-colors duration-200
                            ${hovered ? 'text-vermillion' : 'text-charcoal'}`}>
            {formatPrice(item.price)}
          </span>
        </div>
      </div>
    </article>
  );
}
