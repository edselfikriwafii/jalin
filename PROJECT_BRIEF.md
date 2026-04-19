# Project Brief

> Isi file ini sebelum memulai project baru, lalu berikan ke Claude dengan perintah:
> **"Baca PROJECT_BRIEF.md ini dan generate semua file setup untuk project saya"**
>
> Claude akan otomatis membuat:
> - `CLAUDE.md` — aturan dan cara kerja
> - `PLANNING.md` — roadmap step-by-step
> - `THEME.md` — panduan visual
> - `.gitignore` — perlindungan file rahasia (.env, references/, dll)
> - folder `references/` — siap diisi gambar referensi visual
>
> Untuk referensi visual, simpan gambar/screenshot ke folder `references/` lalu tulis path-nya di bagian Tema Visual.
> Folder `references/` tidak akan di-push ke GitHub (sudah diatur otomatis di `.gitignore`).

---

## Tentang Aplikasi

**Nama aplikasi:**
Jalin (Jago lingo)

**Deskripsi singkat** (apa yang bisa dilakukan user di aplikasi ini):
dengan menggunakan aplikasi ini, user bisa melakukan latihan ielts academic writing part 1 dan part 2

**Target pengguna** (siapa yang akan memakai aplikasi ini):
Pelajar atau profesional yang sedang mempersiapkan ujian IELTS Academic Writing

---

## Kebutuhan Aplikasi
> Jawab pertanyaan di bawah sesuai kebutuhan — Claude akan memilih tech stack terbaik berdasarkan jawaban Anda dan menjelaskan pilihannya sebelum mulai coding.

**Apakah aplikasi perlu menyimpan data pengguna?** (riwayat, preferensi, konten yang dibuat user)
[x] Ya
[ ] Tidak

**Apakah aplikasi perlu sistem login / akun pengguna?**
[x] Ya
[ ] Tidak

**Seberapa banyak pengguna yang diperkirakan?**
[ ] Hanya saya sendiri / tim kecil (< 10 orang)
[ ] Puluhan hingga ratusan pengguna
[x] Bisa ribuan pengguna atau lebih

**Apakah aplikasi menggunakan AI?**
[x] Ya → sebutkan kegunaan AI di aplikasi ini: untuk menilai jawaban dari user
[ ] Tidak

**Jika pakai AI, provider mana yang API key-nya Anda punya?**
[x] Claude (Anthropic)
[x] Gemini (Google)
[ ] OpenAI
[ ] Tidak pakai AI

**Di mana aplikasi akan diakses pengguna?**
[ ] Web browser (laptop/desktop)
[ ] Web browser (mobile/hp)
[x] Keduanya

**Apakah ada kebutuhan khusus lain?** (opsional, misal: upload file, pembayaran, notifikasi email):

---

## Fitur Utama

> Ceritakan perjalanan user dari pertama buka aplikasi sampai selesai menggunakannya.
> Tulis seperti bercerita — tidak perlu istilah teknis. Claude akan mengekstrak fitur-fitur yang perlu dibuat dari cerita Anda.
>
> Contoh:
> *"User membuka aplikasi, mendaftar akun, lalu memilih soal latihan dari daftar.
> Setelah memilih soal, user menulis jawabannya di area teks yang tersedia.
> Setelah selesai, user klik submit dan menunggu AI menilai tulisannya.
> Hasil penilaian muncul lengkap dengan skor dan feedback.
> User bisa melihat riwayat semua latihan yang pernah dilakukan di halaman dashboard."*

**Ceritakan alur aplikasi Anda:**
user membuka aplikasi, mendaftar akun, ada verifikasi email. setelah di verifikasi user bisa login dan memilih soal yang ada pada daftar. 
ada 2 mode yang dapat user pilih. mode latihan yaitu mode tanpa waktu, dan mode ujian dengan waktu. setelah memilih soal, user mengerjakan dan melakukan submit jika sudah selesai. jika sudah selesai ai akan melakukan review mendetail atas jawaban dari user. review terdiri dari pemberian nilai per kriteria penilaian, overall score dan rekomendasi perbaikan perkalimat untuk medapatkan score yang lebih tinggi. hasil review tersebut tersimpan dalam database dan muncul di dashboard user sehingga user dapat melihat perkembangan skill dan area mana yang perlu ditingkatkan.

