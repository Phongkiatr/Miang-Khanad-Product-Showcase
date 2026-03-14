import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct, useProducts } from '../hooks/useProducts';
import { logInquiry } from '../services/api';
import { formatPrice, buildLineMessage, buildLineUrl } from '../data/mockData';
import ProductCard from '../components/ProductCard';

// interface Props removed

const LineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.63 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

/**
 * ProductDetailPage Component
 * หน้าแสดงรายละเอียดสินค้าเชิงลึก พร้อมข้อมูลตัวเลือกสินค้า (Variants), 
 * ระบบซูมรูปภาพ และปุ่มสั่งซื้อที่เชื่อมโยงกับ LINE OA
 */

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const numericId = Number(productId);
  
  // Hook สำหรับดึงข้อมูลสินค้าชิ้นเดียวจากฐานข้อมูล
  const { item, loading, error } = useProduct(isNaN(numericId) ? null : numericId);

  // ดึงรายการผลิตภัณฑ์ที่เกี่ยวข้อง (Related Products) มาแสดงด้านล่าง
  const { items: related } = useProducts({ limit: 4 });

  // State สำหรับจัดการตัวเลือกที่ลูกค้าคลิก (สี/ไซส์) และสถานะการซูมรูปภาพ
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize]   = useState<string>('');
  const [imgZoomed, setImgZoomed]         = useState(false);

  // ─── การประมวลผลข้อมูลแสดงผล (Derive values) ─────────────────────────
  const variants = Array.isArray(item?.item_var) ? item.item_var : (item?.item_var ? [item.item_var] : []);
  const categoryLabel = item?.item_type?.name ?? 'สินค้า';

  // สกัดข้อมูลพื้นฐาน (ทั้งหมด)
  const allUniqueColors = Array.from(new Set(variants.map(v => v.color).filter(Boolean)));
  const allUniqueSizes  = Array.from(new Set(variants.map(v => v.ssize || v.tsize).filter(Boolean)));
  const shirtSizes      = Array.from(new Set(variants.map(v => v.ssize).filter(Boolean)));
  const instrumentSizes = Array.from(new Set(variants.map(v => v.tsize).filter(Boolean)));
  const hasSize         = allUniqueSizes.length > 0;

  // กรองสีและไซส์ตามการเลือก (Dependent Logic)
  const availableVariants = selectedColor 
    ? variants.filter(v => v.color === selectedColor)
    : variants;

  const currentAvailableSizes = Array.from(new Set(
    availableVariants.map(v => v.ssize || v.tsize).filter(Boolean)
  ));

  // ตรวจสอบความถูกต้องของไซส์ที่เลือกเมื่อเปลี่ยนสี
  useEffect(() => {
    if (selectedSize && !currentAvailableSizes.includes(selectedSize)) {
      setSelectedSize('');
    }
  }, [selectedColor, currentAvailableSizes, selectedSize]);

  // ตั้งค่าค่าเริ่มต้นเมื่อข้อมูลสินค้าโหลดสำเร็จ
  useEffect(() => {
    if (variants.length > 0 && variants[0].color) {
      setSelectedColor(variants[0].color);
    }
    setSelectedSize('');
    setImgZoomed(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [item]);

  // แสดงสถานะระหว่างรอโหลดข้อมูล (Loading State)
  if (loading) return (
    <div className="pt-40 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 animate-pulse">
        <div className="bg-cream-dark" style={{ aspectRatio: '4 / 5' }} />
        <div className="flex flex-col gap-4 pt-4">
          <div className="h-8 bg-cream-dark rounded w-2/3" />
          <div className="h-4 bg-cream-dark rounded w-1/3" />
          <div className="h-10 bg-cream-dark rounded w-1/4" />
        </div>
      </div>
    </div>
  );

  // แสดงกรณีไม่พบข้อมูลสินค้าหรือเกิดข้อผิดพลาด
  if (error || !item) return (
    <div className="pt-40 text-center text-muted min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <p className="text-5xl">✦</p>
      <p className="text-base font-light">{error ?? 'ไม่พบสินค้า'}</p>
      <button onClick={() => navigate('/products')} className="btn-primary mt-4">
        กลับไปหน้าสินค้า
      </button>
    </div>
  );


  // สร้างข้อความอัตโนมัติสำหรับส่งเข้า LINE เพื่อความสะดวกของลูกค้า
  const lineMsg = buildLineMessage(
    item.name,
    selectedColor || undefined,
    selectedSize || undefined
  );
  const lineUrl = buildLineUrl(lineMsg);

  // ─── จัดการการคลิกสั่งซื้อ (Line CTA Click) ──────────────────────────

  const handleLineClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (allUniqueColors.length > 0 && !selectedColor) {
      alert('กรุณาเลือกสีก่อนสั่งซื้อ');
      return;
    }
    if (hasSize && !selectedSize) {
      alert('กรุณาเลือกไซส์ก่อนสั่งซื้อ');
      return;
    }

    // 1. บันทึกประวัติการสอบถาม (Inquiry Log) ลงในระบบแอดมินก่อน
    try {
      await logInquiry(item.id);
    } catch {
      // หากบันทึกไม่สำเร็จยังคงให้ลูกค้าเปิด LINE ได้ตามปกติ
      console.warn('Failed to log inquiry');
    }
    // 2. เปิดหน้าแชท LINE OA พร้อมจัดเตรียมข้อความเริ่มต้นให้ลูกค้า
    window.open(lineUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="pt-[90px]">

      {/* บอกตำแหน่งหน้าปัจจุบัน (Breadcrumb) */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center gap-2 text-[13px] font-light text-muted
                       animate-fade-in opacity-0">
        {[
          { label: 'หน้าแรก', href: '/' },
          { label: 'สินค้า', href: '/products' },
          { label: item.name, href: '' },
        ].map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-black/20">›</span>}
            {crumb.href ? (
              <Link
                to={crumb.href}
                className="no-underline text-muted font-light
                            text-[13px] underline underline-offset-2 hover:text-charcoal transition-colors focus:outline-none"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-charcoal">{crumb.label}</span>
            )}
          </span>
        ))}
      </div>

      {/* เนื้อหาหลัก: ข้อมูลและรูปภาพสินค้า */}
      <div className="max-w-6xl mx-auto px-6 pb-28 grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-20 items-start">

        {/* ── ส่วนแสดงรูปภาพสินค้า (Image) ── */}
        <div className="animate-fade-in opacity-0 delay-100">
          <div
            className="relative overflow-hidden bg-cream-dark mb-3 cursor-zoom-in"
            style={{ aspectRatio: '4 / 5' }}
            onClick={() => setImgZoomed(!imgZoomed)}
          >
            <img
              src={item.imgsrc ?? 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80'}
              alt={item.name}
              className={`w-full h-full object-cover transition-transform duration-500
                           ${imgZoomed ? 'scale-110' : 'scale-100'}`}
            />
            {/* แสดงป้ายหมวดหมู่บนรูปภาพ */}
            <span className="absolute top-5 left-5 bg-cream/90 backdrop-blur-sm
                               px-3 py-1 text-[10px] tracking-[0.15em] text-charcoal">
              {categoryLabel}
            </span>
          </div>
        </div>

        {/* ── ส่วนข้อมูลการสั่งซื้อ (Order Info) ── */}
        <div className="md:sticky md:top-28 animate-slide-up opacity-0 delay-200">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight mb-2">
            {item.name}
          </h1>

          {/* ประเภทสินค้า */}
          {item.item_type && (
            <p className="text-[13px] font-light text-muted mb-6 tracking-wide">
              {item.item_type.name}
            </p>
          )}

          {/* การแสดงผลราคา */}
          <div className="text-3xl font-bold text-vermillion mb-8">
            {formatPrice(item.price)}
            <span className="text-sm font-light text-muted ml-2">/ ชิ้น</span>
          </div>

          <div className="h-px bg-black/10 mb-8" />

          {/* การเลือกสี (Color Selection) */}
          {allUniqueColors.length > 0 && (
            <div className="mb-7">
              <div className="flex justify-between mb-3.5">
                <span className="text-[13px] font-semibold tracking-[0.1em] uppercase text-charcoal">เลือกสี</span>
                <span className="text-[13px] font-light text-muted">{selectedColor || 'กรุณาเลือก'}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {allUniqueColors.map((color: any) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-9 h-9 rounded-full border-none cursor-pointer transition-all duration-200
                                 ${selectedColor === color
                                   ? 'outline outline-2 outline-charcoal outline-offset-2 scale-110'
                                   : 'hover:scale-105'}`}
                    style={{ background: '#8A8278' }} // Note: in a real app, color might be a hex code or we map it
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* การเลือกขนาด (Size Selection) */}
          {hasSize && (
            <div className="mb-7">
              <div className="flex justify-between mb-3.5">
                <span className="text-[13px] font-semibold tracking-[0.1em] uppercase text-charcoal">เลือกไซส์</span>
                <span className="text-[13px] font-semibold text-charcoal">{selectedSize || 'กรุณาเลือก'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentAvailableSizes.map((size: any) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-3 text-sm font-semibold border transition-all duration-150
                                 cursor-pointer
                                 ${selectedSize === size
                                   ? 'bg-charcoal text-white border-charcoal'
                                   : 'bg-transparent text-charcoal border-black/15 hover:border-charcoal'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="h-px bg-black/10 mb-8" />

          {/* ── ปุ่มดำเนินการหลัก (Line CTA) ── */}
          <a
            href={lineUrl}
            onClick={handleLineClick}
            className="w-full flex items-center justify-center gap-3 text-base font-semibold
                        tracking-wide no-underline mb-3 bg-[#06C755] text-white
                        transition-all duration-200 hover:-translate-y-0.5
                        hover:shadow-[0_8px_24px_rgba(6,199,85,0.3)] cursor-pointer"
            style={{ padding: '18px' }}
          >
            <LineIcon />
            สอบถาม / สั่งซื้อผ่าน Line
          </a>

          <p className="text-[12px] text-muted text-center font-light tracking-wide">
            จะส่งข้อความอัตโนมัติ: "{lineMsg}"
          </p>

          <div className="h-px bg-black/10 my-8" />

          {/* รายละเอียดสินค้าเชิงลึก */}
          <div className="flex flex-col gap-6">
            {item.description && (
              <div>
                <h3 className="text-[12px] font-semibold tracking-[0.2em] uppercase text-charcoal mb-3">
                  รายละเอียดสินค้า
                </h3>
                <p className="text-sm font-light text-charcoal-light leading-[1.9]">
                  {item.description}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-[12px] font-semibold tracking-[0.2em] uppercase text-charcoal mb-3">
                ข้อมูลเพิ่มเติม
              </h3>
              <dl className="flex flex-col gap-2">
                {[
                  { label: 'หมวดหมู่', value: categoryLabel },
                  ...(allUniqueColors.length > 0 ? [{ label: 'สีที่มี', value: allUniqueColors.join(', ') }] : []),
                  ...(shirtSizes.length > 0 ? [{ label: 'ไซส์เสื้อที่มี', value: shirtSizes.join(', ') }] : []),
                  ...(instrumentSizes.length > 0 ? [{ label: 'ไซส์เครื่องดนตรีที่มี', value: instrumentSizes.join(', ') }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-4 text-sm font-light">
                    <dt className="text-muted shrink-0 w-24">{label}</dt>
                    <dd className="text-charcoal">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* ส่วนสินค้าแนะนำอื่นๆ (Related Products) */}
      <div className="bg-cream-dark py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-charcoal mb-12">สินค้าอื่นที่อาจสนใจ</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {related
              .filter((p) => p.id !== item.id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard
                  key={p.id}
                  item={p}
                  onSelect={(id) => navigate(`/product/${id}`)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
