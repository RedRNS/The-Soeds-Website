import React from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';
import { useLang } from '../lib/lang';
import { useNav } from '../lib/nav';
import { useContent, isPlaceholder, type Info } from '../lib/content';
import { waLink } from '../lib/format';
import { InstagramIcon, RoundCta, WhatsAppIcon } from './ui';

export function socialLinks(info: Info) {
  const link = (v?: string) => (v && /^https?:\/\//i.test(v) ? v : '#');
  return [
    { name: 'Instagram', href: link(info.instagram) },
    { name: 'WhatsApp', href: waLink(info.whatsapp) ?? '#' },
  ];
}

const MapBlock: React.FC<{ src?: string }> = ({ src }) => {
  const { t } = useLang();
  const ok = src && /^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed/i.test(src);
  return (
    <div className="border-4 border-crimson bg-cream">
      {ok ? (
        <iframe
          title={t('Lokasi The Soeds di Google Maps', 'The Soeds location on Google Maps')}
          src={src}
          loading="lazy"
          className="block h-[320px] w-full border-0 md:h-[380px]"
        />
      ) : (
        <div className="flex h-[240px] flex-col items-center justify-center gap-2 text-center md:h-[300px]">
          <MapPin className="h-7 w-7 text-crimson" strokeWidth={1.5} />
          <p className="label text-burgundy">[EMBED PETA GOOGLE MAPS]</p>
          <p className="max-w-sm px-6 text-xs text-stone">
            {t('Isi baris "peta" di tab info Google Sheets dengan link embed Google Maps.', 'Set the "peta" row in the info sheet to a Google Maps embed link.')}
          </p>
        </div>
      )}
    </div>
  );
};

export const Footer: React.FC = () => {
  const { t } = useLang();
  const { go, openReservation } = useNav();
  const { content } = useContent();
  const info = content.info;
  const social = socialLinks(info);
  const wa = waLink(info.whatsapp);

  const links = [
    { label: t('Reservasi', 'Reservations'), act: openReservation },
    { label: t('Tentang Kami', 'About Us'), act: () => go('tentang') },
    { label: 'Menu', act: () => go('menu') },
    { label: t('Perjalanan Kami', 'Our Journey'), act: () => go('perjalanan') },
    { label: t('Acara', 'Events'), act: () => go('acara') },
  ];

  const row = (icon: React.ReactNode, text?: string, href?: string | null) => (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-cream/80">{icon}</span>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="hover:underline">
          {text}
        </a>
      ) : (
        <span className={isPlaceholder(text) ? 'text-cream/70' : ''}>{text}</span>
      )}
    </li>
  );

  return (
    <>
      <section id="kontak" className="bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-[72px] sm:px-8 md:py-[100px]">
          <MapBlock src={info.peta} />
        </div>
      </section>

      <footer className="on-crimson bg-crimson text-white">
        <div className="mx-auto max-w-[1440px] px-4 pb-8 pt-[72px] sm:px-8 md:pt-[100px]">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <img src="/logo-cream.png" alt="The Soeds Coffee Eats Spaces" className="h-auto w-[220px] sm:w-[280px]" />
              <p className="label mt-6 text-white/80">Coffee · Eats · Spaces</p>
            </div>

            <nav aria-label="Footer" className="lg:col-span-3">
              <ul className="space-y-1">
                {links.map((l) => (
                  <li key={l.label}>
                    <button
                      type="button"
                      onClick={l.act}
                      className="label flex min-h-11 items-center tracking-[0.1em] text-white transition hover:translate-x-1 hover:text-cream"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lg:col-span-4">
              <ul className="space-y-4 text-sm leading-relaxed">
                {row(<MapPin className="h-4 w-4" />, info.alamat)}
                {row(<Phone className="h-4 w-4" />, info.whatsapp, wa)}
                {row(<Clock className="h-4 w-4" />, info.jam_operasional)}
              </ul>
              <div className="mt-6 flex gap-2">
                {social.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target={s.href === '#' ? undefined : '_blank'}
                    rel="noreferrer"
                    aria-label={s.name}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 transition hover:bg-white hover:text-crimson"
                  >
                    {s.name === 'Instagram' ? <InstagramIcon /> : <WhatsAppIcon />}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col-reverse items-start justify-between gap-8 border-t border-white/20 pt-6 sm:flex-row sm:items-end">
            <p className="label text-white/80">© 2026 The Soeds Purwokerto</p>
            <RoundCta onClick={openReservation} className="sm:-mt-24" />
          </div>
        </div>
      </footer>
    </>
  );
};
