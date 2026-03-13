import { useState } from 'react';
import { ApiItem } from '../services/api';
import { formatPrice } from '../data/mockData';

interface ProductCardProps {
  item: ApiItem;
  onSelect: (id: number) => void;
}

export default function ProductCard({ item, onSelect }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  const categoryLabel = item.item_type?.name ?? 'สินค้า';
  const imgSrc = item.imgsrc ?? 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80';

  return (
    <article
      onClick={() => onSelect(item.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col cursor-pointer group"
    >
      {/* Image */}
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

        {/* Category badge */}
        <span className="absolute top-4 left-4 bg-cream/90 backdrop-blur-sm
                          px-2.5 py-1 text-[10px] tracking-[0.15em] text-charcoal">
          {categoryLabel}
        </span>

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-charcoal/20 transition-opacity duration-300
                      flex items-center justify-center
                      ${hovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <span
            className={`text-white text-xs tracking-[0.25em] uppercase transition-transform duration-300
                        ${hovered ? 'translate-y-0' : 'translate-y-2'}`}
          >
            ดูรายละเอียด
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="pt-5 border-t border-black/10 flex flex-col gap-1.5">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-charcoal leading-snug">
              {item.name}
            </h3>
            {/* แสดง variant info ถ้ามี */}
            {item.item_var?.color && (
              <p className="text-[13px] font-light text-muted mt-0.5 truncate">
                {item.item_var.color}
                {item.item_var.ssize ? ` · ${item.item_var.ssize}` : ''}
                {item.item_var.tsize ? ` · ${item.item_var.tsize}` : ''}
              </p>
            )}
          </div>
          <span className={`text-base font-semibold ml-4 shrink-0 whitespace-nowrap transition-colors duration-200
                            ${hovered ? 'text-vermillion' : 'text-charcoal'}`}>
            {formatPrice(item.price)}
          </span>
        </div>
      </div>
    </article>
  );
}
