import React, { useMemo, useState } from 'react';
import { useLang } from '../lib/lang';
import { useNav } from '../lib/nav';
import { featuredItems, useContent, type MenuItem } from '../lib/content';
import { CATEGORIES, categoryById, type CategoryId } from '../data/categories';
import { Img, PillButton, Reveal } from './ui';
import { BadgeMark, PriceInline } from './Price';

export const MenuPreview: React.FC = () => {
  const { t, lang } = useLang();
  const { go } = useNav();
  const { content } = useContent();
  const [cat, setCat] = useState<CategoryId>('makanan-berat');
  const [hover, setHover] = useState<{ item: MenuItem; x: number; y: number } | null>(null);

  const items = useMemo(() => featuredItems(content.groups, cat, 6), [content.groups, cat]);
  const category = categoryById(cat)!;
  const groupPhoto = (it: MenuItem) =>
    it.foto || content.groups.find((g) => g.kategori === it.kategori && g.nama === it.grup)?.foto || category.photo;

  return (
    <section id="menu" className="bg-cream">
      <div className="mx-auto max-w-[1440px] px-4 py-[72px] sm:px-8 md:py-[120px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Foto besar vertikal */}
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-burgundy lg:aspect-[3/4]">
              <Img
                src={category.photo}
                alt={lang === 'id' ? category.id_label : category.en_label}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-16">
                <p className="label text-white/80">{t('Kategori', 'Category')}</p>
                <p className="font-serif text-2xl text-white">{lang === 'id' ? category.id_label : category.en_label}</p>
              </div>
            </div>
          </Reveal>

          <div className="min-w-0 lg:col-span-7">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-serif text-6xl leading-none text-burgundy sm:text-7xl lg:text-[96px]">Menu</h2>
              <PillButton tone="solid" onClick={() => go(`menu:${cat}`)}>
                {t('Lihat semua', 'See all')}
              </PillButton>
            </div>

            {/* Tab kategori */}
            <div
              role="tablist"
              aria-label={t('Kategori menu', 'Menu categories')}
              className="no-scrollbar -mx-4 mt-8 flex items-center overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
            >
              {CATEGORIES.map((c, i) => (
                <React.Fragment key={c.id}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={cat === c.id}
                    onClick={() => setCat(c.id)}
                    className={`label min-h-11 whitespace-nowrap px-1 transition ${
                      cat === c.id ? 'text-crimson' : 'text-charcoal/70 hover:text-charcoal'
                    }`}
                  >
                    {lang === 'id' ? c.id_label : c.en_label}
                  </button>
                  {i < CATEGORIES.length - 1 && <span className="px-2 text-hairline" aria-hidden>/</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Daftar */}
            <ul className="mt-2 border-t border-hairline">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="border-b border-hairline"
                  onMouseMove={(e) => setHover({ item: it, x: e.clientX, y: e.clientY })}
                  onMouseLeave={() => setHover(null)}
                >
                  <button
                    type="button"
                    onClick={() => go(`menu:${cat}`)}
                    className="group flex w-full items-start justify-between gap-6 py-5 text-left transition hover:pl-2"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-serif text-xl text-burgundy transition group-hover:text-crimson sm:text-2xl">
                          {it.nama}
                        </h3>
                        <BadgeMark badge={it.badge} />
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-charcoal/70">
                        {it.deskripsi || it.grup}
                      </p>
                    </div>
                    <div className="shrink-0 pt-1">
                      <PriceInline item={it} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-stone">
              {t('Harga belum termasuk pajak. Foto dan produk dapat berbeda.', 'Prices exclude tax. Photos and products may vary.')}
            </p>
          </div>
        </div>
      </div>

      {hover && (
        <div
          className="pointer-events-none fixed z-30 hidden h-[150px] w-[120px] overflow-hidden shadow-xl ring-4 ring-white lg:block"
          style={{ left: hover.x + 24, top: hover.y - 75 }}
        >
          <Img src={groupPhoto(hover.item)} alt={hover.item.nama} className="h-full w-full object-cover" />
        </div>
      )}
    </section>
  );
};
