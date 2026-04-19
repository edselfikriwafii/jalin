# Step 8 — Halaman Hasil Review

## Deskripsi

Menampilkan hasil penilaian AI dari tiga tabel yang dibuat di Step 7 (`Review`, `CriterionScore`, `SentenceFeedback`). Halaman ini adalah tujuan akhir setelah user submit jawaban — menampilkan band score, ringkasan, skor per kriteria, dan saran perbaikan kalimat.

---

## Daftar File yang Dibuat

| File | Status | Peran |
|---|---|---|
| `app/(main)/review/[submissionId]/page.tsx` | Dibuat | Server Component utama — ambil data dari DB, render layout |
| `components/review/criterion-card.tsx` | Dibuat | Kartu satu kriteria: nama, skor badge, penjelasan AI |
| `components/review/sentence-feedback.tsx` | Dibuat | Daftar saran perbaikan kalimat diurutkan berdasarkan posisi |

---

## Penjelasan Kode Penting

### Urutan Kriteria

```typescript
const CRITERION_ORDER: Criterion[] = [
  'TASK_ACHIEVEMENT',
  'TASK_RESPONSE',
  'COHERENCE_AND_COHESION',
  'LEXICAL_RESOURCE',
  'GRAMMATICAL_RANGE_AND_ACCURACY',
]
```

TASK_ACHIEVEMENT dan TASK_RESPONSE tidak pernah muncul bersamaan (Part 1 hanya TA, Part 2 hanya TR), tapi keduanya didefinisikan dalam urutan agar task criterion selalu di posisi pertama. Filter dilakukan saat render.

### Penanganan Review Null

Jika AI gagal di Step 7, `submission.review` akan `null`. Halaman tetap dapat diakses — menampilkan pesan "Penilaian belum tersedia" tanpa crash. Jawaban user dan soal tetap ditampilkan.

### Format Skor

```typescript
score % 1 === 0 ? `${score}.0` : score
```

IELTS band score menggunakan increment 0.5 (misal: 6.0, 6.5, 7.0). Angka bulat perlu suffix `.0` agar tampak konsisten dengan format IELTS resmi.

### Keamanan

```typescript
if (!submission || submission.userId !== session?.user?.id) notFound()
```

User hanya bisa melihat review miliknya sendiri. Jika ID submission valid tapi bukan milik user yang login, halaman mengembalikan 404 (bukan 403) untuk tidak mengkonfirmasi keberadaan submission.

---

## Diagram Hubungan Antar File

```
app/(main)/review/[submissionId]/page.tsx
    │
    ├─ prisma.submission.findUnique()
    │      ├─ question { type, topic, body }
    │      └─ review
    │             ├─ overallScore, summary
    │             ├─ criterionScores[]  ──→ CriterionCard (per kriteria)
    │             └─ sentenceFeedback[] ──→ SentenceFeedback (daftar)
    │
    ├─ components/review/criterion-card.tsx
    └─ components/review/sentence-feedback.tsx
```

---

## Cara Verifikasi Step Ini Berhasil

1. Login → pilih soal → tulis jawaban (min. 50 kata) → submit
2. Setelah redirect ke `/review/[submissionId]`:
   - Overall band score muncul besar di tengah (angka antara 0–9)
   - 4 kartu skor per kriteria muncul
   - Setidaknya 3 item saran perbaikan kalimat muncul
   - Jawaban user dan soal asli terlihat di bawah
3. Coba akses URL review user lain → harus mendapat 404
4. Coba akses review yang AI-nya gagal → harus tampil pesan "Penilaian belum tersedia" bukan error crash