---

## Tema Visual

> Ada dua cara mengisi bagian ini — pilih salah satu atau kombinasi keduanya:
>
> **Jalur 1 — Dari gambar referensi (direkomendasikan):**
> Simpan screenshot atau gambar inspirasi ke folder `references/`, lalu isi path-nya di bawah.
> Claude akan membaca gambar tersebut dan mengekstrak warna, gaya, dan mood secara otomatis.
> Bagian warna dan nuansa di bawah boleh dikosongkan.
>
> **Jalur 2 — Isi manual:**
> Kosongkan referensi visual, isi bagian warna dan nuansa secara manual.

**Referensi visual** (path ke gambar di folder `references/`, boleh lebih dari satu):
_______________

**Mode tampilan:**
[ ] Terang (light)
[ ] Gelap (dark)
[ ] Keduanya (ada toggle)
[ ] Sesuaikan dari gambar referensi

**Warna utama** (kosongkan jika pakai gambar referensi):
_______________

**Nuansa / mood** (kosongkan jika pakai gambar referensi):
[ ] Profesional & serius (seperti aplikasi bisnis)
[ ] Bersih & minimal (seperti Notion)
[ ] Ramah & santai (seperti aplikasi belajar)
[ ] Lainnya: _______________

**Catatan tambahan tentang tampilan** (opsional):
_______________

---

## Preferensi Coding

**Bahasa komentar di kode:**
[x] Bahasa Indonesia
[ ] English

**Hal yang TIDAK boleh dilakukan Claude tanpa konfirmasi:**
- [ ] Install package/library baru
- [ ] Ubah struktur database (schema)
- [ ] Hapus file yang sudah ada
- [x] Push ke GitHub
- [ ] Lainnya: _______________

**Preferensi lain** (opsional):
_______________

---

---

## Instruksi untuk Claude — Format Output yang Harus Diikuti
> Bagian ini adalah instruksi teknis untuk Claude. **Jangan diubah.**
> Saat menerima perintah "generate semua file setup", ikuti format di bawah secara konsisten.

---

### Format CLAUDE.md yang harus dihasilkan

CLAUDE.md harus memiliki bagian-bagian berikut dalam urutan ini:

**1. Tentang Proyek**
Ringkasan singkat aplikasi dan catatan bahwa penjelasan harus menggunakan bahasa yang mudah dipahami pemula.

**2. Wajib Dilakukan di Awal Setiap Sesi**
Instruksi eksplisit: sebelum mengerjakan apapun, baca `PLANNING.md` dan periksa checkbox setiap step:
- `- [x]` = step sudah selesai
- `- [ ]` = step belum dikerjakan
- Step pertama yang belum dicentang = posisi progress saat ini

**3. Aturan Komunikasi**

*Sebelum mulai setiap step*, jelaskan di chat:
- Apa yang akan dikerjakan dan mengapa
- File apa saja yang akan dibuat atau diubah
- Hubungan step ini dengan step sebelumnya

*Saat membuat atau mengubah file*, jelaskan di chat untuk setiap file:
- Peran file — apa fungsinya dalam aplikasi
- Penjelasan kode penting — bagian yang tidak langsung jelas, diterangkan dengan analogi sederhana
- Hubungan dengan file lain — file ini menerima data dari mana, mengirim ke mana, bergantung pada apa

*Setelah setiap step selesai*, rangkum di chat:
- Apa yang sudah selesai
- Apa yang bisa dicoba di browser
- Hal yang perlu diperhatikan sebelum lanjut ke step berikutnya

**4. Aturan Dokumentasi**

Setelah setiap step selesai, buat file `docs/step-XX-nama-step.md` yang berisi:
- Deskripsi singkat step ini
- Daftar file yang dibuat/diubah beserta perannya
- Penjelasan kode penting dalam bahasa sederhana
- Diagram hubungan antar file dalam format **Mermaid**
- Cara memverifikasi bahwa step ini berhasil

