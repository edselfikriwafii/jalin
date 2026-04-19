# Step 7 — Integrasi AI & Engine Penilaian

## Deskripsi

Mengintegrasikan AI untuk menilai jawaban IELTS Academic Writing secara otomatis. Claude (Anthropic) digunakan sebagai model utama karena kualitas analisisnya; jika Claude gagal (API error, quota habis), sistem otomatis mencoba Gemini (Google) sebagai fallback. Hasil penilaian disimpan ke tiga tabel di database.

---

## Daftar File yang Dibuat/Diubah

| File | Status | Peran |
|---|---|---|
| `lib/ai/types.ts` | Dibuat | Definisi TypeScript interface untuk hasil penilaian AI |
| `lib/ai/prompts.ts` | Dibuat | Builder untuk system prompt dan user message yang dikirim ke AI |
| `lib/ai/assess.ts` | Dibuat | Fungsi utama penilaian: Claude → Gemini fallback → validasi JSON |
| `actions/review/generate.ts` | Dibuat | Server Action: ambil submission, panggil AI, simpan ke DB |
| `actions/write/submit.ts` | Diubah | Ditambahkan panggilan `generateReview()` sebelum redirect |

---

## Penjelasan Kode Penting

### `lib/ai/types.ts` — Interface Hasil Penilaian

```typescript
interface AssessmentResult {
  overallScore: number        // Band score keseluruhan (0.0–9.0)
  summary: string             // Ringkasan 2–3 kalimat
  criteria: CriterionResult[] // 4 kriteria IELTS
  sentenceFeedback: SentenceFeedbackItem[] // 3–6 kalimat yang perlu diperbaiki
}
```

Interface ini menjadi "kontrak" antara AI output dan DB schema — Zod memvalidasi bahwa JSON dari AI sesuai struktur ini sebelum disimpan.

### `lib/ai/prompts.ts` — Kenapa Perlu Dua Fungsi?

- `buildSystemPrompt(questionType)` — instruksi untuk AI tentang cara menilai, format JSON yang diharapkan, dan kriteria mana yang digunakan. Part 1 memakai `TASK_ACHIEVEMENT`; Part 2 memakai `TASK_RESPONSE`.
- `buildUserMessage(questionType, body, content)` — pesan yang berisi soal asli + jawaban user. Dipisah dari system prompt agar bisa digunakan untuk kedua provider AI (Claude dan Gemini).

### `lib/ai/assess.ts` — Urutan Fallback

```
Claude (primary)
   ↓ gagal (network error / quota / parse error)
Gemini (fallback)
   ↓ gagal
throw Error → ditangkap oleh submit.ts
```

Fungsi `extractJson()` penting karena AI kadang mengembalikan JSON yang dibungkus markdown code fence (`` ```json ... ``` ``). Fungsi ini membersihkan pembungkus tersebut sebelum `JSON.parse`.

Zod digunakan setelah parse untuk memverifikasi bahwa struktur JSON benar-benar valid — bukan sekadar valid JSON, tapi punya field yang tepat dengan tipe yang benar.

### `actions/review/generate.ts` — Transaksi Database

```typescript
await prisma.$transaction([
  prisma.review.create({
    data: {
      // nested create: Review + CriterionScore (x4) + SentenceFeedback (xN)
      // semuanya dibuat dalam satu transaksi
    }
  })
])
```

Transaksi memastikan atomisitas: jika salah satu insert gagal (misalnya validasi DB), semua insert dibatalkan. Tidak ada kondisi di mana Review tersimpan tapi CriterionScore-nya tidak.

### `actions/write/submit.ts` — AI Failure Tidak Memblok Submit

```typescript
try {
  await generateReview(submissionId)
} catch (err) {
  console.error('[submitAnswer] generateReview gagal:', err)
  // Tetap lanjut ke redirect — submission sudah tersimpan
}
redirect(`/review/${submissionId}`)
```

Desain ini disengaja: submission user selalu tersimpan terlebih dahulu, lalu AI dipanggil. Jika AI gagal, user tetap diredirect ke halaman review (yang akan menampilkan state "penilaian belum tersedia"). Ini lebih baik daripada membiarkan user mengira jawaban mereka hilang.

---

## Diagram Hubungan Antar File

```
actions/write/submit.ts
    │
    ├─ prisma.submission.create() ─────→ [DB: Submission]
    │
    └─ generateReview(submissionId)
           │
           └─ actions/review/generate.ts
                  │
                  ├─ prisma.submission.findUnique() ───→ [DB: Submission + Question]
                  │
                  └─ assess(type, body, content)
                         │
                         └─ lib/ai/assess.ts
                                │
                                ├─ assessWithClaude()
                                │      │
                                │      └─ buildSystemPrompt() + buildUserMessage()
                                │             └─ lib/ai/prompts.ts
                                │
                                └─ assessWithGemini() [fallback]
                                       │
                                       └─ buildSystemPrompt() + buildUserMessage()

                  └─ prisma.$transaction() ──────────→ [DB: Review + CriterionScore + SentenceFeedback]
```

---

## Cara Verifikasi Step Ini Berhasil

1. Isi `ANTHROPIC_API_KEY` atau `GOOGLE_API_KEY` di file `.env`
2. Login → pilih soal → tulis jawaban (min. 50 kata) → submit
3. Setelah redirect ke `/review/[id]`, buka Prisma Studio: `npx prisma studio`
4. Cek tabel `Review` → ada 1 record baru dengan `overallScore` yang valid
5. Cek tabel `CriterionScore` → ada 4 record terkait (satu per kriteria IELTS)
6. Cek tabel `SentenceFeedback` → ada 3–6 record terkait

Jika kedua API key kosong, lihat log di terminal dev server — akan ada pesan `[submitAnswer] generateReview gagal: ...` tapi submission tetap tersimpan.
