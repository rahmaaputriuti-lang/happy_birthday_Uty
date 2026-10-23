# 🎂 Website Ulang Tahun 💗

Website mini ucapan ulang tahun buat orang tersayang. Terdiri dari 3 halaman yang
berurutan: kejutan pembuka → alasan kenapa dia istimewa → kenangan berdua.

Dibuat pakai **HTML, CSS, dan JavaScript** biasa. Tanpa build tool, tanpa instalasi —
tinggal buka file `index.html` langsung jalan.

---

## ✨ Fitur

**Halaman 1 — Kejutan Pembuka**
- Efek ketik di sapaan pembuka
- Judul dengan gradasi warna dan animasi huruf masuk satu-satu
- Konfeti dan kembang api saat halaman dibuka
- Kursor kustom dengan jejak sparkle
- Tombol musik (opsional)

**Halaman 2 — Alasan Kenapa Dia Istimewa**
- 6 alasan yang muncul satu per satu saat tombol diklik
- Tiap alasan punya GIF di dalam kartu
- Progres bar "n dari 6"
- Kartu bisa dimiringkan mengikuti kursor (efek 3D)

**Halaman 3 — Kenangan Berdua**
- Galeri foto kenangan dengan efek muncul saat di-scroll
- Pesan penutup dengan konfeti dan kembang api
- Tombol "Rayain Lagi!" buat nyalain kembang api sesuka hati

**Umum**
- 📱 Responsif, nyaman dibuka di HP maupun laptop
- 🎨 Semua animasi dibuat pelan dan halus supaya enak dilihat
- 🔧 Gampang dikustomisasi tanpa perlu ngerti koding

---

## 🚀 Cara Pakai

1. **Buka langsung** — klik dua kali `index.html`, langsung jalan di browser.

2. **Ganti nama dan sapaan** — buka file `config.js`, ubah isinya:

   ```js
   window.BIRTHDAY_CONFIG = {
       nama: "Sayang",        // ganti dengan nama dia
       sapaan: "Selamat ulang tahun ya, sayang ...",
       musik: "music.mp3"
   };
   ```

   Nama itu otomatis muncul di ketiga halaman.

3. **Ganti foto** — timpa `hero.jpg` (foto halaman 1), lalu `d1.jpg`, `d2.jpg`, dan
   `d3.jpg` (halaman 3, urutannya: kiri → tengah → kanan) dengan foto kalian.
   Supaya rapi, pakai foto dengan ukuran dan rasio yang mirip.

4. **Ganti GIF** — timpa `gif1.gif` dan `gif2.gif` dengan GIF kesukaan kalian.

5. **Nyalain musik** — taruh file `music.mp3` di folder yang sama. Musik mulai
   berbunyi begitu tombol pertama diklik. Kalau filenya nggak ada, tombolnya
   diam aja dan situsnya tetap jalan normal.

6. **Ubah isi teks** — semua kata-kata ada di `index.html`, `cause.js` (bagian
   `reasons`), dan `last.html`. Tinggal ganti teksnya saja.

---

## 📁 Struktur File

```
├── index.html     Halaman 1: kejutan pembuka
├── cause.html     Halaman 2: alasan kenapa dia istimewa
├── last.html      Halaman 3: kenangan dan pesan penutup
├── config.js      Pengaturan nama, sapaan, dan musik
├── fx.js          Mesin efek: konfeti, kembang api, hati, sparkle
├── script.js      Logika halaman 1
├── cause.js       Logika halaman 2
├── last.js        Logika halaman 3
├── style.css      Tampilan halaman 1
├── cause.css      Tampilan halaman 2
├── last.css       Tampilan halaman 3
├── d1-d3.jpg      Foto kenangan (halaman 3: kiri, tengah, kanan)
├── hero.jpg       Foto di halaman 1
└── gif1-2.gif     GIF untuk halaman 2
```

---

## 🛠️ Teknologi

- **HTML5**
- **CSS3** (glassmorphism, gradient, animasi)
- **JavaScript** vanilla
- **GSAP 3.12** — animasi via CDN
- **Canvas API** — konfeti dan kembang api, ditulis sendiri tanpa library tambahan

---

## 🌐 Pasang di GitHub Pages

1. Unggah folder ini ke repo GitHub.
2. Buka **Settings → Pages**.
3. Pilih **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Situsnya akan bisa diakses di `https://username.github.io/nama-repo/`.

---

Dibuat pelan-pelan, pakai hati, buat kamu 💗
