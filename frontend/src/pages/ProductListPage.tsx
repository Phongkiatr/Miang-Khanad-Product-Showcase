import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useItemTypes } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

// interface ProductListPageProps removed

type SortOption = 'default' | 'price-asc' | 'price-desc';

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

export default function ProductListPage() {
  const navigate = useNavigate();
  const [activeTypeId, setActiveTypeId] = useState<number | undefined>(undefined);
  const [search, setSearch]             = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy]             = useState<SortOption>('default');
  const [page, setPage]                 = useState(1);

  // Debounce search input 400ms
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // รีเซ็ต page เมื่อเปลี่ยน filter
  useEffect(() => { setPage(1); }, [activeTypeId]);

  const { items, loading, error, total, totalPages } = useProducts({
    category: activeTypeId,
    search: debouncedSearch || undefined,
    page,
    limit: 12,
  });

  const { itemTypes } = useItemTypes();

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  // Client-side sort (backend ยังไม่รองรับ sort by price)
  const sorted = [...items].sort((a, b) =>
    sortBy === 'price-asc'  ? a.price - b.price
    : sortBy === 'price-desc' ? b.price - a.price
    : 0
  );

  return (
    <div className="pt-24 min-h-screen">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-16">
        <p className="animate-fade-in opacity-0 label-section mb-3">คอลเลกชัน</p>
        <h1 className="animate-slide-up opacity-0 delay-100 font-bold text-charcoal leading-tight mb-10
                        text-4xl sm:text-5xl lg:text-6xl">
          สินค้าทั้งหมด
        </h1>

        {/* Filters */}
        <div className="animate-fade-in opacity-0 delay-200 flex flex-wrap justify-between items-center
                         gap-5 pb-8 border-b border-black/10 mb-14">
          <div className="flex flex-wrap gap-2 items-center">
            {/* ปุ่ม "ทั้งหมด" */}
            <button
              onClick={() => setActiveTypeId(undefined)}
              className={`px-5 py-2.5 text-sm tracking-wide border transition-all duration-200 cursor-pointer
                           ${activeTypeId === undefined
                             ? 'bg-charcoal text-white border-charcoal font-semibold'
                             : 'bg-transparent text-charcoal border-black/10 font-light hover:bg-black/5'}`}
            >
              ทั้งหมด
            </button>

            {/* ปุ่มตาม item_type จาก API */}
            {itemTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveTypeId(type.id)}
                className={`px-5 py-2.5 text-sm tracking-wide border transition-all duration-200 cursor-pointer
                             ${activeTypeId === type.id
                               ? 'bg-charcoal text-white border-charcoal font-semibold'
                               : 'bg-transparent text-charcoal border-black/10 font-light hover:bg-black/5'}`}
              >
                {type.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาสินค้า..."
              className="px-3 py-2 border border-black/10 bg-cream text-[13px] text-charcoal
                          focus:outline-none focus:border-charcoal font-sans placeholder:text-muted
                          w-40 sm:w-52"
            />

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 pr-8 border border-black/10 bg-cream text-[13px]
                          text-charcoal cursor-pointer appearance-none font-sans
                          focus:outline-none focus:border-charcoal"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%231C1C1C' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
            >
              <option value="default">ค่าเริ่มต้น</option>
              <option value="price-asc">ราคา น้อย → มาก</option>
              <option value="price-desc">ราคา มาก → น้อย</option>
            </select>
          </div>
        </div>

        {/* Result count */}
        <p className="text-[13px] text-muted font-light mb-10 tracking-wide">
          {loading ? 'กำลังโหลด...' : `แสดง ${items.length} จาก ${total} รายการ`}
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {error ? (
          <div className="text-center py-32 text-vermillion">
            <p className="text-4xl mb-4">⚠️</p>
            <p className="text-base font-light">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-32 text-muted">
            <p className="text-4xl mb-4">✦</p>
            <p className="text-base font-light">ไม่พบสินค้าที่ต้องการ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
            {sorted.map((item, i) => (
              <div
                key={item.id}
                className="animate-fade-in opacity-0"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ProductCard
                  item={item}
                  onSelect={(id) => navigate(`/product/${id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-2 pb-20">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-black/10 text-sm font-light text-charcoal
                        disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5
                        transition-colors cursor-pointer bg-transparent"
          >
            ← ก่อนหน้า
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 text-sm border transition-colors cursor-pointer
                           ${page === p
                             ? 'bg-charcoal text-white border-charcoal font-semibold'
                             : 'bg-transparent text-charcoal border-black/10 font-light hover:bg-black/5'}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-black/10 text-sm font-light text-charcoal
                        disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/5
                        transition-colors cursor-pointer bg-transparent"
          >
            ถัดไป →
          </button>
        </div>
      )}
    </div>
  );
}
