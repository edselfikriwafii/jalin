# PLANNING.md — Jalin (Jago Lingo)

**Aplikasi:** Jalin — Platform Latihan IELTS Academic Writing dengan AI Scoring
**Deskripsi:** User berlatih soal IELTS Writing Part 1 (grafik/diagram) & Part 2 (esai), lalu AI menilai jawaban secara mendetail. Progress skill dilacak di dashboard.

**Tech Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Base UI · NextAuth.js v5 · PostgreSQL · Prisma ORM · Claude API (Anthropic) · Gemini API · Zod v4 · Resend · Vercel

---

## Progress

- [x] Step 1 — Project Setup & Struktur Folder
- [x] Step 2 — Database Schema (Prisma)
- [x] Step 3 — Autentikasi (Register, Verifikasi Email, Login)
- [x] Step 4 — Seed Data & Manajemen Soal
- [x] Step 5 — Daftar Soal & Pilih Mode
- [x] Step 6 — Antarmuka Menulis (Mode Latihan & Mode Ujian)
- [x] Step 7 — Integrasi AI & Engine Penilaian
- [x] Step 8 — Halaman Hasil Review
- [x] Step 9 — Dashboard & Progress Analytics
- [x] Step 10 — Polish & Error Handling

---

## Step-by-Step

### Step 1 — Project Setup & Struktur Folder

**Deskripsi:**
Membuat fondasi proyek Next.js 15 dengan semua library yang dibutuhkan. Bayangkan ini seperti membangun rangka rumah sebelum memasang dinding — semua step berikutnya bergantung pada step ini.

**Yang dibuat:**
- Inisialisasi proyek Next.js 15 dengan TypeScript dan Tailwind CSS
- Install semua dependencies (Base UI, Prisma, NextAuth, Resend, Zod, Anthropic SDK, Google Generative AI SDK)
- Konfigurasi `tailwind.config.ts` dengan warna dan font dari THEME.md
- Struktur folder: `app/`, `components/`, `lib/`, `actions/`, `prisma/`, `docs/`
- Layout dasar (`app/layout.tsx`) dengan font DM Serif Display + DM Sans
- Halaman beranda placeholder (`app/page.tsx`)
- File `docs/architecture.md` dengan diagram Mermaid awal
- File `docs/step-01-project-setup.md`

**Error handling yang dibuat:**
- Konfigurasi `next.config.ts` dengan pengaturan TypeScript strict mode

**Yang bisa dicoba:**
- Jalankan `npm run dev` → buka `localhost:3000` → melihat halaman beranda placeholder dengan font dan warna yang benar

---

### Step 2 — Database Schema (Prisma)

**Deskripsi:**
Merancang semua tabel database yang dibutuhkan aplikasi. Ini seperti membuat cetak biru lemari arsip sebelum mulai menyimpan berkas — menentukan laci apa saja yang ada dan bagaimana hubungannya satu sama lain.

**Yang dibuat:**
- `prisma/schema.prisma` dengan model-model berikut:
  - `User` — data akun pengguna (nama, email, password hash, status verifikasi)
  - `Account` — untuk OAuth provider (dibutuhkan NextAuth)
  - `VerificationToken` — token verifikasi email
  - `Question` — soal latihan (teks soal, tipe Part 1/Part 2, level kesulitan, data grafik JSON untuk Part 1 yang dirender oleh Recharts)
  - `Submission` — jawaban yang dikirim user (teks jawaban, mode latihan/ujian, waktu pengerjaan)
  - `Review` — hasil penilaian AI (overall band score, ringkasan feedback)
  - `CriterionScore` — nilai per kriteria IELTS Writing (Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy)
  - `SentenceFeedback` — rekomendasi perbaikan per kalimat
- `lib/prisma.ts` — singleton Prisma client

**Error handling yang dibuat:**
- Singleton Prisma client dengan pengecekan environment (development vs production) untuk mencegah koneksi berlebih

**Yang bisa dicoba:**
- Jalankan `npx prisma db push` → database terbentuk
- Jalankan `npx prisma studio` → lihat semua tabel kosong di browser

---

> ### 🚀 GitHub Push #1 — Setelah Step 3
> **Kondisi:** Autentikasi (register, verifikasi email, login) sudah berjalan end-to-end
> **Yang di-push:** Step 1 sampai Step 3
> **Catatan:** Pastikan `.env` tidak ikut ter-push. Cek dengan `git status` sebelum commit.

---

### Step 3 — Autentikasi (Register, Verifikasi Email, Login)

