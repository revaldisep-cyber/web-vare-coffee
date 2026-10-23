# Vare. Coffee & More

Website landing page statis (HTML, CSS, JavaScript murni). Tanpa build, tanpa database.

## Struktur
- `index.html` halaman utama
- `admin.html` editor menu (menghasilkan `data/menu.json`)
- `data/menu.json` daftar menu (harga, deskripsi, foto, stok)
- `assets/img/` logo dan foto hero
- `assets/products/` foto produk menu (PNG/WebP transparan)
- `css/`, `js/` gaya dan skrip

## Jalankan di komputer
Menu dimuat dengan `fetch`, jadi jangan buka lewat `file://`. Pakai salah satu:
```bash
npx serve .
# atau ekstensi "Live Server" di VS Code
```

## Upload ke GitHub
```bash
git init
git add .
git commit -m "Website Vare Coffee"
git branch -M main
git remote add origin https://github.com/USERNAME/vare-coffee.git
git push -u origin main
```

## Deploy ke Vercel
1. Masuk ke vercel.com, klik **Add New > Project**, pilih repo `vare-coffee`.
2. **Framework Preset:** Other. Kosongkan Build Command dan Output Directory.
3. Klik **Deploy**. Setiap `git push` ke `main` akan otomatis memperbarui website.
4. Domain sendiri: **Settings > Domains**.

## Mengubah menu
1. Buka `/admin` di website (atau lokal), ubah nama, harga, deskripsi, stok, atau tambah item.
2. Klik **Unduh menu.json**, timpa `data/menu.json`, lalu commit dan push.

## Menambah foto produk
1. Simpan foto (PNG/WebP transparan, rasio mirip, lebar sekitar 600px) di `assets/products/`, misalnya `americano.webp`.
2. Isi kolom foto di admin dengan `assets/products/americano.webp` (atau edit field `image` di `data/menu.json`).
3. Item tanpa foto otomatis memakai kotak "Foto produk".

## Mengubah kontak
Nomor WhatsApp ada di `js/config.js` (`WA_NUMBER`). Link ShopeeFood dan sosial media ada di `index.html`.
