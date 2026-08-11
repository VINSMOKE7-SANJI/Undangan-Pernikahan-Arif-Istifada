# Undangan Pernikahan Digital — Fadli & Aisyah (Tema Islami)

Template "mesin" undangan: **satu template HTML**, semua isi undangan
(nama, tanggal, lokasi, cerita, galeri, rekening) diambil dari
`data/wedding.json`. Nama tamu diambil otomatis dari parameter URL `?to=`.

## Struktur folder

```
wedding/
├── index.html          ← mesin/template utama (JANGAN diedit isi teksnya, edit wedding.json)
├── manifest.json
├── data/
│   └── wedding.json    ← SEMUA data pasangan, acara, cerita, galeri, rekening
├── assets/
│   ├── css/style.css   ← seluruh desain
│   ├── js/script.js    ← seluruh fungsi & interaksi
│   ├── images/
│   │   ├── cover.jpg       ← foto sampul (opening + hero + background)
│   │   ├── bride.jpg       ← foto mempelai wanita (lingkaran)
│   │   ├── groom.jpg       ← foto mempelai pria (lingkaran)
│   │   ├── story-poster.jpg← foto background halaman "Terima Kasih"
│   │   └── gallery/01.jpg – 08.jpg
│   ├── audio/wedding.mp3   ← musik latar (belum disertakan, lihat README di folder ini)
│   └── icons/              ← ikon untuk manifest.json (PWA)
└── favicon.png
```

> Semua foto di atas saat ini adalah **placeholder** (kartu hijau-emas
> bertuliskan label). Ganti dengan foto asli memakai nama file yang sama
> persis, foto akan otomatis muncul di posisi yang benar.

## Cara kerja

```
GITHUB PAGES
     │
     ▼
index.html  ──loads──▶  data/wedding.json  (data pasangan, acara, dst)
     │                          │
     │◀────────URL ?to=────────┘  (nama tamu, mis. ?to=Bapak+RT+05)
     ▼
script.js merender semua bagian ke dalam index.html
     │
     ▼
style.css memberi tampilan premium (emerald + gold, motif bintang Islami)
     │
     ▼
UNDANGAN SIAP DIBUKA TAMU
     │
     ▼
Footer "Ingin undangan seperti ini?" → klik → WhatsApp 0812-4621-1461
```

1. `index.html` adalah template — struktur section-nya tetap, isinya kosong/​placeholder.
2. Saat halaman dibuka, `script.js` mengambil `data/wedding.json` lalu mengisi setiap section (nama mempelai, tanggal, akad & resepsi, cerita cinta, galeri, rekening, dst).
3. Nama tamu diambil dari parameter URL, contoh:
   `https://namadomain.github.io/wedding/?to=Bapak/Ibu+Pengurus+KPPMB+Makassar`
4. Semua bisa langsung di-host gratis di **GitHub Pages** — tinggal push folder ini ke repository.

## Mengubah isi undangan

Edit **`data/wedding.json`** saja — tidak perlu menyentuh HTML/CSS/JS:

- `groom` / `bride` — nama, orang tua, foto, instagram
- `event.akad` / `event.resepsi` — tanggal, jam, nama tempat, alamat, link Google Maps
- `event.dateISO` — dipakai untuk hitung mundur (countdown), format ISO dengan zona waktu, contoh `2026-09-20T08:00:00+08:00` (WITA)
- `loveStory` — array kisah cinta (boleh tambah/kurang item)
- `gallery` — daftar path foto galeri
- `gift.banks` — rekening amplop digital
- `meta.footerAd.waNumber` & `waMessage` — nomor & pesan WhatsApp di footer iklan
- `openingPhoto` — foto latar layar pembuka (kartu ucapan)
- `memoryVideo.src` / `poster` / `caption` — video kenangan, kosongkan `src` untuk menyembunyikan section ini
- `liveStream.url` — isi dengan link YouTube Live/Zoom/dll agar section Live Streaming muncul; biarkan kosong (`""`) untuk menyembunyikannya sepenuhnya

## Fitur v3 (update terbaru)

