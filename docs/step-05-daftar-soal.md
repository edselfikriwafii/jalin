# Step 05 — Daftar Soal & Pilih Mode

## Deskripsi
Membangun halaman daftar soal yang bisa difilter, halaman detail soal dengan visualisasi grafik (Recharts), dan UI pilihan mode latihan vs ujian. Ini adalah "etalase" aplikasi — tempat user memulai setiap sesi latihan.

---

## File yang Dibuat / Diubah

| File | Peran |
|---|---|
| `components/questions/chart-renderer.tsx` | Client component — render grafik Recharts dari JSON chartData |
| `app/(main)/questions/page.tsx` | Halaman daftar soal dengan filter Part 1/Part 2 |
| `app/(main)/questions/[id]/page.tsx` | Halaman detail soal + pilih mode latihan/ujian |
| `tailwind.config.ts` | Ditambahkan warna `error: '#DC2626'` yang dipakai badge difficulty HARD |

---

## Penjelasan Kode Penting

### `components/questions/chart-renderer.tsx` — Kenapa `'use client'`?

```
Masalah:
  Recharts menggunakan browser DOM API (SVG rendering, event handlers, ResizeObserver).
  Next.js merender Server Components di server — tidak ada DOM di sana.

Solusi:
  Tandai komponen dengan 'use client'.
  Next.js tahu untuk merender komponen ini di browser, bukan di server.
  Server Components lain tetap dirender di server — hanya ChartRenderer yang client-side.
```

### `app/(main)/questions/page.tsx` — Filter Berbasis URL (bukan State)

```typescript
// Membaca filter dari URL: /questions?type=PART1
const typeFilter = params.type === 'PART1' || params.type === 'PART2'
  ? params.type
  : undefined
```

Filter disimpan di URL (bukan di state React) karena:
- **URL bisa dibookmark** — user bisa menyimpan "/questions?type=PART1" dan membukanya langsung
- **Bisa di-share** — kirim link ke teman, filter tetap sama
- **Kompatibel SSR** — server langsung merender halaman dengan filter yang benar, tanpa loading tambahan
- Tab yang aktif di-highlight berdasarkan URL, bukan state — konsisten di antara page reload

### `app/(main)/questions/[id]/page.tsx` — `generateMetadata` Dinamis

```typescript
export async function generateMetadata({ params }) {
  const question = await getQuestion(id)
  return { title: `${question.topic} — Jalin` }
}
```

Fungsi `generateMetadata` adalah cara Next.js 15 untuk mengatur `<title>` halaman secara dinamis berdasarkan data dari database. Tab browser akan menampilkan topik soal yang sedang dibuka (mis. "Bar Chart — Internet Users by Region — Jalin"), bukan judul generik.

### Mode Selection — URL ke Write Page

```typescript
// Mode Latihan
href={`/write/${id}?mode=PRACTICE`}

// Mode Ujian  
href={`/write/${id}?mode=EXAM`}
```

Route write page menggunakan `[questionId]` (bukan `[submissionId]`) karena field `content` di model `Submission` wajib diisi (non-nullable). Submission baru dibuat saat user submit jawaban di Step 6 — bukan saat memilih mode.

---

## Diagram Hubungan

```
app/(main)/questions/page.tsx
  └── lib/questions.ts → getQuestions(filters)
        └── Database: tabel Question
  └── [klik soal] → questions/[id]/page.tsx
        ├── lib/questions.ts → getQuestion(id)
        ├── lib/types/chart.ts → isChartData()
        └── components/questions/chart-renderer.tsx  ← 'use client'
              └── recharts: BarChart | LineChart | PieChart | table HTML
        └── [klik mode] → /write/[questionId]?mode=PRACTICE|EXAM
              (dibangun di Step 6)
```

---

## Cara Memverifikasi Step Ini Berhasil

1. Jalankan `npm run dev`
2. Register/login ke akun → buka `localhost:3000/questions`

**Yang harus terlihat:**
- 10 soal tampil dalam daftar
- Filter "Part 1" menampilkan 5 soal, "Part 2" menampilkan 5 soal
- Setiap kartu menampilkan badge tipe (teal = Part 1, merah = Part 2) dan badge kesulitan
- Klik soal Part 1 → grafik Recharts muncul di halaman detail
- Klik soal Part 2 → tidak ada grafik, hanya teks soal
- Dua tombol mode (Latihan + Ujian) muncul di bawah
- Klik tombol mode → redirect ke `/write/[id]?mode=...` (halaman belum ada di Step 5, akan 404 sampai Step 6)
