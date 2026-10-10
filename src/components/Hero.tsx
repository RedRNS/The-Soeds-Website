import React from 'react';
import { ArrowUpRight, Globe } from 'lucide-react';
import { useLang } from '../lib/lang';
import { useNav } from '../lib/nav';
import { useContent } from '../lib/content';
import { IMG } from '../data/images';
import { Img, RoundCta } from './ui';

const frame = 'overflow-hidden bg-burgundy shadow-2xl ring-1 ring-white/20';

export const Hero: React.FC = () => {
  const { t, lang, toggle } = useLang();
  const { openReservation, go } = useNav();
  const { content } = useContent();
  const since = content.info.tahun_berdiri || '[TAHUN BERDIRI]';

  const photoBig = (
    <Img src={IMG.heroMain} alt="Truly Fantasteak" eager className="h-full w-full object-cover" />
  );

  return (
    <section
      id="home"
      className="on-crimson relative flex min-h-[85vh] flex-col overflow-hidden bg-crimson text-white"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 pb-5 pt-7 sm:px-8 sm:pt-9">
        {/* Baris atas */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="label text-white/80">{t('Selamat datang di', 'Welcome to')}</p>
            <p className="mt-1 font-script text-3xl leading-none text-cream sm:text-4xl">Coffee, Eats, Spaces</p>
          </div>
          <div className="text-right">
            <p className="label text-white/80">{t('Rasa otentik', 'Authentic taste')}</p>
            <p className="label text-white/80">{t('di setiap sajian', 'in every serving')}</p>
          </div>
        </div>

        {/* ===== Desktop / tablet ===== */}
        <div className="hero-stage hidden flex-1 items-center md:flex">
          <div className="relative mx-auto my-6 h-[calc(var(--big)*1.333+175px)] w-full">
            {/* foto kecil (kiri atas) */}
            <div
              className={`${frame} absolute top-[3%] z-10 aspect-square w-[calc(var(--big)*0.38)]`}
              style={{ left: 'calc(50% - var(--big)*1.42)' }}
            >
              <Img src={IMG.heroDrink} alt="Montblanc Coffee" eager className="h-full w-full object-cover" />
            </div>
            {/* foto sedang (tengah atas) */}
            <div
              className={`${frame} absolute top-[9%] z-10 aspect-[4/3] w-[calc(var(--big)*0.66)]`}
              style={{ left: 'calc(50% - var(--big)*0.98)' }}
            >
              <Img src={IMG.heroDish} alt="Soto Betawi" eager className="h-full w-full object-cover" />
            </div>
            {/* foto besar vertikal (tengah) */}
            <div className={`${frame} absolute left-1/2 top-0 z-10 aspect-[3/4] w-[var(--big)] -translate-x-1/2`}>
              {photoBig}
            </div>

            {/* Judul raksasa, menimpa foto */}
            <h1 className="pointer-events-none absolute inset-x-0 top-[calc(var(--big)*0.56)] z-20 grid grid-cols-[1fr_var(--big)_1fr] items-baseline font-serif text-[calc(var(--big)*0.5)] font-medium leading-[0.9] tracking-tight [text-shadow:0_2px_30px_rgba(60,5,15,0.45)]">
              <span className="translate-x-[0.2em] justify-self-end">The</span>
              <span aria-hidden />
              <span className="-translate-x-[0.2em] justify-self-start">Soeds</span>
            </h1>

            {/* Sejak + CTA di bawah foto */}
            <div className="absolute inset-x-0 top-[calc(var(--big)*1.333+24px)] z-20 flex flex-col items-center">
              <p className="text-center">
                <span className="label text-white/80">{t('Sejak', 'Since')} </span>
                <span className="font-serif text-lg text-cream">{since}</span>
              </p>
              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={openReservation}
                  className="group flex h-14 items-center gap-3 rounded-full bg-white pl-8 pr-2 text-crimson shadow-xl ring-4 ring-white/25 transition duration-300 hover:scale-105 hover:bg-cream focus-visible:ring-white"
                >
                  <span className="label text-[13px] tracking-[0.12em]">{t('Pesan Meja', 'Book a Table')}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-crimson text-white transition group-hover:rotate-45">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => go('menu')}
                  className="label flex h-14 items-center rounded-full border border-white/70 px-7 text-[13px] tracking-[0.12em] text-white transition hover:bg-white hover:text-crimson"
                >
                  {t('Lihat Menu', 'View Menu')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Mobile ===== */}
        <div className="relative mt-4 min-h-[520px] flex-1 md:hidden">
          <div className={`${frame} absolute right-1 top-4 z-10 aspect-[3/4] w-[58%]`}>{photoBig}</div>
          <div className={`${frame} absolute left-1 top-[88px] z-10 aspect-[4/5] w-[36%]`}>
            <Img src={IMG.heroDish} alt="Soto Betawi" eager className="h-full w-full object-cover" />
          </div>
          <div className={`${frame} absolute left-[20%] top-0 z-10 aspect-square w-[24%]`}>
            <Img src={IMG.heroDrink} alt="Montblanc Coffee" eager className="h-full w-full object-cover" />
          </div>
          <h1 className="pointer-events-none absolute bottom-[84px] left-1 z-20 font-serif text-[84px] font-medium leading-[0.86] tracking-tight [text-shadow:0_2px_24px_rgba(60,5,15,0.5)]">
            The
            <br />
            Soeds
          </h1>
          <div className="absolute right-0 top-[236px] z-30">
            <RoundCta onClick={openReservation} />
          </div>
          <div className="absolute bottom-0 left-1">
            <span className="label text-white/80">{t('Sejak', 'Since')} </span>
            <span className="font-serif text-base text-cream">{since}</span>
          </div>
        </div>

        {/* Baris bawah */}
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/20 pt-4">
          <p className="label text-white/80">© 2026 / The Soeds Purwokerto</p>
          <button
            type="button"
            onClick={toggle}
            aria-label={t('Ganti bahasa ke English', 'Switch language to Bahasa Indonesia')}
            className="label -my-2 flex min-h-11 items-center gap-2 px-1 text-white transition hover:text-cream"
          >
            {lang.toUpperCase()}
            <Globe className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
};
