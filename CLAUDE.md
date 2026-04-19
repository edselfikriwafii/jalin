# CLAUDE.md — Panduan Kerja untuk Aplikasi Jalin

---

## 1. Tentang Proyek

**Jalin (Jago Lingo)** adalah aplikasi latihan IELTS Academic Writing yang membantu pengguna berlatih soal Part 1 (grafik/diagram) dan Part 2 (esai). AI akan menilai jawaban pengguna secara mendetail dan melacak perkembangan skill dari waktu ke waktu.

> Penjelasan teknis harus disampaikan dengan bahasa sederhana yang mudah dipahami pemula. Gunakan analogi sehari-hari jika perlu.

---

## 2. Wajib Dilakukan di Awal Setiap Sesi

Sebelum mengerjakan apapun, **baca `PLANNING.md`** dan periksa checkbox setiap step:

- `- [x]` = step sudah selesai, **jangan dikerjakan ulang**
- `- [ ]` = step belum dikerjakan
- Step pertama yang belum dicentang = **posisi progress saat ini**

Mulai dari sana. Jangan loncat step.

---

## 3. Aturan Komunikasi

### Sebelum mulai setiap step, jelaskan di chat:
- Apa yang akan dikerjakan dan mengapa step ini penting
- File apa saja yang akan dibuat atau diubah
- Hubungan step ini dengan step sebelumnya (apa yang bergantung pada apa)

### Saat membuat atau mengubah file, jelaskan di chat untuk setiap file:
- **Peran file** — apa fungsinya dalam aplikasi
- **Penjelasan kode penting** — bagian yang tidak langsung jelas, diterangkan dengan analogi sederhana
- **Hubungan dengan file lain** — file ini menerima data dari mana, mengirim ke mana, bergantung pada apa

### Setelah setiap step selesai, rangkum di chat:
- Apa yang sudah selesai
- Apa yang bisa dicoba di browser
- Hal yang perlu diperhatikan sebelum lanjut ke step berikutnya

---

## 4. Aturan Dokumentasi

### Dokumentasi per step
Setelah setiap step selesai, buat file `docs/step-XX-nama-step.md` yang berisi:
- Deskripsi singkat step ini
- Daftar file yang dibuat/diubah beserta perannya
- Penjelasan kode penting dalam bahasa sederhana
- Diagram hubungan antar file dalam format **Mermaid**
- Cara memverifikasi bahwa step ini berhasil

### Arsitektur aplikasi
File `docs/architecture.md` dibuat di Step 1 dan **wajib diperbarui di akhir setiap step**. File ini bukan catatan sejarah pembangunan, melainkan **peta cara kerja aplikasi saat ini** — diorganisasi berdasarkan alur fitur, bukan urutan step.

Format `docs/architecture.md`:
- Gambaran besar (diagram Mermaid perjalanan user end-to-end)
- Satu section per fitur/alur utama (autentikasi, soal, menulis, AI, dashboard, dll.)
- Setiap section: penjelasan singkat, daftar file yang terlibat dengan penjelasan + analogi sederhana, diagram Mermaid hubungan antar file
- Struktur database (ER diagram Mermaid)
- Struktur folder lengkap
- Ditulis dengan bahasa yang mudah dipahami orang yang tidak berlatar belakang teknis

### Komentar kode
Tambahkan komentar singkat di baris kode yang fungsinya tidak langsung jelas. Semua komentar ditulis dalam **Bahasa Indonesia**.

Semua dokumentasi di folder `docs/` ditulis dalam **Bahasa Indonesia**.

---

## 5. Aturan Error Handling

Setiap fitur yang dibuat harus langsung disertai error handling minimal:

- **Pesan error yang jelas** jika operasi gagal (bukan layar kosong atau error mentah dari server)
- **Loading state** (spinner atau skeleton) jika ada operasi yang membutuhkan waktu
- **Validasi input** di form sebelum data dikirim ke server

> Ingat: Step error handling di akhir BUKAN tempat pertama error handling dibuat — itu adalah pass terakhir untuk memastikan konsistensi di seluruh aplikasi.

---

## 6. Aturan Konfirmasi

Wajib tanya konfirmasi ke user sebelum melakukan hal-hal berikut:

- Menginstall package atau library baru
- Mengubah struktur tabel di database (Prisma schema)
- Menghapus file yang sudah ada
- Push ke GitHub
- Perubahan besar yang mempengaruhi banyak file sekaligus

