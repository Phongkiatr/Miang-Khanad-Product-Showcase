import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ApiItem } from '../services/api';
import { formatPrice } from '../utils/productUtils';
import ProductCard from '../components/ProductCard';
import { useSettings } from '../context/SettingsContext';

// interface HomePageProps removed

const LineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.63 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

/**
 * HomePage Component
 * หน้าแรกของเว็บไซต์ - แสดง Hero Section, เรื่องราวของแบรนด์ และสินค้าแนะนำ
 */

// Skeleton card สำหรับแสดงสถานะรอโหลดข้อมูล (Loading State)
function SkeletonCard() {
  return (
    <div className="flex flex-col gap-0 animate-pulse">
      <div className="bg-cream-dark w-full" style={{ aspectRatio: '3 / 4' }} />
      <div className="pt-5 border-t border-black/10 flex flex-col gap-2">
        <div className="h-4 bg-cream-dark rounded w-3/4" />
        <div className="h-3 bg-cream-dark rounded w-1/2" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const lineUrl = `https://line.me/R/ti/p/${settings.line_id.startsWith('@') ? settings.line_id : `@${settings.line_id}`}`;

  // ดึงข้อมูลสินค้า 3 ชิ้นแรกจาก API เพื่อแสดงเป็นสินค้าแนะนำ (Featured)
  const { items: featured, loading } = useProducts({ limit: 3 });

  // เลื่อนขึ้นไปด้านบนสุดเมื่อเข้าหน้านี้
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  // เลือกสินค้าชิ้นแรกมาแสดงใน Floating Card ของส่วน Hero
  const heroItem: ApiItem | undefined = featured[0];

  return (
    <div>
      {/* ─── ส่วน Hero: แนะนำแบรนด์และ Call to Action ─── */}
      {/* ─── ส่วน Hero: แนะนำแบรนด์และ Call to Action ─── */}
      <section className="min-h-svh relative overflow-hidden bg-cream">
        {/* ฝั่งขวา: รูปภาพ Hero และ Floating Card สำหรับ Desktop (Absolute Background) */}
        <div className="absolute top-0 right-0 w-1/2 h-full hidden md:block animate-scale-in opacity-0 delay-100 z-0">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=85"
            alt="เมียงขนาด hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/30 to-transparent" />

          {/* Floating Card*/}
          <Link
            to={heroItem ? `/product/${heroItem.id}` : '#'}
            className="animate-fade-in opacity-0 delay-600 absolute bottom-20 left-28
                       bg-white/30 backdrop-blur-md px-6 py-5 
                       shadow-[0_10px_40px_rgba(0,0,0,0.04)] group/hero-card
                       transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(0,0,0,0.08)]
                       no-underline cursor-pointer border-none"
          >
            <div className="flex flex-col">
              <p className="text-[10px] text-muted tracking-[0.2em] mb-1.5 uppercase font-medium">
                สินค้าแนะนำ
              </p>
              {loading ? (
                <div className="animate-pulse flex flex-col gap-2">
                  <div className="h-4 bg-black/5 rounded w-32" />
                  <div className="h-3 bg-black/5 rounded w-16" />
                </div>
              ) : (
                <>
                  <p className="text-lg font-semibold text-charcoal leading-tight mb-1
                                transition-colors duration-200 group-hover/hero-card:text-vermillion">
                    {heroItem?.name ?? 'สะล้อพรีเมียม'}
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[15px] font-normal text-vermillion">
                      {heroItem ? formatPrice(heroItem.price) : '฿8,900'}
                    </p>
                    <span className="text-[10px] text-muted opacity-0 group-hover/hero-card:opacity-100 
                                     transition-all duration-300 transform translate-x-[-10px] 
                                     group-hover/hero-card:translate-x-0 font-light">
                      ดูรายละเอียด →
                    </span>
                  </div>
                </>
              )}
            </div>
          </Link>
        </div>

        {/* Content Container: บังคับให้ข้อความอยู่ระยะเท่า Navbar (max-w-6xl mx-auto px-6) */}
        <div className="max-w-6xl mx-auto px-6 h-full relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-svh">
            {/* ฝั่งซ้าย: ข้อความและปุ่มนำทาง */}
            <div className="flex flex-col justify-end pt-40 pb-20">
              <div className="animate-fade-in opacity-0 flex items-center gap-3 mb-8">
                <span className="block w-8 h-px bg-gold" />
                <span className="label-section">ล้านนา Minimal Luxury</span>
              </div>

              <h1 className="animate-slide-up opacity-0 delay-200 font-bold leading-[1.15] text-charcoal mb-7
                              text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight">
                งานฝีมือที่<br />
                <span className="text-vermillion">ทนกาลเวลา</span>
              </h1>

              <p className="animate-fade-in opacity-0 delay-400 text-base font-light text-charcoal-light
                             leading-[1.9] max-w-sm mb-12">
                สินค้าหัตถกรรมล้านนาคัดสรรพิเศษ ทั้งเครื่องแต่งกายผ้าทอมือ
                และเครื่องดนตรีพื้นเมืองฝีมือช่างชำนาญ
              </p>

              <div className="animate-fade-in opacity-0 delay-500 flex flex-wrap gap-4">
                <button onClick={() => navigate('/products')} className="btn-primary">
                  เลือกดูสินค้า
                </button>
                <a
                  href={lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  สอบถาม Line OA
                </a>
              </div>

              {/* สถิติหรือจุดเด่นของแบรนด์ */}
              <div className="animate-fade-in opacity-0 delay-600 flex gap-10 mt-16 pt-10 border-t border-black/10">
                {[
                  { num: '10+', label: 'ปีแห่งประสบการณ์' },
                  { num: '50+', label: 'รายการสินค้า' },
                  { num: '100%', label: 'งานฝีมือแท้' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-charcoal leading-none">{stat.num}</div>
                    <div className="text-xs font-light text-muted mt-1 tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spacer ฝั่งขวา (เพื่อให้ Grid ฝั่งซ้ายทำงานได้ถูกต้องบน Desktop) */}
            <div className="hidden md:block pointer-events-none" />
          </div>
        </div>

        {/* ฉากหลังสำหรับหน้าจอขนาดเล็ก (Mobile) */}
        <div className="md:hidden absolute inset-0 -z-10 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=70"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* ตัวบอกใบ้การเลื่อนหน้า (Scroll Indicator) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10
                         animate-fade-in opacity-0 delay-600">
          <span className="text-[10px] tracking-[0.3em] text-muted uppercase">เลื่อนลง</span>
          <div className="w-px h-12 bg-gradient-to-b from-muted to-transparent animate-[scrollPulse_2s_ease_infinite]" />
        </div>
      </section>

      {/* ─── ส่วน Brand Story: เล่าเรื่องราวความเป็นมาของแบรนด์ ─── */}
      <section className="py-28 px-6 bg-charcoal text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                         text-[clamp(80px,20vw,200px)] font-black text-white/[0.03]
                         whitespace-nowrap pointer-events-none select-none tracking-wide">
          ล้านนา
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="lanna-divider mb-12">✦</div>
          <h2 className="font-bold leading-[1.4] mb-8 tracking-wide text-3xl sm:text-4xl lg:text-5xl">
            เรื่องราวของ<br />
            <span className="text-gold">เมียงขนาด</span>
          </h2>
          <p className="text-base font-light text-white/75 leading-loose mb-6">
            "เมียงขนาด" มาจากภาษาล้านนาโบราณ หมายถึงขุมทรัพย์ที่ซ่อนอยู่ในความเรียบง่าย
            เราเชื่อว่างานหัตถกรรมของช่างฝีมือภาคเหนือ คือสมบัติที่ควรได้รับการยกระดับและส่งต่อ
          </p>
          <p className="text-base font-light text-white/75 leading-loose">
            เราคัดเลือกผลิตภัณฑ์อย่างพิถีพิถัน ทั้งเสื้อผ้าทอมือจากกลุ่มแม่บ้าน
            และเครื่องดนตรีจากช่างผู้สืบทอดภูมิปัญญา
            ทุกชิ้นงานคือบทกวีเงียบๆ ที่เล่าเรื่องราวของดินแดนล้านนา
          </p>
          <div className="lanna-divider mt-12">✦</div>
        </div>
      </section>

      {/* ─── ส่วนสินค้าแนะนำ (Featured Products) ─── */}
      <section className="py-28 px-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-16 flex-wrap gap-6">
          <div>
            <p className="label-section mb-3">คอลเลกชันแนะนำ</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-snug">
              สินค้าเด่น
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-light text-charcoal tracking-wide underline
                       underline-offset-4 no-underline border-none bg-transparent cursor-pointer
                       hover:text-vermillion transition-colors duration-200"
          >
            ดูทั้งหมด →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : featured.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onSelect={(id) => navigate(`/product/${id}`)}
              />
            ))}
        </div>
      </section>

      {/* ─── ส่วนทิ้งท้าย: ช่องทางการติดต่อ LINE OA ─── */}
      <section className="bg-indigo-lanna py-20 px-6 text-center">
        <p className="text-[12px] tracking-[0.3em] text-white/50 uppercase mb-5">พร้อมให้บริการ 7 วัน</p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8">
          มีคำถาม? เราพร้อมตอบทุกข้อสงสัย
        </h2>
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-line"
        >
          <LineIcon />
          แชทกับเราบน Line OA
        </a>
      </section>
    </div>
  );
}