**Deskripsi:**
Membangun sistem login lengkap: user bisa daftar akun baru, menerima email verifikasi, lalu login. Ini seperti membuat pintu masuk bangunan — sebelum bisa masuk ke dalam (fitur utama), user harus punya kunci (akun terverifikasi).

**Yang dibuat:**
- Konfigurasi NextAuth v5: `auth.ts`, `app/api/auth/[...nextauth]/route.ts`
- Halaman register: `app/(auth)/register/page.tsx`
  - Form: nama, email, password, konfirmasi password
  - Server Action: hash password → simpan ke DB → kirim email verifikasi via Resend
- Halaman verifikasi email: `app/(auth)/verify-email/page.tsx`
  - Terima token dari URL → validasi → aktifkan akun
- Halaman login: `app/(auth)/login/page.tsx`
  - Form: email + password
  - Redirect ke dashboard setelah berhasil
- Middleware: `middleware.ts` — proteksi route yang membutuhkan login
- Layout autentikasi: `app/(auth)/layout.tsx`
- Template email verifikasi: `lib/email/verification-email.tsx`
- `docs/step-03-autentikasi.md`

**Error handling yang dibuat:**
- Pesan error jika email sudah terdaftar
- Pesan error jika token verifikasi tidak valid atau sudah kadaluarsa
- Pesan error jika email/password salah saat login
- Loading state pada tombol submit saat mengirim form
- Validasi Zod di semua form sebelum data dikirim ke server

**Yang bisa dicoba:**
- Buka `localhost:3000/register` → isi form → submit → cek email masuk
- Klik link verifikasi di email → akun aktif
- Buka `localhost:3000/login` → login → redirect ke dashboard

---

### Step 4 — Seed Data & Manajemen Soal

**Deskripsi:**
Mengisi database dengan soal-soal latihan IELTS agar aplikasi tidak kosong saat pertama dijalankan. Ini seperti mengisi lemari arsip dengan dokumen contoh sebelum dibuka untuk umum.

**Yang dibuat:**
- `prisma/seed.ts` — script untuk mengisi database dengan ~10 soal latihan:
  - 5 soal Part 1 (deskripsi grafik/diagram/tabel)
  - 5 soal Part 2 (esai dengan berbagai tipe: opinion, discussion, problem-solution, advantages-disadvantages)
- `lib/questions.ts` — fungsi query untuk mengambil soal dari database
- `docs/step-04-seed-data.md`

**Error handling yang dibuat:**
- Script seed idempotent — aman dijalankan berulang kali tanpa duplikasi data

**Yang bisa dicoba:**
- Jalankan `npx prisma db seed` → soal tersimpan di DB
- Buka `npx prisma studio` → lihat tabel `Question` terisi data

---

### Step 5 — Daftar Soal & Pilih Mode

**Deskripsi:**
Halaman utama tempat user memilih soal yang ingin dikerjakan, lalu memilih mode pengerjaan (latihan atau ujian). Seperti memilih soal dari kumpulan soal ujian, lalu memutuskan apakah mau latihan santai atau simulasi ujian sungguhan.

**Yang dibuat:**
- Halaman daftar soal: `app/(main)/questions/page.tsx`
  - Tampilkan semua soal dengan filter Part 1 / Part 2
  - Setiap card soal menampilkan: tipe, topik, level kesulitan
- Halaman pilih mode: `app/(main)/questions/[id]/page.tsx`
  - Tampilkan detail soal (teks + gambar untuk Part 1)
  - Tombol pilih: **Mode Latihan** (tanpa batas waktu) vs **Mode Ujian** (60 menit Part 1, 40 menit Part 2)
- Layout utama: `app/(main)/layout.tsx` — navbar dengan link ke dashboard dan soal
- `docs/step-05-daftar-soal.md`

**Error handling yang dibuat:**
- Tampilkan pesan "Soal tidak ditemukan" jika ID tidak valid
- Redirect ke `/login` jika belum login (via middleware)
- Loading skeleton saat data soal dimuat

**Yang bisa dicoba:**
- Login → buka `localhost:3000/questions` → lihat daftar soal
- Filter Part 1 / Part 2 bekerja
- Klik soal → muncul halaman pilih mode

---

### Step 6 — Antarmuka Menulis (Mode Latihan & Mode Ujian)

**Deskripsi:**
Halaman tempat user menulis jawaban — ini adalah inti dari aplikasi. Mode latihan tidak ada batasan waktu, mode ujian ada timer yang mundur. Bayangkan seperti lembar jawaban ujian: ada soalnya di atas, area jawaban di bawah.