---

## 7. Aturan Git & GitHub

- File `.env` **tidak boleh pernah** di-push ke GitHub — selalu ada di `.gitignore`
- Folder `references/` **tidak boleh** di-push ke GitHub
- Folder `docs/` **boleh** di-push (dokumentasi membantu kolaborasi)

Titik push ditentukan berdasarkan **kelompok fitur yang sudah bisa berjalan end-to-end** (bukan per step). Sebelum setiap push, wajib tanya konfirmasi ke user terlebih dahulu. Ingatkan user untuk cek `.env` tidak ikut ter-commit dengan `git status`.

---

## 8. Aturan Kode

- Gunakan **TypeScript** untuk semua file
- **Jangan gunakan tipe `any`** — gunakan tipe yang eksplisit atau `unknown`
- **Satu file = satu tanggung jawab** yang jelas
- Gunakan **Zod v4** untuk validasi schema (bukan v3) — gunakan `.issues` bukan `.errors` pada ZodError
- Gunakan **Prisma** untuk semua query database — jangan raw SQL kecuali terpaksa
- Server Actions diutamakan untuk mutasi data (bukan API route terpisah jika bisa dihindari)

---

## 9. Prinsip Coding (Karpathy-Inspired)

**Berpikir Sebelum Coding** — Jangan berasumsi. Sebelum mulai:
- Nyatakan asumsi secara eksplisit. Jika tidak yakin, tanya.
- Jika ada beberapa cara interpretasi, sampaikan semuanya — jangan pilih diam-diam.
- Jika ada pendekatan lebih sederhana, katakan. Boleh memberi saran balik.
- Jika sesuatu tidak jelas, berhenti dan tanya.

**Kesederhanaan Diutamakan** — Kode seminimal mungkin yang menyelesaikan masalah:
- Tidak ada fitur di luar yang diminta.
- Tidak ada abstraksi untuk kode yang hanya dipakai sekali.
- Tidak ada error handling untuk skenario yang tidak mungkin terjadi.
- Tanya: "Apakah senior engineer akan bilang ini terlalu rumit?" Jika iya, sederhanakan.

**Perubahan Bedah** — Sentuh hanya yang diperlukan:
- Jangan perbaiki kode, komentar, atau format di sekitarnya yang tidak diminta.
- Jangan refactor sesuatu yang tidak rusak.
- Ikuti gaya kode yang sudah ada.
- Jika menemukan kode mati yang tidak terkait, sebutkan — jangan hapus sendiri.
- Setiap baris yang diubah harus bisa ditelusuri langsung ke permintaan user.

**Eksekusi Berbasis Tujuan** — Definisikan kriteria sukses sebelum mulai:
- Ubah tugas menjadi tujuan yang bisa diverifikasi. Contoh: "Buat halaman login" → "User bisa login dengan akun valid dan ditolak jika password salah"
- Untuk tugas multi-step, nyatakan rencana singkat dulu sebelum eksekusi.

---

## 10. Tech Stack

| Kategori | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js 15 (App Router) | Full-stack, SSR, mudah deploy ke Vercel |
| Bahasa | TypeScript | Type safety, mencegah bug di produksi |
| Styling | Tailwind CSS + Base UI | Fleksibel, headless, aksesibel |
| Database | PostgreSQL + Prisma ORM | Scalable untuk ribuan user, type-safe |
| Auth | NextAuth.js v5 (Auth.js) | Mendukung email verification, session management |
| Email | Resend | Developer-friendly, reliable untuk verifikasi |
| AI | Claude (Anthropic) + Gemini | Penilaian IELTS yang akurat dan detail |
| Validasi | Zod v4 | Schema validation di client dan server |
| Deployment | Vercel | Terintegrasi dengan Next.js, mudah scaling |

### Catatan Khusus Library

- **Zod v4**: Gunakan `.issues` bukan `.errors` pada `ZodError`
- **Base UI** package name: `@base-ui/react` (bukan `@base-ui-components/react` yang sudah deprecated)
- **Base UI Select**: `onValueChange` bertipe `string | null` — selalu beri null guard
- **Prisma relation filter**: Gunakan `{ question: { is: { type: ... } } }` bukan filter langsung pada relasi
- **Shadow retro flat**: Gunakan `box-shadow: 3px 3px 0px #C9BC9E` — bukan `drop-shadow` standar Tailwind