File `docs/architecture.md` dibuat di Step 1 dan **wajib diperbarui di akhir setiap step**. File ini bukan catatan sejarah pembangunan, melainkan **peta cara kerja aplikasi saat ini** — diorganisasi berdasarkan alur fitur, bukan urutan step.

Format `docs/architecture.md`:
- Gambaran besar (diagram Mermaid perjalanan user end-to-end)
- Satu section per fitur/alur utama (autentikasi, soal, menulis, AI, dashboard, dll.)
- Setiap section: penjelasan singkat, daftar file yang terlibat dengan penjelasan + analogi sederhana, diagram Mermaid hubungan antar file
- Struktur database (ER diagram Mermaid)
- Struktur folder lengkap
- Ditulis dengan bahasa yang mudah dipahami orang yang tidak berlatar belakang teknis

Semua dokumentasi di folder `docs/` ditulis dalam bahasa sesuai preferensi di bagian Preferensi Coding.

Tambahkan komentar singkat di baris kode yang fungsinya tidak langsung jelas. Gunakan bahasa sesuai preferensi coding.

**5. Aturan Error Handling**

Setiap fitur yang dibuat harus langsung disertai error handling minimal:
- Pesan error yang jelas jika operasi gagal (bukan layar kosong atau error mentah)
- Loading state (spinner/skeleton) jika ada operasi yang membutuhkan waktu
- Validasi input di form sebelum data dikirim

Step error handling di akhir bukan tempat pertama error handling dibuat — itu adalah pass terakhir untuk memastikan konsistensi.

**6. Aturan Konfirmasi**

Wajib tanya konfirmasi ke user sebelum:
- Menginstall package atau library baru
- Mengubah struktur tabel di database
- Menghapus file yang sudah ada
- Push ke GitHub
- Perubahan besar yang mempengaruhi banyak file sekaligus

**7. Aturan Git & GitHub**

File `.env` tidak boleh pernah di-push ke GitHub.
Folder `references/` tidak boleh di-push ke GitHub.

Titik push ditentukan berdasarkan kelompok fitur yang sudah bisa berjalan end-to-end (bukan per step). Sebelum setiap push, wajib tanya konfirmasi ke user terlebih dahulu — jangan pernah push otomatis. Ingatkan user untuk cek `.env` tidak ikut ter-commit.

**8. Aturan Kode**
- Gunakan TypeScript untuk semua file
- Jangan gunakan tipe `any`
- Satu file = satu tanggung jawab yang jelas

**9. Safeguard Wajib — Berlaku untuk Semua Project**

Aturan-aturan ini wajib diikuti tanpa pengecualian:

*Sebelum menggunakan method dari library* — Cek versi library di `package.json` dan cari pola penggunaan yang sudah ada di codebase. Jangan mengandalkan ingatan.

*Sebelum mengusulkan fix untuk error* — Nyatakan root cause secara eksplisit di chat sebelum menulis satu baris kode pun. Dilarang mencoba fix incremental tanpa memahami penyebabnya terlebih dahulu.

*Setelah mengubah schema database* — Wajib jalankan checklist berikut secara berurutan tanpa skip:
1. Generate client (sesuaikan dengan ORM yang dipakai)
2. Push / migrate perubahan ke database aktual
3. Hapus build cache (misal: `.next`, `.turbo`)
4. Re-seed data jika data lama tidak kompatibel dengan schema baru
5. Restart dev server

Jika satu langkah dilewati, kode mungkin compile tapi database akan error saat runtime.

*Sebelum membuat keputusan arsitektur* — Evaluasi kompatibilitas dengan platform deployment terlebih dahulu. Jika tidak yakin, gunakan konfigurasi default — bukan konfigurasi custom. Konfigurasi default hampir selalu lebih kompatibel dan lebih banyak didokumentasikan.

