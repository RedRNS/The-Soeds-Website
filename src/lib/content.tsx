import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { csvToRecords } from './csv';
import { CATEGORIES, type CategoryId } from '../data/categories';
import menuCsv from '../data/menu.csv?raw';
import grupCsv from '../data/grup.csv?raw';
import promoCsv from '../data/promo.csv?raw';
import perjalananCsv from '../data/perjalanan.csv?raw';
import infoCsv from '../data/info.csv?raw';

export type Badge = 'FAVORIT' | 'BARU' | 'PROMO';
export type PromoKind = 'PROMO' | 'MENU BARU' | 'ACARA' | 'KOMUNITAS';

export interface MenuItem {
  id: string;
  kategori: CategoryId;
  grup: string;
  nama: string;
  deskripsi: string;
  harga?: number;
  hargaHot?: number;
  hargaCoret?: number;
  badge?: Badge;
  kode?: string;
  foto?: string;
}

export interface MenuGroup {
  key: string;
  kategori: CategoryId;
  nama: string;
  tagline: string;
  catatan: string[];
  pilihan: string[];
  badge?: Badge;
  foto?: string;
  /** 'poster' = tampilan panel crimson untuk seri spesial */
  poster: boolean;
  items: MenuItem[];
  /** true bila ada item dengan dua harga (Iced dan Hot) */
  dual: boolean;
}

export interface PromoItem {
  id: string;
  jenis: PromoKind;
  judul: string;
  deskripsi: string;
  tanggal: string;
  foto: string;
  tujuan: string;
}

export interface Milestone {
  tahun: string;
  judul: string;
  deskripsi: string;
  foto: string;
}

export type Info = Record<string, string>;

export interface Content {
  groups: MenuGroup[];
  promo: PromoItem[];
  perjalanan: Milestone[];
  info: Info;
}

type RawTabs = Record<'menu' | 'grup' | 'promo' | 'perjalanan' | 'info', string>;

const BUNDLED: RawTabs = {
  menu: menuCsv,
  grup: grupCsv,
  promo: promoCsv,
  perjalanan: perjalananCsv,
  info: infoCsv,
};

/** Kolom wajib per tab; dipakai untuk menolak respon Google yang bukan data (mis. sheet belum dibuat publik). */
const REQUIRED_COLUMN: Record<keyof RawTabs, string> = {
  menu: 'nama',
  grup: 'grup',
  promo: 'judul',
  perjalanan: 'tahun',
  info: 'kunci',
};

const toNumber = (v?: string): number | undefined => {
  if (!v) return undefined;
  const digits = v.replace(/[^\d]/g, '');
  return digits ? Number(digits) : undefined;
};

const isHidden = (v?: string) => /^(tidak|no|false|0|sembunyi|hide)$/i.test((v ?? '').trim());

const toBadge = (v?: string): Badge | undefined => {
  const b = (v ?? '').trim().toUpperCase();
  return b === 'FAVORIT' || b === 'BARU' || b === 'PROMO' ? b : undefined;
};

const toKind = (v?: string): PromoKind => {
  const k = (v ?? '').trim().toUpperCase();
  return k === 'PROMO' || k === 'ACARA' || k === 'KOMUNITAS' ? k : 'MENU BARU';
};

const validCategory = (v: string): v is CategoryId => CATEGORIES.some((c) => c.id === v);

const split = (v: string, sep: string) =>
  v
    .split(sep)
    .map((s) => s.trim())
    .filter(Boolean);

const INFO_DEFAULTS: Info = {
  alamat: '[ALAMAT LENGKAP]',
  whatsapp: '[NOMOR WHATSAPP]',
  jam_operasional: '[JAM OPERASIONAL]',
  instagram: '[LINK INSTAGRAM]',
  tahun_berdiri: '[TAHUN BERDIRI]',
};

