# Step 9 — Dashboard & Progress Analytics

## Deskripsi

Halaman utama setelah login yang menampilkan perkembangan skill user dari waktu ke waktu. Data diambil dalam satu Prisma query besar lalu dihitung di memori — lebih efisien daripada beberapa query terpisah.

---

## Daftar File yang Dibuat/Diubah

| File | Status | Peran |
|---|---|---|
| `lib/analytics.ts` | Dibuat | Satu fungsi `getDashboardStats(userId)` yang mengembalikan semua data dashboard |
| `components/dashboard/score-trend.tsx` | Dibuat | Client component Recharts — grafik tren band score |
| `app/(main)/dashboard/page.tsx` | Diubah | Ganti placeholder dengan tampilan statistik nyata |

---

## Penjelasan Kode Penting

### `lib/analytics.ts` — Satu Query, Banyak Statistik

```typescript
const submissions = await prisma.submission.findMany({
  where: { userId },
  select: {
    review: {
      select: {
        overallScore: true,
        criterionScores: { select: { criterion: true, score: true } },
      },
    },
  },
  orderBy: { createdAt: 'asc' },
})
```

Dari satu array `submissions`, semua statistik (total, rata-rata, minggu ini, per-kriteria, tren) dihitung di JavaScript — bukan query DB terpisah. Ini menghindari N+1 queries.

### Rata-rata per Kriteria

```typescript
const criterionMap = new Map<Criterion, number[]>()
for (const s of withReview) {
  for (const cs of s.review!.criterionScores) {
    criterionMap.get(cs.criterion)!.push(cs.score)
  }
}
```

Semua skor dikumpulkan per kriteria, lalu dirata-rata. Hasilnya diurutkan dari skor terendah ke tertinggi — sehingga `criterionAverages[0]` selalu adalah area terlemah.

### `components/dashboard/score-trend.tsx` — Garis Referensi

Chart menampilkan dua garis referensi: band 6 (target awal) dan band 7 (target lanjutan IELTS). Ini membantu user mengukur posisi mereka tanpa perlu mengerti skala 0–9.

---

## Diagram Hubungan Antar File

```
app/(main)/dashboard/page.tsx
    │
    ├─ getDashboardStats(userId)
    │      └─ lib/analytics.ts
    │             └─ prisma.submission.findMany() ──→ [DB: Submission + Review + CriterionScore]
    │
    └─ ScoreTrend (data={scoreTrend})
           └─ components/dashboard/score-trend.tsx  (Recharts client component)
```

---

## Cara Verifikasi Step Ini Berhasil

1. Login → buka `/dashboard`
2. Jika belum ada latihan → tampil state kosong dengan CTA "Lihat Daftar Soal"
3. Setelah minimal 1 submission dengan review:
   - Kartu "Total Latihan" menampilkan angka nyata (bukan —)
   - Kartu "Rata-rata Band Score" menampilkan skor dengan warna yang sesuai
4. Setelah minimal 2 submission dengan review → grafik tren muncul
5. Klik item di "Latihan Terbaru" → menuju halaman review yang sesuai
