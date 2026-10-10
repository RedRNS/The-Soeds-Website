import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLang } from '../lib/lang';
import { useNav } from '../lib/nav';
import { useContent, type PromoItem, type PromoKind } from '../lib/content';
import { categoryById } from '../data/categories';
import { IMG } from '../data/images';
import { Eyebrow, Img, Reveal } from './ui';

const FILTERS: { id: 'all' | PromoKind; id_label: string; en_label: string }[] = [
  { id: 'all', id_label: 'Semua', en_label: 'All' },
  { id: 'PROMO', id_label: 'Promo', en_label: 'Promo' },
  { id: 'MENU BARU', id_label: 'Menu Baru', en_label: 'New Menu' },
  { id: 'ACARA', id_label: 'Acara', en_label: 'Events' },
  { id: 'KOMUNITAS', id_label: 'Komunitas', en_label: 'Community' },
];

const KIND_LABEL: Record<PromoKind, [string, string]> = {
  PROMO: ['Promo', 'Promo'],
  'MENU BARU': ['Menu Baru', 'New Menu'],
  ACARA: ['Acara', 'Event'],
  KOMUNITAS: ['Komunitas', 'Community'],
};

const defaultPhoto = (p: PromoItem) => {
  if (p.foto) return p.foto;
  const cat = categoryById(p.tujuan);
  if (cat) return cat.photo;
  return p.jenis === 'ACARA' ? IMG.music : p.jenis === 'KOMUNITAS' ? IMG.hall : IMG.interior;
};

// Pola lebar kartu (12 kolom) supaya ukurannya bervariasi: 7+5, 5+7, ...
const SPAN = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7'];

export const Events: React.FC = () => {
  const { t, lang } = useLang();
  const { go, openReservation } = useNav();
  const { content } = useContent();
  const [filter, setFilter] = useState<'all' | PromoKind>('all');

  const list = content.promo.filter((p) => filter === 'all' || p.jenis === filter);

  return (
    <section id="acara" className="border-t border-hairline bg-cream">
      <div className="mx-auto max-w-[1440px] px-4 py-[72px] sm:px-8 md:py-[120px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>{t('Acara & Promo', 'Events & Promos')}</Eyebrow>
            <h2 className="mt-3 font-serif text-5xl leading-none text-burgundy sm:text-6xl">
              {t('Acara & Promo', 'Events & Promos')}
            </h2>
          </div>
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`label min-h-11 shrink-0 rounded-full border px-5 transition ${
                  filter === f.id
                    ? 'border-crimson bg-crimson text-white'
                    : 'border-charcoal/30 text-charcoal hover:border-crimson hover:text-crimson'
                }`}
              >
                {lang === 'id' ? f.id_label : f.en_label}
              </button>
            ))}
          </div>
        </div>

        {list.length === 0 ? (
          <p className="mt-12 text-center text-sm text-stone">
            {t('Belum ada konten untuk kategori ini.', 'Nothing here yet.')}
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-12">
            {list.map((p, i) => (
              <Reveal key={p.id} delay={(i % 2) * 80} className={SPAN[i % SPAN.length]}>
                <button
                  type="button"
                  onClick={() => (categoryById(p.tujuan) ? go(`menu:${p.tujuan}`) : openReservation())}
                  className="group relative block aspect-[4/3] w-full overflow-hidden bg-burgundy text-left md:aspect-auto md:h-[380px]"
                >
                  <Img
                    src={defaultPhoto(p)}
                    alt={p.judul}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />
                  <span className="label absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-crimson">
                    {KIND_LABEL[p.jenis][lang === 'id' ? 0 : 1]}
                  </span>
                  <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-crimson transition group-hover:bg-crimson group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                    {p.tanggal && <p className="label mb-2 text-white/80">{p.tanggal}</p>}
                    <h3 className="max-w-[24ch] font-serif text-2xl leading-snug sm:text-[28px]">{p.judul}</h3>
                    {p.deskripsi && (
                      <p className="mt-2 line-clamp-2 max-w-[48ch] text-[13px] leading-relaxed text-white/85">{p.deskripsi}</p>
                    )}
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
