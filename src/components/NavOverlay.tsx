import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useLang } from '../lib/lang';
import { useNav } from '../lib/nav';
import { useContent } from '../lib/content';
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from './ui';
import { socialLinks } from './Footer';

export const NavOverlay: React.FC = () => {
  const { t } = useLang();
  const { navOpen, setNavOpen, go } = useNav();
  const { content } = useContent();
  const social = socialLinks(content.info);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setNavOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen, setNavOpen]);

  const links = [
    { id: 'home', label: t('Beranda', 'Home') },
    { id: 'tentang', label: t('Tentang Kami', 'About Us') },
    { id: 'menu', label: 'Menu' },
    { id: 'perjalanan', label: t('Perjalanan Kami', 'Our Journey') },
    { id: 'acara', label: t('Acara & Promo', 'Events & Promos') },
    { id: 'kontak', label: t('Kontak', 'Contact') },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('Menu navigasi', 'Navigation')}
      aria-hidden={!navOpen}
      className={`on-crimson fixed inset-0 z-50 overflow-y-auto bg-crimson text-white transition-opacity duration-300 ${
        navOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      <div className="mx-auto flex min-h-full max-w-[1440px] flex-col px-4 py-4 sm:px-8">
        <div>
          <button
            type="button"
            onClick={() => setNavOpen(false)}
            aria-label={t('Tutup menu', 'Close menu')}
            className="-ml-2 flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-white/10"
          >
            <X className="h-7 w-7" strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center py-6 md:pl-[8%]">
          <ul className="space-y-1 sm:space-y-2">
            {links.map((l, i) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => go(l.id)}
                  className="group flex items-baseline gap-4 py-1 text-left font-serif text-[40px] leading-[1.1] transition hover:translate-x-2 hover:text-cream sm:text-6xl lg:text-7xl"
                >
                  <span className="label w-6 font-sans text-white/50">0{i + 1}</span>
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col items-start justify-between gap-6 pb-4 sm:flex-row sm:items-end">
          <div className="flex gap-2">
            {social.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target={s.href === '#' ? undefined : '_blank'}
                rel="noreferrer"
                aria-label={s.name}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 transition hover:bg-white hover:text-crimson"
              >
                {s.name === 'Instagram' ? <InstagramIcon /> : s.name === 'TikTok' ? <TikTokIcon /> : <WhatsAppIcon />}
              </a>
            ))}
          </div>
          <p className="font-script text-4xl text-cream sm:text-5xl">Coffee, Eats, Spaces</p>
        </div>
      </div>
    </div>
  );
};
