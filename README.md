# The Soeds Purwokerto

Website company profile + menu digital The Soeds (Coffee · Eats · Spaces). React + Vite + Tailwind.

## Menjalankan
```
npm install
npm run dev      # http://localhost:3000
npm run build    # hasil di folder dist/
```

## Struktur singkat
- `src/components/` — section beranda, halaman Menu (`#/menu`), modal reservasi, overlay navigasi
- `src/data/*.csv` — data bawaan (menu, grup, promo, perjalanan, info). Format sama dengan tab Google Sheets
- `src/data/images.ts` — foto placeholder (ganti dengan foto asli)
- `src/lib/content.tsx` — pembaca data: Google Sheets bila `VITE_SHEET_ID` diisi, jika tidak memakai CSV bawaan
- `public/logo-red.png`, `public/logo-cream.png` — logo versi merah dan krem (transparan)

## Update konten
Lihat [PANDUAN-UPDATE.md](PANDUAN-UPDATE.md). Menu, harga, promo, dan kontak diubah lewat Google Sheets.
