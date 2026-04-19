# Step 04 — Seed Data & Manajemen Soal

## Deskripsi
Mengisi database dengan 10 soal latihan IELTS agar aplikasi tidak kosong saat pertama dijalankan. Script seed bersifat **idempotent** — aman dijalankan berulang kali tanpa membuat data duplikat.

---

## File yang Dibuat / Diubah

| File | Peran |
|---|---|
| `prisma/seed.ts` | Script untuk mengisi tabel `Question` dengan 10 soal latihan |
| `lib/questions.ts` | Fungsi query untuk membaca soal dari database |
| `prisma.config.ts` | Ditambahkan konfigurasi `seed` (migrasi dari package.json ke Prisma 6) |
| `package.json` | Dihapus blok `"prisma"` yang deprecated di Prisma 6 |

---

## Isi Soal yang Di-seed

### Part 1 — Deskripsi Grafik (5 soal)
| ID | Tipe Grafik | Topik | Kesulitan |
|---|---|---|---|
| seed-p1-q1 | Bar Chart | Pengguna Internet per Region (2010–2020) | EASY |
| seed-p1-q2 | Line Chart | Emisi CO₂ per Kapita (1990–2020) | MEDIUM |
| seed-p1-q3 | Pie Chart | Sumber Energi Listrik | EASY |
| seed-p1-q4 | Table | Statistik Pariwisata Internasional 2019 | MEDIUM |
| seed-p1-q5 | Bar Chart | Populasi Urban vs Rural per Benua | HARD |

### Part 2 — Esai Argumentatif (5 soal)
| ID | Tipe Esai | Topik | Kesulitan |
|---|---|---|---|
| seed-p2-q1 | Opinion | Teknologi dan Isolasi Sosial | MEDIUM |
| seed-p2-q2 | Discussion | Work from Home | MEDIUM |
| seed-p2-q3 | Problem-Solution | Kemacetan Lalu Lintas | HARD |
| seed-p2-q4 | Adv-Disadv | Belanja Online | EASY |
| seed-p2-q5 | Direct Question | Pendidikan dan Pekerjaan | HARD |

---

## Penjelasan Kode Penting

### `prisma/seed.ts` — Kenapa Menggunakan `upsert`?

```
Masalah:
  Jika seed dijalankan dua kali, `create` akan gagal karena ID sudah ada di DB.

Solusi:
  `upsert` bekerja seperti "buat kalau belum ada, abaikan kalau sudah ada":
  - `where: { id: 'seed-p1-q1' }` → cek apakah record ini sudah ada
  - `update: {}` → jika sudah ada, jangan ubah apapun
  - `create: { ... }` → jika belum ada, buat record baru

  Dengan ID yang tetap dan tidak berubah, seed bisa dijalankan
  berulang kali tanpa efek samping.
```

### `prisma.config.ts` — Migrasi Konfigurasi Seed dari Prisma 5 ke Prisma 6

Di Prisma 5 dan sebelumnya, konfigurasi seed ditaruh di `package.json`:
```json
"prisma": { "seed": "tsx prisma/seed.ts" }
```

Di Prisma 6, konfigurasi ini dipindahkan ke `prisma.config.ts`:
```typescript
seed: { script: "tsx prisma/seed.ts" }
```

Ini lebih baik karena semua konfigurasi Prisma berada di satu tempat.

### `import 'dotenv/config'` di seed.ts — Kenapa Perlu?

```
Masalah:
  prisma/seed.ts dijalankan sebagai skrip Node.js terpisah oleh Prisma.
  Berbeda dengan Next.js yang otomatis memuat .env, skrip standalone
  tidak punya akses ke .env secara default.
  Akibatnya: DATABASE_URL = undefined → koneksi database gagal.

Solusi:
  `import 'dotenv/config'` di baris pertama memuat .env sebelum
  PrismaClient dibuat — jadi DATABASE_URL sudah tersedia.
```

### `lib/questions.ts` — Kenapa Tidak Ambil `chartData` di Daftar Soal?

```typescript
// Ambil semua soal dengan filter opsional — untuk halaman daftar soal
export async function getQuestions(filters?: QuestionFilters) {
  return prisma.question.findMany({
    select: {
      id: true,
      type: true,
      topic: true,
      difficulty: true,
      // TIDAK mengambil chartData dan body
    },
  })
}
```

`chartData` bisa berisi puluhan titik data JSON, dan `body` bisa berisi ratusan karakter. Di halaman daftar soal, kita hanya perlu judul dan kesulitan — jadi tidak perlu memuat data besar yang tidak dipakai. Data besar hanya dimuat saat user membuka halaman detail soal.

---

## Diagram Hubungan

```
prisma.config.ts
  └── seed.script: "tsx prisma/seed.ts"
        │
        ↓
prisma/seed.ts
  ├── import 'dotenv/config'  → memuat DATABASE_URL dari .env
  └── PrismaClient.question.upsert(...)
        │
        ↓
Database: tabel Question (10 record)
        │
        ↓
lib/questions.ts  ← digunakan oleh halaman daftar soal (Step 5)
  ├── getQuestions(filters?)     → daftar soal (tanpa chartData/body)
  ├── getQuestion(id)            → detail soal lengkap (dengan chartData)
  └── getRandomQuestion(type?)   → soal acak untuk latihan cepat
```

---

## Cara Memverifikasi Step Ini Berhasil

```bash
# Jalankan seed
npx prisma db seed

# Lihat hasilnya di browser
npx prisma studio
```

Jika berhasil:
- Terminal menampilkan: `✅ Seed selesai — 5 soal Part 1 + 5 soal Part 2 tersimpan.`
- Prisma Studio (`localhost:5555`) → tabel `Question` berisi 10 record
- 5 record Part 1 memiliki kolom `chartData` terisi JSON
- 5 record Part 2 memiliki kolom `chartData` bernilai `null`
