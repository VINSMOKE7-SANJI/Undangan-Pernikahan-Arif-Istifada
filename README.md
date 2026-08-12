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

## Fitur v7 (update terbaru)

- **Efek slide diganti total** — `scroll-snap` bawaan browser dilepas (perilakunya tidak konsisten di berbagai browser Android, itu penyebab "gak mulus"nya). Sekarang tiap halaman punya animasi masuk yang eksplisit dan ringan: **bergantian muncul dari kiri dan kanan** dengan fade, hanya pakai `opacity`+`translate` (tanpa rotasi 3D berat) supaya tetap mulus di HP kelas bawah.
- **Ukuran kupu-kupu dikunci** (56–72px) supaya tidak bisa membesar sendiri lagi.
- **Kupu-kupu diganti dengan gambar watercolor pink yang kamu kirim** (`assets/images/butterfly-pink.png`) — latar putihnya dihapus pakai flood-fill dari tepi gambar (bukan colorkey global), jadi highlight putih *di dalam* sayapnya tetap utuh, tidak ikut transparan, dan tepinya halus tanpa garis putih tersisa. Animasinya sekarang dua lapis: elemen pembungkus mengatur jalur terbang (melayang + rotasi 3D ringan), gambarnya sendiri punya animasi "kepak" halus (scaleX + rotate kecil) supaya tetap terasa hidup walau dari satu pose statis.

## Fitur v6 (update terbaru)

- **Slide antar halaman lebih smooth, getarnya hilang** — akar masalahnya ditemukan: `scroll-snap` sebelumnya dipasang di elemen yang salah (`.app-shell`, yang sebenarnya tidak pernah "scroll" sendiri), jadi snap asli dari browser belum pernah aktif. Sekarang dipasang di elemen yang benar-benar scroll (`html`). Efek animasi masuk tiap section juga dihaluskan (rotasi & pergeseran diperkecil, deteksi scroll pakai zona aman di tengah layar) supaya tidak lagi terjadi "getar" akibat animasi saling tabrakan dengan pendeteksi scroll.
- **Musik otomatis mati saat Video Kenangan diputar**, dan otomatis lanjut lagi begitu videonya selesai (atau saat video di-pause manual).
- **Halaman penutup "Terima Kasih" dirapikan** — baris tanggal "Minggu, 20 September 2026" dihapus dari sana karena sudah ada di halaman awal (countdown).

## Fitur v5 (update terbaru)

- **Frame bunga sakura kini ikut "bernapas"** — pakai animasi Ken Burns yang sama seperti foto opening, otomatis berjalan di semua halaman (hero, ayat, mempelai, acara, dst, sampai closing). Ganti gambar di `framePhoto` (field baru di `wedding.json`) kapan pun, animasinya tetap jalan otomatis tanpa perlu sentuh CSS/JS.
- **Kupu-kupu sekarang benar-benar transparan** — sebelumnya pakai video MP4 + trik CSS `mix-blend-mode`, ternyata trik itu gagal karena struktur susunan lapisan (stacking context) di halaman membuat mode blend tidak "melihat" konten asli di belakangnya, jadi kotak putihnya kebawa. Sekarang diproses ulang dari `Butterfly.mp4` yang sama (bukan file baru) memakai teknik chroma-key ke format WebP beralpha asli (`assets/images/butterflies.webp`) — jadi transparansinya dijamin, tidak bergantung ke trik CSS lagi.
- **Ucapan dibatasi 1 kali per perangkat** — begitu tamu kirim ucapan, form otomatis diganti pesan "sudah terkirim" dan tidak bisa kirim lagi dari perangkat/browser yang sama. Catatan jujur: ini dibatasi lewat penyimpanan lokal browser (localStorage), bukan sistem terpusat — kalau tamu ganti browser lain atau mode incognito, batasannya reset. Untuk benar-benar 1x per tamu lintas perangkat, perlu backend (di luar cakupan yang diminta sebelumnya).
- **Nama tamu dari link `?to=` otomatis mengisi & mengunci kolom nama** di form ucapan — tamu tinggal isi doa/ucapannya saja. Kalau linknya tidak membawa `?to=` (link umum), kolom nama tetap bisa diisi manual seperti biasa.
- **Live streaming** sudah diisi contoh link RCTI+ (`https://www.rctiplus.com/tv/rcti`) di `wedding.json` — section otomatis tampil karena linknya terisi. Kosongkan `liveStream.url` lagi kapan saja untuk menyembunyikannya total.

## Fitur v4 (update terbaru)

- **Nama mempelai diganti**: pria **Arifiansyah (Arif)**, wanita **Istifadah (Isda)** — sudah diterapkan ke seluruh bagian undangan (opening, hero, kartu mempelai, closing, footer WA, judul tab browser).
- **Frame bunga sakura** (`assets/images/frame.jpg` yang kamu kirim) sekarang jadi latar dekoratif di **setiap halaman/section** setelah tombol "Buka Undangan" diklik — hero, ayat, mempelai, acara, kisah cinta, galeri, video, live streaming, wedding gift, ucapan, dan closing. Warna teks di seluruh section disesuaikan jadi tone emerald tua/emas agar tetap terbaca di atas warna krem frame.
- **Konten diposisikan di tengah** tiap halaman (vertikal & horizontal) supaya pas mengisi area kosong di tengah bingkai — tiap section kini setinggi minimal 1 layar penuh dan kontennya center, jadi terasa seperti kartu undangan asli, bukan sekadar list.
- **Kupu-kupu 3D melayang** di semua halaman (termasuk saat opening) — diambil dari video `Butterfly.mp4` yang kamu kirim, latar putihnya otomatis "hilang" pakai teknik CSS `mix-blend-mode`, lalu diberi animasi terbang melayang-layang dengan efek rotasi 3D (`rotateY`/`translateZ`) tanpa henti, sepanjang video di-loop.
- **Efek slide tetap jalan dua arah**: animasi masuk tiap section sekarang replay setiap kali digeser ke atas maupun ke bawah (sebelumnya cuma sekali saat pertama muncul).
- **Tombol navigasi (☰) kini melayang tetap (fixed)** di semua halaman setelah undangan dibuka — tidak lagi cuma muncul di halaman hero saja. Otomatis "mengalah" (sembunyi sebentar) saat panel menu terbuka supaya tidak tumpang tindih.
- Latar 3D motion (bintang geometris + cahaya lembut melayang) tetap ada khusus di **layar pembuka** dan **halaman penutup ucapan terima kasih**, sesuai permintaan sebelumnya.

> **Catatan teknis kupu-kupu:** video kupu-kupu ini murni pemrosesan video biasa (buang warna putih latar, ulang video, animasikan posisinya pakai CSS) — bukan AI generatif, jadi aman dipakai berulang di banyak tempat. Kalau nanti ingin efeknya lebih halus/besar/kecil, ukurannya diatur di `assets/css/style.css` bagian `.bf1/.bf2/.bf3`.

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
