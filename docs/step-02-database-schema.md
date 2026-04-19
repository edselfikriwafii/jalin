# Step 02 — Database Schema (Prisma)

## Deskripsi
Merancang seluruh struktur database aplikasi Jalin. 8 model yang saling terhubung mencakup: autentikasi user, soal latihan, jawaban user, dan hasil penilaian AI secara mendetail.

---

## File yang Dibuat / Diubah

| File | Peran |
|---|---|
| `prisma/schema.prisma` | Definisi lengkap semua tabel database |
| `prisma.config.ts` | Konfigurasi Prisma 6 (dibuat oleh `prisma init`) |
| `lib/prisma.ts` | Singleton Prisma Client — satu koneksi untuk seluruh app |
| `lib/generated/prisma/` | File TypeScript yang di-generate Prisma (jangan diedit manual) |
| `.env` | Variabel environment (DATABASE_URL, tidak boleh di-push) |
| `.env.example` | Template .env untuk kolaborator |

---

## Model Database & Fungsinya

### Model Autentikasi

**`User`** — Inti dari seluruh sistem. Setiap user punya akun dengan email unik. Field `emailVerified` adalah null sampai user klik link verifikasi — ini yang "mengunci" akses ke fitur latihan.

**`Account`** — Disiapkan untuk koneksi OAuth (Google, GitHub) di masa depan. Saat ini tidak digunakan aktif.

**`VerificationToken`** — Token sementara yang dikirim ke email user saat mendaftar. Punya waktu kadaluarsa (`expiresAt`) untuk keamanan.

### Model Konten

**`Question`** — Soal latihan IELTS. Part 1 punya `chartData` (JSON) untuk menyimpan data grafik yang dirender oleh Recharts — AI bisa generate data ini secara langsung. Part 2 tidak punya grafik. Field `body` menyimpan teks soal lengkap.

### Model Latihan

**`Submission`** — Setiap kali user submit jawaban, satu record `Submission` dibuat. Menyimpan teks jawaban, mode (latihan/ujian), dan durasi pengerjaan.

**`Review`** — Hasil penilaian AI untuk satu `Submission`. Menyimpan overall band score (0.0–9.0) dan ringkasan feedback. Selalu punya relasi `@unique` ke `Submission` — satu jawaban, satu review.

**`CriterionScore`** — Nilai per kriteria IELTS. Setiap `Review` punya 4 record `CriterionScore` (satu per kriteria).

**`SentenceFeedback`** — Saran perbaikan per kalimat dari AI. Jumlahnya bervariasi per review tergantung panjang jawaban.

---

## Penjelasan Kode Penting

### `lib/prisma.ts` — Kenapa Perlu Singleton?

```
Masalah:
  Next.js dev mode → edit file → Hot Reload → module di-reload
  Tanpa singleton: setiap reload buat koneksi DB baru
  PostgreSQL punya batas koneksi (biasanya 100)
  → Bisa kehabisan koneksi dalam hitungan menit

Solusi:
  Simpan instance Prisma di `globalThis`
  globalThis TIDAK di-reset saat Hot Reload
  Jadi koneksi tetap satu, tidak bertambah
```

### Enum `Criterion` — Kenapa Ada `TASK_ACHIEVEMENT` dan `TASK_RESPONSE`?

IELTS Writing punya 4 kriteria, tapi nama kriteria pertama berbeda:
- Part 1 (grafik): **Task Achievement** — menilai apakah semua data kunci disebutkan
- Part 2 (esai): **Task Response** — menilai apakah pertanyaan dijawab dengan lengkap

3 kriteria lainnya sama untuk kedua Part:
- Coherence & Cohesion
- Lexical Resource
- Grammatical Range & Accuracy

### `@db.Text` — Kenapa Dipakai di Beberapa Field?

PostgreSQL punya dua tipe untuk teks:
- `varchar(191)` — default Prisma, maksimal 191 karakter
- `text` — tidak ada batasan panjang

Field seperti `content` (jawaban esai), `body` (soal lengkap), `feedback` (penjelasan AI) perlu `@db.Text` karena bisa sangat panjang.

---

## Diagram Hubungan Antar Model

```
User
 ├── Account (untuk OAuth)
 ├── VerificationToken (untuk verifikasi email)
 └── Submission (satu user bisa punya banyak submission)
         │
         ├── Question (soal yang dikerjakan)
         └── Review (hasil penilaian AI)
                  ├── CriterionScore x4 (nilai per kriteria)
                  └── SentenceFeedback xN (saran per kalimat)
```

---

## Cara Memverifikasi Step Ini Berhasil

### Prasyarat: Setup Database

Sebelum bisa menjalankan `prisma db push`, kamu perlu database PostgreSQL aktif. Pilih salah satu:

**Opsi A — Lokal (PostgreSQL.app untuk Mac):**
1. Download PostgreSQL.app dari [postgresapp.com](https://postgresapp.com)
2. Buka app → klik Start
3. Buat database baru: `createdb jalin`
4. Edit `.env`: `DATABASE_URL="postgresql://postgres@localhost:5432/jalin?schema=public"`

**Opsi B — Cloud gratis (Supabase):**
1. Buka [supabase.com](https://supabase.com) → buat project baru
2. Settings → Database → Connection String
3. Salin connection string ke `.env`

**Opsi C — Cloud gratis (Railway):**
1. Buka [railway.app](https://railway.app) → New Project → PostgreSQL
2. Variables → DATABASE_URL
3. Salin ke `.env`

### Setelah Database Siap:

```bash
# 1. Buat semua tabel di database
npx prisma db push

# 2. Lihat hasilnya di browser (GUI database)
npx prisma studio
```

Jika berhasil:
- `npx prisma db push` menampilkan "Your database is now in sync with your Prisma schema"
- `npx prisma studio` membuka browser di `localhost:5555` dengan 8 tabel kosong:
  User, Account, VerificationToken, Question, Submission, Review, CriterionScore, SentenceFeedback