**Yang dibuat:**
- Halaman menulis: `app/(main)/write/[submissionId]/page.tsx`
  - Soal ditampilkan di sisi kiri/atas (dengan gambar/grafik untuk Part 1)
  - Area teks besar untuk menulis jawaban
  - Word count real-time (IELTS Part 1 min 150 kata, Part 2 min 250 kata)
  - Tombol **Submit** dengan konfirmasi sebelum dikirim
- Komponen timer: `components/write/timer.tsx`
  - Hanya muncul di Mode Ujian
  - Countdown dari 60 atau 40 menit
  - Peringatan visual saat sisa waktu < 5 menit
  - Auto-submit saat waktu habis
- Server Action: `actions/write/start-session.ts` — buat record `Submission` baru saat user mulai mengerjakan
- Server Action: `actions/write/submit.ts` — simpan jawaban ke DB, redirect ke halaman review
- `docs/step-06-antarmuka-menulis.md`

**Error handling yang dibuat:**
- Pesan peringatan jika word count di bawah minimum saat submit
- Auto-save draft setiap 30 detik (simpan ke localStorage) agar tidak hilang jika browser refresh
- Konfirmasi dialog sebelum submit final
- Loading state saat proses submit

**Yang bisa dicoba:**
- Pilih soal → pilih Mode Latihan → tulis jawaban → submit
- Pilih soal → pilih Mode Ujian → lihat timer berjalan → submit sebelum waktu habis

---

> ### 🚀 GitHub Push #2 — Setelah Step 6
> **Kondisi:** Alur latihan lengkap sudah berjalan (pilih soal → tulis → submit) tanpa AI review
> **Yang di-push:** Step 4 sampai Step 6
> **Catatan:** Pastikan `.env` tidak ikut ter-push. Cek dengan `git status` sebelum commit.

---

### Step 7 — Integrasi AI & Engine Penilaian

**Deskripsi:**
Mengintegrasikan AI (Claude dari Anthropic sebagai model utama, Gemini sebagai fallback) untuk menilai jawaban IELTS. Ini adalah otak dari aplikasi — AI membaca jawaban user dan memberikan penilaian yang mendetail seperti seorang examiner IELTS sungguhan.

**Kriteria penilaian IELTS Writing:**
- **Task Achievement/Response** — apakah menjawab soal dengan tepat
- **Coherence & Cohesion** — alur dan organisasi tulisan
- **Lexical Resource** — kekayaan dan ketepatan kosakata
- **Grammatical Range & Accuracy** — variasi dan akurasi tata bahasa

**Yang dibuat:**
- `lib/ai/prompts.ts` — prompt template untuk penilaian Part 1 dan Part 2
- `lib/ai/assess.ts` — fungsi utama penilaian: panggil Claude API → fallback ke Gemini jika gagal → parse response → return structured result
- `lib/ai/types.ts` — TypeScript types untuk hasil penilaian AI
- Server Action: `actions/review/generate.ts` — trigger AI review setelah submission, simpan hasilnya ke DB (`Review`, `CriterionScore`, `SentenceFeedback`)
- `docs/step-07-integrasi-ai.md`

**Error handling yang dibuat:**
- Fallback dari Claude ke Gemini jika API gagal
- Retry logic dengan exponential backoff (3x percobaan)
- Pesan error yang jelas jika penilaian gagal sepenuhnya
- Timeout handling agar user tidak menunggu terlalu lama (max 30 detik)

**Yang bisa dicoba:**
- Submit jawaban → tunggu beberapa detik → AI memproses → otomatis redirect ke halaman hasil

---

### Step 8 — Halaman Hasil Review

**Deskripsi:**
Menampilkan hasil penilaian AI dengan tampilan yang informatif dan mudah dibaca. User bisa melihat skor total, skor per kriteria, dan saran perbaikan untuk setiap kalimat. Seperti menerima kertas ujian yang sudah dikoreksi lengkap dengan catatan dari guru.

**Yang dibuat:**
- Halaman review: `app/(main)/review/[submissionId]/page.tsx`
  - Overall band score (tampilan besar dan menonjol)
  - Soal asli di bagian atas untuk konteks
  - Jawaban user ditampilkan utuh
- Komponen skor per kriteria: `components/review/criterion-card.tsx`
  - Nama kriteria + skor + penjelasan singkat kekuatan & kelemahan
- Komponen feedback per kalimat: `components/review/sentence-feedback.tsx`
  - Kalimat asli ditampilkan
  - Saran perbaikan dengan alasan yang jelas
- Tombol "Coba Soal Lain" dan "Kembali ke Dashboard"
- `docs/step-08-halaman-review.md`

**Error handling yang dibuat:**
- Loading skeleton saat data review dimuat
- Pesan error jika review belum selesai diproses (dengan tombol refresh)
- Penanganan kasus review gagal dari sisi AI