/** Merapikan isi tab info supaya tahan salah isi: sel kosong, link tanpa https://, atau kode <iframe> utuh untuk peta. */
function normalizeInfo(info: Info) {
  for (const [k, def] of Object.entries(INFO_DEFAULTS)) if (!info[k]?.trim()) info[k] = def;
  for (const k of ['instagram']) {
    const v = info[k].trim();
    if (!v.startsWith('[') && !/^https?:\/\//i.test(v)) info[k] = 'https://' + v.replace(/^\/+/, '');
  }
  const peta = (info.peta ?? '').trim();
  const src = peta.match(/src\s*=\s*["']([^"']+)["']/i);
  info.peta = (src ? src[1] : peta).replace(/&amp;/g, '&');
}

export function buildContent(raw: RawTabs): Content {
  const items: MenuItem[] = csvToRecords(raw.menu)
    .filter((r) => r.nama && !isHidden(r.tampil))
    .map((r, i) => ({
      id: `m${i}`,
      kategori: r.kategori as CategoryId,
      grup: r.grup,
      nama: r.nama,
      deskripsi: r.deskripsi,
      harga: toNumber(r.harga),
      hargaHot: toNumber(r.harga_hot),
      hargaCoret: toNumber(r.harga_coret),
      badge: toBadge(r.badge),
      kode: r.kode || undefined,
      foto: r.foto || undefined,
    }))
    .filter((it) => validCategory(it.kategori));

  const meta = new Map<string, Record<string, string>>();
  const order: string[] = [];
  for (const r of csvToRecords(raw.grup)) {
    const key = `${r.kategori}|${r.grup}`;
    meta.set(key, r);
    order.push(key);
  }

  const byKey = new Map<string, MenuItem[]>();
  for (const it of items) {
    const key = `${it.kategori}|${it.grup}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push(it);
    if (!meta.has(key)) {
      meta.set(key, { kategori: it.kategori, grup: it.grup });
      order.push(key);
    }
  }

  const groups: MenuGroup[] = order
    .filter((key) => byKey.has(key))
    .map((key) => {
      const m = meta.get(key)!;
      const groupItems = byKey.get(key)!;
      return {
        key,
        kategori: m.kategori as CategoryId,
        nama: m.grup,
        tagline: m.tagline ?? '',
        catatan: split(m.catatan ?? '', '|'),
        pilihan: split(m.pilihan ?? '', '|'),
        badge: toBadge(m.badge),
        foto: m.foto || undefined,
        poster: (m.gaya ?? '').toLowerCase() === 'poster',
        items: groupItems,
        dual: groupItems.some((it) => it.hargaHot !== undefined),
      };
    });

  const promo: PromoItem[] = csvToRecords(raw.promo)
    .filter((r) => r.judul && !isHidden(r.tampil))
    .map((r, i) => ({
      id: `p${i}`,
      jenis: toKind(r.jenis),
      judul: r.judul,
      deskripsi: r.deskripsi,
      tanggal: r.tanggal,
      foto: r.foto,
      tujuan: r.tujuan,
    }));

  const perjalanan: Milestone[] = csvToRecords(raw.perjalanan)
    .filter((r) => r.tahun && !isHidden(r.tampil))
    .map((r) => ({ tahun: r.tahun, judul: r.judul, deskripsi: r.deskripsi, foto: r.foto }));

  const info: Info = {};
  for (const r of csvToRecords(raw.info)) if (r.kunci) info[r.kunci.toLowerCase()] = r.nilai;
  normalizeInfo(info);

  return { groups, promo, perjalanan, info };
}

const SHEET_ID = (import.meta.env.VITE_SHEET_ID as string | undefined)?.trim();
const CACHE_KEY = 'soeds-content-v1';

async function fetchTab(tab: keyof RawTabs): Promise<string | null> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = await res.text();
    const head = text.split('\n', 1)[0].toLowerCase();
    if (!head.includes(REQUIRED_COLUMN[tab])) return null;
    return text;
  } catch {
    return null;
  }
}

async function fetchSheet(): Promise<RawTabs | null> {
  const tabs = Object.keys(BUNDLED) as (keyof RawTabs)[];
  const results = await Promise.all(tabs.map(fetchTab));
  if (results.every((r) => r === null)) return null;
  const merged = { ...BUNDLED };
  tabs.forEach((t, i) => {
    const text = results[i];
    if (text) merged[t] = text;
  });
  return merged;
}

const readCache = (): RawTabs | null => {
  try {
    const s = localStorage.getItem(CACHE_KEY);
    return s ? (JSON.parse(s) as RawTabs) : null;
  } catch {
    return null;
  }
};

const writeCache = (raw: RawTabs) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(raw));
  } catch {
    /* penyimpanan penuh / diblokir: abaikan */
  }
};

export type ContentSource = 'bundled' | 'cache' | 'sheet';

interface ContentCtx {
  content: Content;
  source: ContentSource;
}

const Ctx = createContext<ContentCtx | null>(null);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<{ raw: RawTabs; source: ContentSource }>(() => {
    const cached = SHEET_ID ? readCache() : null;
    return cached ? { raw: cached, source: 'cache' } : { raw: BUNDLED, source: 'bundled' };
  });

  useEffect(() => {
    if (!SHEET_ID) return;
    let cancelled = false;
    fetchSheet().then((raw) => {
      if (cancelled || !raw) return;
      writeCache(raw);
      setState({ raw, source: 'sheet' });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ content: buildContent(state.raw), source: state.source }),
    [state],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useContent = (): ContentCtx => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useContent harus di dalam ContentProvider');
  return v;
};

export const isPlaceholder = (v?: string) => !v || v.trim().startsWith('[');

/** Daftar unggulan (maks. `limit`) satu kategori: yang FAVORIT lebih dulu, sisanya urutan menu. */
export function featuredItems(groups: MenuGroup[], kategori: CategoryId, limit = 6): MenuItem[] {
  const all = groups.filter((g) => g.kategori === kategori).flatMap((g) => g.items);
  const fav = all.filter((i) => i.badge === 'FAVORIT');
  const rest = all.filter((i) => i.badge !== 'FAVORIT');
  return [...fav, ...rest].slice(0, limit);
}