*Saat memberikan instruksi setup environment variable* — Wajib membedakan secara eksplisit nilai untuk development dan production. Jangan hanya tulis nilai contoh tanpa menjelaskan bahwa nilainya berbeda di production.

**10. Prinsip Coding (Karpathy-Inspired)**

*Berpikir Sebelum Coding* — Jangan berasumsi. Sebelum mulai:
- Nyatakan asumsi secara eksplisit. Jika tidak yakin, tanya.
- Jika ada beberapa cara interpretasi, sampaikan semuanya — jangan pilih diam-diam.
- Jika ada pendekatan lebih sederhana, katakan. Boleh memberi saran balik.
- Jika sesuatu tidak jelas, berhenti dan tanya.

*Kesederhanaan Diutamakan* — Kode seminimal mungkin yang menyelesaikan masalah:
- Tidak ada fitur di luar yang diminta.
- Tidak ada abstraksi untuk kode yang hanya dipakai sekali.
- Tidak ada error handling untuk skenario yang tidak mungkin terjadi.
- Tanya: "Apakah senior engineer akan bilang ini terlalu rumit?" Jika iya, sederhanakan.

*Perubahan Bedah* — Sentuh hanya yang diperlukan:
- Jangan perbaiki kode, komentar, atau format di sekitarnya yang tidak diminta.
- Jangan refactor sesuatu yang tidak rusak.
- Ikuti gaya kode yang sudah ada.
- Jika menemukan kode mati yang tidak terkait, sebutkan — jangan hapus sendiri.
- Setiap baris yang diubah harus bisa ditelusuri langsung ke permintaan user.

*Eksekusi Berbasis Tujuan* — Definisikan kriteria sukses sebelum mulai:
- Ubah tugas menjadi tujuan yang bisa diverifikasi. Contoh: "Buat halaman login" → "User bisa login dengan akun valid dan ditolak jika password salah"
- Untuk tugas multi-step, nyatakan rencana singkat dulu sebelum eksekusi.

---

### Format PLANNING.md yang harus dihasilkan

**Bagian 1 — Header**
Nama aplikasi, deskripsi, tech stack yang dipilih.

**Bagian 2 — Progress (checkbox)**
Daftar semua step dengan checkbox di bagian paling atas:
```
- [ ] Step 1 — Nama Step
- [ ] Step 2 — Nama Step
...
```

**Bagian 3 — Step-by-Step**

Setiap step mengikuti aturan: **satu step = satu fitur**. Jangan gabungkan beberapa fitur besar dalam satu step.

Setiap step memiliki format:
```
### Step N — Nama Step

**Deskripsi:**
Penjelasan sederhana apa yang dikerjakan dan mengapa — ditulis untuk pemula.

**Yang dibuat:**
- Satu fitur atau halaman spesifik

**Error handling yang dibuat:**
- Pesan error atau loading state yang disertakan di step ini

**Yang bisa dicoba:**
- Apa yang bisa dibuka/diklik/ditest setelah step selesai
```

Di antara step-step yang membentuk satu kelompok fitur, sisipkan penanda push:
```
> ### 🚀 GitHub Push #N — Setelah Step X
> **Kondisi:** [fitur apa yang sudah berjalan]
> **Yang di-push:** Step A sampai Step B
> **Catatan:** Pastikan .env tidak ikut ter-push
```

**Bagian 4 — Ringkasan Halaman**
Tabel semua URL halaman, deskripsi, dan apakah perlu login.

---

### Format THEME.md yang harus dihasilkan

Jika ada gambar referensi: baca gambar terlebih dahulu, ekstrak tema, lalu konfirmasi ke user sebelum menulis file.

THEME.md berisi:
- **Palet warna**: primary, secondary, background, surface, text, border, error, success (dalam format hex)
- **Tipografi**: font untuk heading dan body, ukuran dasar
- **Bentuk**: border radius yang digunakan (misal: rounded-md, rounded-xl)
- **Mood**: deskripsi singkat nuansa keseluruhan
- **Panduan komponen**: warna tombol utama, warna tombol sekunder, warna input, warna card
