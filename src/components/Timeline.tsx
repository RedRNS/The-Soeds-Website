import React, { useState } from 'react';
import { useLang } from '../lib/lang';
import { useContent } from '../lib/content';
import { IMG } from '../data/images';
import { Eyebrow, Img, Reveal } from './ui';

const FALLBACK = [IMG.cafe, IMG.soup, IMG.pizza, IMG.coffee, IMG.fresh, IMG.interior];

export const Timeline: React.FC = () => {
  const { t } = useLang();
  const { content } = useContent();
  const items = content.perjalanan;
  const [active, setActive] = useState(0);
  if (items.length === 0) return null;

  const cur = items[Math.min(active, items.length - 1)];
  const isPlaceholder = items.some((m) => m.tahun.startsWith('['));
  const photo = cur.foto || FALLBACK[active % FALLBACK.length];

  return (
    <section id="perjalanan" className="border-t border-hairline bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-[72px] sm:px-8 md:py-[120px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Eyebrow>{t('Perjalanan Kami', 'Our Journey')}</Eyebrow>
          {isPlaceholder && (
            <span className="label rounded-full border border-orange px-3 py-1 text-orange">
              [CONTOH, GANTI DENGAN DATA ASLI]
            </span>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Daftar tahun: vertikal di desktop, geser horizontal di mobile */}
          <div
            role="tablist"
            aria-orientation="vertical"
            className="no-scrollbar -mx-4 flex gap-6 overflow-x-auto px-4 sm:mx-0 sm:px-0 min-w-0 lg:col-span-6 lg:flex-col lg:gap-0 lg:overflow-visible"
          >
            {items.map((m, i) => {
              const on = i === active;
              return (
                <button
                  key={m.tahun}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className="group flex shrink-0 items-center gap-4 text-left"
                >
                  <span
                    className={`font-serif leading-[1.12] transition-colors duration-300 ${
                      m.tahun.length > 6
                        ? 'text-4xl lg:text-6xl xl:text-7xl'
                        : 'text-5xl lg:text-7xl xl:text-[96px]'
                    } ${on ? 'font-semibold text-burgundy' : 'text-stone group-hover:text-charcoal/60'}`}
                  >
                    {m.tahun}
                  </span>
                  <span
                    aria-hidden
                    className={`hidden h-8 items-center gap-2 lg:flex ${on ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                  >
                    <span className="h-px w-10 bg-crimson" />
                    <span className="h-2 w-2 rounded-full bg-crimson" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Foto + caption */}
          <Reveal className="lg:col-span-6">
            <div className="grid gap-6 sm:grid-cols-[1.2fr_1fr] sm:items-end">
              <div className="aspect-[4/5] overflow-hidden bg-burgundy">
                <Img key={photo} src={photo} alt={cur.judul} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="label text-crimson">{cur.tahun}</p>
                <h3 className="mt-2 font-serif text-2xl leading-snug text-burgundy sm:text-[28px]">{cur.judul}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/80">{cur.deskripsi}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
