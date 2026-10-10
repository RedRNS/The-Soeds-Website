import React from 'react';
import { useLang } from '../lib/lang';
import { useNav } from '../lib/nav';

export const Navbar: React.FC = () => {
  const { t } = useLang();
  const { go, setNavOpen, openReservation } = useNav();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-hairline bg-white">
      <div className="mx-auto grid h-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-3 sm:px-8">
        <div>
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label={t('Buka menu navigasi', 'Open navigation')}
            className="-ml-1 flex h-11 w-11 items-center justify-center text-charcoal transition hover:text-crimson"
          >
            <svg width="26" height="14" viewBox="0 0 26 14" aria-hidden>
              <path d="M0 1h26M0 13h26" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>

        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            go('home');
          }}
          aria-label="The Soeds, ke beranda"
          className="block"
        >
          <img src="/logo-red.png" alt="The Soeds Coffee Eats Spaces" className="h-[46px] w-auto" />
        </a>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={openReservation}
            className="label flex min-h-11 items-center px-1 tracking-[0.1em] text-charcoal transition hover:text-crimson"
          >
            {t('Reservasi', 'Reserve')}
          </button>
        </div>
      </div>
    </header>
  );
};