**Yang bisa dicoba:**
- Setelah submit jawaban → lihat halaman review lengkap
- Cek skor per kriteria ditampilkan dengan benar
- Cek saran perbaikan per kalimat muncul

---

> ### 🚀 GitHub Push #3 — Setelah Step 8
> **Kondisi:** Alur lengkap sudah berjalan end-to-end (register → login → pilih soal → tulis → submit → lihat review)
> **Yang di-push:** Step 7 sampai Step 8
> **Catatan:** Pastikan `.env` (terutama API key AI) tidak ikut ter-push.

---

### Step 9 — Dashboard & Progress Analytics

**Deskripsi:**
Halaman utama yang muncul setelah login — menampilkan perkembangan skill user dari waktu ke waktu. Seperti rapor digital yang terus diperbarui setiap kali user selesai latihan.

**Yang dibuat:**
- Halaman dashboard: `app/(main)/dashboard/page.tsx`
  - Skor rata-rata per kriteria (ditampilkan sebagai bar atau angka)
  - Grafik tren overall band score dari waktu ke waktu
  - Daftar latihan terbaru (5 terakhir) dengan link ke halaman review masing-masing
  - Highlight area yang perlu ditingkatkan (kriteria dengan skor terendah)
- Komponen grafik tren: `components/dashboard/score-trend.tsx` (menggunakan library charting ringan)
- Komponen kartu progress: `components/dashboard/progress-card.tsx`
- Query analytics: `lib/analytics.ts` — fungsi untuk menghitung statistik dari data submission user
- `docs/step-09-dashboard.md`

**Error handling yang dibuat:**
- Tampilkan pesan "Belum ada data" dengan CTA untuk mulai latihan (jika user baru, belum punya submission)
- Loading skeleton untuk setiap bagian dashboard

**Yang bisa dicoba:**
- Login → lihat dashboard dengan statistik dari latihan yang sudah dilakukan
- Cek grafik tren memperlihatkan perkembangan skor
- Klik riwayat latihan → menuju halaman review yang sesuai

---

### Step 10 — Polish & Error Handling

**Deskripsi:**
Pass terakhir untuk memastikan semua bagian aplikasi terasa halus dan profesional. Mengisi celah-celah error handling yang mungkin terlewat, memastikan semua loading state konsisten, dan memperbaiki tampilan di berbagai ukuran layar.

**Yang dibuat/diperbarui:**
- `app/error.tsx` — halaman error global yang ramah pengguna
- `app/not-found.tsx` — halaman 404 yang informatif
- `app/loading.tsx` — loading state global
- `app/(main)/questions/loading.tsx` — skeleton untuk daftar soal
- `app/(main)/review/[submissionId]/loading.tsx` — skeleton untuk halaman review
- `app/(main)/dashboard/loading.tsx` — skeleton untuk dashboard
- Review semua form: pastikan semua pesan error muncul dengan benar
- Responsivitas mobile: pastikan semua halaman nyaman dibuka di HP
- `docs/step-10-polish.md`

**Error handling yang dibuat:**
- Semua halaman utama memiliki `error.tsx` dan `loading.tsx` yang konsisten
- Pesan error tidak pernah menampilkan stack trace ke user
- Semua fetch data di Server Components memiliki `try/catch`

**Yang bisa dicoba:**
- Buka aplikasi di layar HP → semua halaman tetap nyaman dibaca
- Sengaja masuk ke URL yang tidak ada → lihat halaman 404 yang rapi
- Simulasikan error → lihat pesan error yang ramah

---

> ### 🚀 GitHub Push #4 — Setelah Step 10
> **Kondisi:** Aplikasi lengkap dan siap dipresentasikan
> **Yang di-push:** Step 9 sampai Step 10
> **Catatan:** Pastikan `.env` tidak ikut ter-push. Ini adalah push final sebelum deployment ke Vercel.

---

## Ringkasan Halaman

| URL | Deskripsi | Perlu Login? |
|---|---|---|
| `/` | Halaman beranda / landing page | Tidak |
| `/register` | Daftar akun baru | Tidak |
| `/verify-email` | Konfirmasi token verifikasi email | Tidak |
| `/login` | Login | Tidak |
| `/dashboard` | Dashboard user & ringkasan progress | Ya |
| `/questions` | Daftar semua soal latihan | Ya |
| `/questions/[id]` | Detail soal & pilih mode (latihan/ujian) | Ya |
| `/write/[submissionId]` | Area menulis jawaban | Ya |
| `/review/[submissionId]` | Hasil penilaian AI lengkap | Ya |
