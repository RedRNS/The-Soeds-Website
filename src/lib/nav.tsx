import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CATEGORIES, type CategoryId } from '../data/categories';

export type MenuFilter = CategoryId | 'all';
type Page = 'home' | 'menu';

interface NavCtx {
  page: Page;
  menuCategory: MenuFilter;
  /** 'home' | 'menu' | 'menu:<kategori>' | id section di beranda (tentang, perjalanan, acara, kontak, ...) */
  go: (target: string) => void;
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
  reservationOpen: boolean;
  openReservation: () => void;
  closeReservation: () => void;
}

const Ctx = createContext<NavCtx | null>(null);

function parseHash(): { page: Page; cat: MenuFilter } {
  const m = window.location.hash.match(/^#\/menu(?:\/([\w-]+))?/);
  if (!m) return { page: 'home', cat: 'all' };
  const cat = CATEGORIES.some((c) => c.id === m[1]) ? (m[1] as CategoryId) : 'all';
  return { page: 'menu', cat };
}

export const NavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [{ page, cat }, setRoute] = useState(parseHash);
  const [navOpen, setNavOpen] = useState(false);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Scroll ke section setelah halaman beranda tampil
  useEffect(() => {
    if (page !== 'home' || !pendingScroll) return;
    const id = pendingScroll;
    setPendingScroll(null);
    requestAnimationFrame(() => {
      if (id === 'home') window.scrollTo({ top: 0 });
      else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [page, pendingScroll]);

  // Halaman baru selalu mulai dari atas
  useEffect(() => {
    if (page === 'menu') window.scrollTo({ top: 0 });
  }, [page, cat]);

  const go = useCallback((target: string) => {
    setNavOpen(false);
    if (target === 'menu' || target.startsWith('menu:')) {
      const c = target.split(':')[1];
      window.location.hash = c ? `#/menu/${c}` : '#/menu';
      return;
    }
    if (window.location.hash.startsWith('#/menu')) {
      history.pushState(null, '', window.location.pathname);
      setRoute({ page: 'home', cat: 'all' });
    }
    setPendingScroll(target);
  }, []);

  // Kunci scroll saat overlay terbuka
  useEffect(() => {
    document.body.style.overflow = navOpen || reservationOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [navOpen, reservationOpen]);

  const value: NavCtx = {
    page,
    menuCategory: cat,
    go,
    navOpen,
    setNavOpen,
    reservationOpen,
    openReservation: () => {
      setNavOpen(false);
      setReservationOpen(true);
    },
    closeReservation: () => setReservationOpen(false),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useNav = (): NavCtx => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useNav harus di dalam NavProvider');
  return v;
};
