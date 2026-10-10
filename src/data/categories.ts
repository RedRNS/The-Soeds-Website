import { IMG } from './images';

export type CategoryId =
  | 'kopi'
  | 'non-kopi'
  | 'minuman-segar'
  | 'makanan-berat'
  | 'pizza-pasta'
  | 'steak'
  | 'camilan';

export interface Category {
  id: CategoryId;
  id_label: string;
  en_label: string;
  photo: string;
}

/** Urutan dan nama kategori di website. Foto di sini dipakai bila item/grup tidak punya foto sendiri. */
export const CATEGORIES: Category[] = [
  { id: 'kopi', id_label: 'Kopi', en_label: 'Coffee', photo: IMG.coffee },
  { id: 'non-kopi', id_label: 'Non-Kopi', en_label: 'Non-Coffee', photo: IMG.matcha },
  { id: 'minuman-segar', id_label: 'Minuman Segar', en_label: 'Refreshers', photo: IMG.fresh },
  { id: 'makanan-berat', id_label: 'Makanan Berat', en_label: 'Mains', photo: IMG.soup },
  { id: 'pizza-pasta', id_label: 'Pizza & Pasta', en_label: 'Pizza & Pasta', photo: IMG.pizza },
  { id: 'steak', id_label: 'Steak', en_label: 'Steak', photo: IMG.steak },
  { id: 'camilan', id_label: 'Camilan', en_label: 'Snacks', photo: IMG.snack },
];

/** Foto bergilir untuk grup tanpa foto sendiri (placeholder). */
const EXTRA: Partial<Record<CategoryId, string[]>> = {
  kopi: [IMG.heroDrink, IMG.cafe],
  'makanan-berat': [IMG.grill, IMG.snack],
  camilan: [IMG.heroMain],
  'pizza-pasta': [IMG.snack],
};

export const groupPhoto = (cat: CategoryId, groupName: string): string => {
  const base = categoryById(cat)!.photo;
  const pool = [base, ...(EXTRA[cat] ?? [])];
  let h = 0;
  for (const ch of groupName) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return pool[h % pool.length];
};

export const categoryById =(id: string) => CATEGORIES.find((c) => c.id === id);
