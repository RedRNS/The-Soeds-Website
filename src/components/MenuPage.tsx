import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useLang } from '../lib/lang';
import { useNav, type MenuFilter } from '../lib/nav';
import { useContent, type MenuGroup, type MenuItem } from '../lib/content';
import { rupiah, waLink } from '../lib/format';
import { CATEGORIES, categoryById, groupPhoto } from '../data/categories';
import { Img, Reveal, WhatsAppIcon } from './ui';
import { BadgeMark } from './Price';

const Kode: React.FC<{ kode?: string; big?: boolean }> = ({ kode, big }) =>
  kode ? (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-crimson font-bold text-white ${
        big ? 'h-8 w-8 text-sm' : 'h-5 w-5 text-[10px]'
      }`}
    >
      {kode}
    </span>
  ) : null;

const PromoPrice: React.FC<{ item: MenuItem; light?: boolean }> = ({ item, light }) => (
  <div className="tabular-nums">
    {item.hargaCoret !== undefined && (
      <div className={`text-sm line-through ${light ? 'text-white/60' : 'text-stone'}`}>{rupiah(item.hargaCoret)}</div>
    )}
    <div className={`font-serif text-2xl font-semibold ${light ? 'text-white' : 'text-crimson'}`}>{rupiah(item.harga)}</div>
  </div>
);

const SteakPoster: React.FC<{ group: MenuGroup; photo: string }> = ({ group, photo }) => {
  const { t } = useLang();
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5">
        {group.items.map((it) => (
          <div key={it.id} className="group bg-white">
            <div className="relative aspect-[4/5] overflow-hidden bg-burgundy">
              <Img
                src={it.foto || photo}
                alt={it.nama}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3">
                <Kode kode={it.kode} big />
              </span>
              <span className="label absolute bottom-3 left-3 bg-charcoal px-2.5 py-1.5 text-[10px] text-white">PROMO PRICE</span>
            </div>
            <div className="pt-3">
              <h4 className="font-serif text-lg leading-snug text-burgundy">{it.nama}</h4>
              <PromoPrice item={it} />
            </div>
          </div>
        ))}
      </div>
      {group.catatan.length > 0 && (
        <div className="mt-8 grid gap-px bg-hairline sm:grid-cols-3">
          {group.catatan.map((line) => {
            const [head, ...rest] = line.split(':');
            return (
              <div key={line} className="bg-cream p-5">
                <p className="label text-crimson">{head.trim()}</p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal">{rest.join(':').trim() || head}</p>
              </div>
            );
          })}
        </div>
      )}
      <p className="mt-4 text-xs text-stone">{t('Pilih satu sides dan satu sauce untuk setiap steak.', 'Choose one side and one sauce for every steak.')}</p>
    </div>
  );
};

const ItemRows: React.FC<{ group: MenuGroup }> = ({ group }) => {
  const dual = group.dual;
  const poster = group.poster;
  const cols = dual ? 'grid-cols-[1fr_72px_72px] sm:grid-cols-[1fr_96px_96px]' : 'grid-cols-[1fr_auto]';
  const line = poster ? 'border-white/25' : 'border-hairline';

  return (
    <div role="table" aria-label={group.nama}>
      {dual && (
        <div role="row" className={`grid ${cols} gap-3 border-b pb-2 ${line}`}>
          <span role="columnheader" className="sr-only">Menu</span>
          <span role="columnheader" className={`label text-right ${poster ? 'text-white/70' : 'text-stone'}`}>ICED</span>
          <span role="columnheader" className={`label text-right ${poster ? 'text-white/70' : 'text-stone'}`}>HOT</span>
        </div>
      )}
      {group.items.map((it) => (
        <div
          key={it.id}
          role="row"
          className={`grid ${cols} items-baseline gap-3 border-b py-4 last:border-b-0 ${line}`}
        >
          <div role="cell" className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Kode kode={it.kode} />
              <h4 className={`font-serif text-lg leading-snug sm:text-xl ${poster ? 'text-white' : 'text-burgundy'}`}>{it.nama}</h4>
              <BadgeMark badge={it.badge} />
            </div>
            {it.deskripsi && (
              <p className={`mt-1 text-[13px] leading-relaxed ${poster ? 'text-white/80' : 'text-charcoal/70'}`}>{it.deskripsi}</p>
            )}
          </div>
          {dual ? (
            <>
              <span role="cell" className="text-right text-[15px] font-semibold tabular-nums">
                {it.harga !== undefined ? rupiah(it.harga) : <span className="text-stone/60">–</span>}
              </span>
              <span role="cell" className="text-right text-[15px] font-semibold tabular-nums">
                {it.hargaHot !== undefined ? rupiah(it.hargaHot) : <span className="text-stone/60">–</span>}
              </span>
            </>
          ) : (
            <span role="cell" className="text-right text-[15px] font-semibold tabular-nums">
              {it.hargaCoret !== undefined ? <PromoPrice item={it} /> : rupiah(it.harga)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

const GroupBlock: React.FC<{ group: MenuGroup; index: number }> = ({ group, index }) => {
  const { t } = useLang();
  const photo = group.foto || group.items.find((i) => i.foto)?.foto || groupPhoto(group.kategori, group.nama);
  const isSteak = group.items.some((i) => i.hargaCoret !== undefined);
  const flip = index % 2 === 1;

  const header = (
    <header className="mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className={`font-serif text-3xl leading-tight sm:text-4xl ${group.poster ? 'text-white' : 'text-burgundy'}`}>{group.nama}</h3>
        {group.badge === 'BARU' && (
          <span className="rounded-full bg-orange px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-white">
            {t('Baru', 'New')}
          </span>
        )}
        {group.badge === 'PROMO' && (
          <span className="rounded-full bg-charcoal px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-white">
            PROMO PRICE
          </span>
        )}
      </div>
      {group.tagline && (
        <p className={`mt-2 font-serif text-base italic ${group.poster ? 'text-white/85' : 'text-charcoal/70'}`}>{group.tagline}</p>
      )}
      {group.pilihan.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="label text-stone">{t('Pilihan rasa', 'Flavor')}</span>
          {group.pilihan.map((p) => (
            <span key={p} className="label rounded-full border border-crimson px-3 py-1.5 text-[10px] text-crimson">
              {p}
            </span>
          ))}
        </div>
      )}
    </header>
  );

  if (isSteak)
    return (
      <Reveal className="py-14">
        {header}
        <SteakPoster group={group} photo={photo} />
      </Reveal>
    );

  return (
    <Reveal className="grid grid-cols-1 gap-8 py-14 md:grid-cols-12 md:gap-14">
      <div className={`md:col-span-4 ${flip ? 'md:order-2' : ''}`}>
        <div className="aspect-[4/3] overflow-hidden bg-burgundy md:sticky md:top-[170px] md:aspect-[4/5]">
          <Img src={photo} alt={group.nama} className="h-full w-full object-cover" />
        </div>
      </div>
      <div className={`md:col-span-8 ${flip ? 'md:order-1' : ''}`}>
        <div className={group.poster ? 'bg-crimson p-6 text-white sm:p-10' : ''}>
          {header}
          <ItemRows group={group} />
          {group.catatan.length > 0 && (
            <ul className={`mt-5 space-y-1 text-xs ${group.poster ? 'text-white/80' : 'text-stone'}`}>
              {group.catatan.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Reveal>
  );
};

export const MenuPage: React.FC = () => {
  const { t, lang } = useLang();
  const { go, menuCategory, openReservation } = useNav();
  const { content } = useContent();
  const [q, setQ] = useState('');
  const [onlyFav, setOnlyFav] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);

  const cat: MenuFilter = menuCategory;
  const term = q.trim().toLowerCase();

  const view = useMemo(() => {
    return content.groups
      .filter((g) => term || cat === 'all' || g.kategori === cat)
      .map((g) => {
        const items = g.items.filter((i) => {
          if (onlyFav && i.badge !== 'FAVORIT') return false;
          if (onlyNew && i.badge !== 'BARU' && g.badge !== 'BARU') return false;
          if (term && !`${i.nama} ${i.deskripsi} ${g.nama} ${g.tagline}`.toLowerCase().includes(term)) return false;
          return true;
        });
        return { ...g, items, dual: items.some((i) => i.hargaHot !== undefined) };
      })
      .filter((g) => g.items.length > 0);
  }, [content.groups, cat, term, onlyFav, onlyNew]);

  const waHref = waLink(content.info.whatsapp, 'Halo The Soeds Purwokerto, saya ingin memesan.');
  const showBands = cat === 'all' || term !== '';
  const label = (c: (typeof CATEGORIES)[number]) => (lang === 'id' ? c.id_label : c.en_label);

  const quick = (on: boolean, set: (v: boolean) => void, text: string) => (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => set(!on)}
      className={`label min-h-11 shrink-0 rounded-full border px-4 transition ${
        on ? 'border-charcoal bg-charcoal text-white' : 'border-charcoal/30 text-charcoal hover:border-charcoal'
      }`}
    >
      {text}
    </button>
  );

  return (
    <main>
      <section className="on-crimson bg-crimson text-white">
        <div className="mx-auto max-w-[1440px] px-4 pb-14 pt-12 sm:px-8 md:pb-20 md:pt-20">
          <p className="label text-white/80">{t('Katalog lengkap', 'Full catalog')}</p>
          <h1 className="mt-3 font-serif text-[88px] leading-none sm:text-[130px] lg:text-[170px]">Menu</h1>
          <p className="mt-4 font-script text-3xl text-cream sm:text-4xl">The Soeds Coffee, Eats, Spaces</p>
        </div>
      </section>

      {/* Bar kategori + pencarian */}
      <div className="sticky top-16 z-30 border-b border-hairline bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-1 px-4 py-2 sm:px-8 lg:flex-row lg:items-center lg:gap-6">
          <div role="tablist" aria-label={t('Kategori', 'Categories')} className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:flex-1 lg:px-0">
            {[{ id: 'all' as const, id_label: 'Semua', en_label: 'All' }, ...CATEGORIES].map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={cat === c.id && !term}
                onClick={() => {
                  setQ('');
                  go(c.id === 'all' ? 'menu' : `menu:${c.id}`);
                }}
                className={`label min-h-11 shrink-0 whitespace-nowrap rounded-full px-4 transition ${
                  cat === c.id && !term ? 'bg-crimson text-white' : 'text-charcoal hover:text-crimson'
                }`}
              >
                {lang === 'id' ? c.id_label : c.en_label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="no-scrollbar flex shrink-0 gap-2">
              {quick(onlyFav, setOnlyFav, t('Favorit', 'Favorites'))}
              {quick(onlyNew, setOnlyNew, t('Menu baru', 'New'))}
            </div>
            <label className="relative min-w-0 flex-1 lg:w-64 lg:flex-none">
              <span className="sr-only">{t('Cari menu', 'Search menu')}</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('Cari menu…', 'Search menu…')}
                className="h-11 w-full rounded-full border border-hairline bg-white pl-9 pr-3 text-sm outline-none transition focus:border-crimson focus:ring-1 focus:ring-crimson"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 pb-32 sm:px-8">
        {view.length === 0 ? (
          <p className="py-32 text-center font-serif text-2xl text-burgundy">
            {t('Menu yang kamu cari belum ada. Coba kata kunci lain.', 'We could not find that menu item. Try another keyword.')}
          </p>
        ) : (
          view.map((g, i) => {
            const first = showBands && (i === 0 || view[i - 1].kategori !== g.kategori);
            const c = categoryById(g.kategori)!;
            return (
              <div key={g.key} className={i > 0 ? 'border-t border-hairline' : ''}>
                {first && (
                  <h2 className="pt-14 font-serif text-5xl text-crimson sm:text-6xl">{label(c)}</h2>
                )}
                <GroupBlock group={g} index={i} />
              </div>
            );
          })
        )}

        <p className="border-t border-hairline pt-6 text-xs text-stone">
          {t('Harga belum termasuk pajak. Foto dan produk dapat berbeda.', 'Prices exclude tax. Photos and products may vary.')}
        </p>
      </div>

      {/* Tombol melayang */}
      {waHref ? (
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className="label fixed bottom-4 right-4 z-30 flex min-h-12 items-center gap-2 rounded-full bg-crimson px-5 text-white shadow-xl transition hover:bg-crimson-dark sm:bottom-6 sm:right-6"
        >
          <WhatsAppIcon />
          {t('Pesan via WhatsApp', 'Order via WhatsApp')}
        </a>
      ) : (
        <button
          type="button"
          onClick={openReservation}
          className="label fixed bottom-4 right-4 z-30 flex min-h-12 items-center gap-2 rounded-full bg-crimson px-5 text-white shadow-xl transition hover:bg-crimson-dark sm:bottom-6 sm:right-6"
        >
          <WhatsAppIcon />
          {t('Pesan via WhatsApp', 'Order via WhatsApp')}
        </button>
      )}
    </main>
  );
};
