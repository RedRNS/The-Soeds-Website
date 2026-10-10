import React from 'react';
import { Star } from 'lucide-react';
import { rupiah } from '../lib/format';
import { useLang } from '../lib/lang';
import type { Badge, MenuItem } from '../lib/content';

export const BadgeMark: React.FC<{ badge?: Badge }> = ({ badge }) => {
  const { t } = useLang();
  if (badge === 'FAVORIT')
    return (
      <span className="inline-flex items-center gap-1 text-[#8a8540]" title={t('Favorit', 'Favorite')}>
        <Star className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden />
        <span className="sr-only">{t('Favorit', 'Favorite')}</span>
      </span>
    );
  if (badge === 'BARU')
    return (
      <span className="rounded-full bg-orange px-2 py-[3px] text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-white">
        {t('Baru', 'New')}
      </span>
    );
  if (badge === 'PROMO')
    return (
      <span className="rounded-full bg-charcoal px-2 py-[3px] text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-white">
        Promo
      </span>
    );
  return null;
};

/** Harga ringkas untuk daftar unggulan di beranda. */
export const PriceInline: React.FC<{ item: MenuItem }> = ({ item }) => {
  const both = item.harga !== undefined && item.hargaHot !== undefined;
  if (item.hargaCoret !== undefined)
    return (
      <div className="text-right tabular-nums">
        <div className="text-xs text-stone line-through">{rupiah(item.hargaCoret)}</div>
        <div className="font-semibold text-crimson">{rupiah(item.harga)}</div>
      </div>
    );
  if (both || item.hargaHot !== undefined)
    return (
      <div className="space-y-0.5 text-right text-[15px] font-semibold tabular-nums">
        {item.harga !== undefined && (
          <div>
            <span className="mr-2 text-[10px] font-bold tracking-[0.08em] text-stone">ICED</span>
            {rupiah(item.harga)}
          </div>
        )}
        {item.hargaHot !== undefined && (
          <div>
            <span className="mr-2 text-[10px] font-bold tracking-[0.08em] text-stone">HOT</span>
            {rupiah(item.hargaHot)}
          </div>
        )}
      </div>
    );
  return <div className="text-right text-[15px] font-semibold tabular-nums">{rupiah(item.harga)}</div>;
};