- **Layar pembuka** memakai foto latar bunga (`assets/images/opening-bg.jpg`) yang kamu kirim. Warna teks disesuaikan jadi emerald tua/emas agar tetap terbaca di atas kartu krem, dengan animasi Ken Burns halus dan fade-up bertahap per elemen.
- **Galeri** kini pakai foto pasangan dari `contoh_asset.jpg` yang kamu kirim — sudah dibuatkan **10 variasi crop & warna** (dekat, lebar, hangat, dingin, close-up masing-masing) agar terasa beragam, ditata dalam slider dua baris tanpa henti.
- **Video Kenangan** (`assets/video/kenangan.mp4`, ~56 detik) — video montase Ken Burns dari foto yang sama, lengkap dengan judul "The Wedding Of Fadli & Aisyah" di awal dan nama+tanggal di akhir. **Penting:** ini bukan video asli/rekaman baru — ini slideshow bergerak dari foto contoh yang kamu berikan, bukan video yang dibuat AI dari wajah orang tersebut. Ganti file ini dengan video kenangan asli kalian sebelum undangan disebar.
- **Live Streaming**: section baru yang otomatis **tersembunyi total** kalau `liveStream.url` di `wedding.json` masih kosong. Begitu diisi (link YouTube Live/Zoom/dll), section beserta link navigasinya langsung muncul, dan otomatis membuat embed jika linknya YouTube.
- **Transisi antar-halaman ala slide**: tiap section pakai `scroll-snap` (halaman "menempel" saat digeser) plus animasi masuk 3D (fade + rotateX + scale) supaya terasa seperti pindah slide, bukan cuma scroll biasa.
- **Efek parallax** halus pada foto hero saat digeser, plus hover tilt 3D di foto & video.

> **Catatan jujur soal foto/video contoh:** foto pasangan di galeri & video kenangan adalah foto yang kamu unggah sendiri (`contoh_asset.jpg`), dipakai apa adanya (dipotong & diberi gradasi warna berbeda), bukan wajah yang dibuat ulang oleh AI. Ini murni untuk keperluan demo tampilan. Ganti dengan foto & video asli mempelai sebelum undangan ini benar-benar dibagikan ke tamu.

## Fitur v2

- **Layar pembuka** dirapikan dengan animasi fade-up bertahap tiap elemen + efek zoom halus (Ken Burns) pada foto sampul.
- **Galeri** kini slider otomatis tanpa henti (dua baris, arah berlawanan, jeda saat disentuh) — sudah memuat 20 foto (`gallery/01.jpg`–`20.jpg`).
- **Tombol menu (☰)** di hero sekarang berfungsi — membuka panel navigasi ke setiap bagian (Beranda, Mempelai, Acara, Kisah Cinta, Galeri, Wedding Gift, Ucapan).
- **Kedua Mempelai** punya animasi masuk bertahap (stagger fade) + efek hover pada foto.
- **Waktu & Tempat** menyertakan **embed Google Maps** otomatis dari alamat di `wedding.json` (contoh, ganti `mapsUrl`/`address` dengan lokasi asli — bisa juga isi `mapEmbedUrl` manual untuk kontrol penuh).
- **Kisah Cinta**: tiap 4 momen (`loveStory`) sekarang punya foto sendiri (field `photo`), sedangkan Galeri tetap terpisah menampilkan seluruh 20 foto.
- **Wedding Gift**: rekening ditampilkan sebagai visual kartu debit bergradasi warna sesuai nama bank (BNI, Mandiri, BCA, BRI, BSI, CIMB dikenali otomatis; bank lain memakai gradasi emerald default). Ini bukan logo resmi bank (menghindari isu hak cipta/merek dagang), melainkan gaya visual kartu yang serupa.
- **Ucapan & RSVP**: tampilan baru dengan avatar inisial nama dan badge status warna (Hadir/Tidak Hadir/Masih Ragu), tanpa perlu Google Apps Script — tetap tersimpan di `localStorage` browser tamu.
- Semua `<img>` kini punya **fallback otomatis**: kalau file foto belum diganti/hilang, akan muncul placeholder halus bermotif bintang, bukan ikon gambar rusak.

> **Kalau masih menemukan error 404 di GitHub Pages** untuk `style.css` atau foto galeri padahal nama file sudah benar: GitHub Pages **case-sensitive** (beda dengan Windows/Mac). Pastikan nama folder & file di repository persis `assets/css/style.css`, `assets/images/gallery/01.jpg`, dst — huruf besar/kecil harus sama persis, dan strukturnya tidak berubah saat diunggah (upload folder utuh, jangan drag-drop file satu-satu ke luar strukturnya).

## Ucapan & RSVP

Form ucapan saat ini menyimpan data di **localStorage browser tamu**
(demo, tanpa server). Untuk menampung ucapan dari SEMUA tamu di satu
tempat, sambungkan `script.js` bagian `saveWish()` ke backend sederhana
seperti Google Apps Script + Google Sheets, atau layanan form seperti
Formspree.

## Deploy ke GitHub Pages

1. Buat repository baru, upload seluruh isi folder `wedding/`.
2. Buka **Settings → Pages**, pilih branch `main` folder `/ (root)`.
3. Undangan akan aktif di `https://namamu.github.io/nama-repo/`.
4. Bagikan link dengan menambahkan `?to=Nama+Tamu` di akhir URL.
