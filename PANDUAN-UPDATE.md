# Panduan Update Konten The Soeds (untuk tim restoran)

Menu, harga, promo, jam buka, dan kontak diatur dari **satu Google Sheets**. Tidak perlu menyentuh kode.
Setelah Sheets diubah, website ikut berubah sendiri dalam beberapa menit (kadang perlu refresh).

## A. Setup sekali saja (dilakukan developer/admin)

1. Buka <https://sheets.google.com>, buat spreadsheet baru, misalnya "Konten The Soeds".
2. Buat **5 tab** dengan nama persis (huruf kecil): `menu`, `grup`, `promo`, `perjalanan`, `info`.
3. Untuk tiap tab: pilih tab itu, **File > Import > Upload**, pilih file CSV dengan nama sama dari folder `src/data/`
   (`menu.csv`, `grup.csv`, `promo.csv`, `perjalanan.csv`, `info.csv`), lalu pilih **"Replace current sheet"**.
4. Klik **Share > General access > "Anyone with the link" > Viewer**. (Ini hanya agar website bisa membaca. Orang lain tetap tidak bisa mengedit.)
5. Salin ID spreadsheet dari URL: `https://docs.google.com/spreadsheets/d/`**`INI_ID-NYA`**`/edit`
6. Buat file `.env.local` di folder proyek berisi:
   ```
   VITE_SHEET_ID=INI_ID-NYA
   ```
   Lalu build ulang dan deploy website (`npm run build`). Pengaturan ini cukup sekali.
7. Tambahkan akun staf yang boleh mengedit lewat **Share > Editor**.

> Jika `VITE_SHEET_ID` kosong atau Sheets tidak bisa dibaca, website otomatis memakai data bawaan (CSV di `src/data/`). Website tidak akan kosong.

## B. Cara update sehari-hari

### Tab `menu` (satu baris = satu menu)
| Kolom | Isi |
|---|---|
| kategori | `kopi`, `non-kopi`, `minuman-segar`, `makanan-berat`, `pizza-pasta`, `steak`, atau `camilan` |
| grup | Nama sub-kategori, mis. `The Espresso Based`. Harus sama persis dengan tab `grup` |
| nama | Nama menu |
| deskripsi | Keterangan singkat (boleh kosong) |
| harga | Angka saja, mis. `27000`. Untuk menu Iced/Hot, ini harga **Iced** |
| harga_hot | Harga Hot (kosongkan bila tidak ada). Menu hanya Hot: isi ini saja |
| harga_coret | Harga normal yang dicoret (untuk promo). Isi `harga` dengan harga promo |
| badge | `FAVORIT`, `BARU`, atau `PROMO` (boleh kosong) |
| kode | Huruf penanda kecil, mis. `A`/`R` (Arabica/Robusta) atau `A`-`E` (steak) |
| foto | Alamat foto, mis. `/foto/rawon.jpg` atau link `https://...` (boleh kosong) |
| tampil | Isi `tidak` untuk menyembunyikan menu (mis. stok habis) tanpa menghapus baris |

- **Ubah harga**: edit angka di kolom `harga`.
- **Tambah menu**: tambahkan baris baru, isi `kategori` dan `grup` yang sudah ada.
- **Hapus/sembunyikan**: isi `tampil` dengan `tidak`.

### Tab `grup` (judul sub-kategori)
`kategori`, `grup` (nama), `tagline` (kalimat kecil miring), `catatan` (baris keterangan, pisahkan dengan tanda `|`),
`pilihan` (pilihan rasa, pisahkan dengan `|`), `badge` (`BARU`/`PROMO`), `foto`, `gaya` (`poster` = panel merah).
Urutan baris di tab ini = urutan tampil di website.

### Tab `promo` (Acara & Promo)
`jenis` (`PROMO`, `MENU BARU`, `ACARA`, `KOMUNITAS`), `judul`, `deskripsi`, `tanggal`, `foto`,
`tujuan` (isi nama kategori menu agar kartu membuka menu itu, mis. `steak`), `tampil`.

### Tab `perjalanan` (sejarah)
`tahun`, `judul`, `deskripsi`, `foto`, `tampil`. **Isi awal hanyalah contoh `[TAHUN 1]` dst., ganti dengan data asli.**

### Tab `info` (kontak)
Baris `alamat`, `whatsapp` (format `08xx...` atau `628xx...`), `email`, `jam_operasional`, `instagram`, `tiktok`
(link lengkap `https://...`), `tahun_berdiri`, `peta` (link **embed** Google Maps: Google Maps > Share > Embed a map > salin isi `src="..."`).
Tombol WhatsApp dan formulir reservasi baru aktif setelah `whatsapp` diisi.

## C. Soal foto
- Paling gampang: tempel link foto lengkap (`https://...`) dari layanan penyimpanan gambar.
- Atau simpan file di folder `public/foto/` proyek, tulis `/foto/nama-file.jpg` di Sheets. Cara ini butuh deploy ulang oleh developer.
- Foto yang tampil sekarang hanyalah **placeholder** sampai foto asli dipasang.

## D. Catatan penting
- Jangan mengubah **judul kolom** (baris pertama) dan **nama tab**.
- Jika kolom berisi koma, Sheets akan mengurusnya otomatis. Tidak perlu tanda kutip tambahan.
- Perubahan bisa tertunda beberapa menit di sisi Google. Jika belum muncul, refresh halaman.
