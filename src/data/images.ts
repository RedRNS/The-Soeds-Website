/**
 * FOTO PLACEHOLDER.
 * Ganti dengan foto asli The Soeds: taruh file di folder `public/foto/` lalu tulis '/foto/nama-file.jpg',
 * atau tempel link foto lengkap (https://...). Foto per-menu diatur lewat kolom `foto` di Google Sheets.
 */
const u = (id: string, w = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

export const IMG = {
  // Hero
  heroDrink: u('photo-1517701550927-30cf4ba1dba5', 700), // PLACEHOLDER: Montblanc Coffee
  heroDish: u('photo-1547928576-a4a33237cbc3', 800), //     PLACEHOLDER: Soto Betawi / Rawon
  heroMain: u('photo-1544025162-d76694265947', 1100), //    PLACEHOLDER: Truly Fantasteak

  // Foto kategori menu
  coffee: u('photo-1495474472287-4d71bcdd2085'),
  matcha: u('photo-1536256263959-770b48d82b0a'),
  fresh: u('photo-1513558161293-cdaf765ed2fd'),
  soup: u('photo-1547928576-a4a33237cbc3'),
  pizza: u('photo-1513104890138-7c749659a591'),
  steak: u('photo-1544025162-d76694265947'),
  snack: u('photo-1568901346375-23c9450c58cd'),

  // Suasana
  interior: u('photo-1554118811-1e0d58224f24'),
  cafe: u('photo-1442512595331-e89e73853f31'),
  music: u('photo-1511671782779-c97d3d27a1d4'),
  hall: u('photo-1559339352-11d035aa65de'),
  grill: u('photo-1558030006-450675393462'),
};

/** Galeri horizontal di beranda. Poster menu asli sebaiknya diganti foto dari PDF. */
export const GALLERY = [
  { title: 'Montblanc Coffee', tag: 'Asian-Melbourne Coffee Style', src: IMG.heroDrink },
  { title: 'Exoticism Nusantara', tag: 'Nusantara Pleasure', src: IMG.soup },
  { title: 'Supremo Pizzario', tag: 'American-Italian Soed\'s Style', src: IMG.pizza },
  { title: 'Kokuhnat Water', tag: 'Refreshing Iced Coconut', src: IMG.fresh },
  { title: 'Truly Fantasteak', tag: 'Steak that tastes fantastic', src: IMG.steak },
  { title: 'Asian-Melbourne Coffee', tag: 'Seri kopi terbaru', src: IMG.coffee },
];
