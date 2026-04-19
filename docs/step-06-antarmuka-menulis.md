# Step 06 — Antarmuka Menulis (Mode Latihan & Mode Ujian)

## Deskripsi
Halaman tempat user menulis jawaban IELTS — inti dari sesi latihan. Split layout: soal tampil di kiri/atas, area menulis di kanan/bawah. Mendukung dua mode: latihan (tanpa batas waktu) dan ujian (dengan countdown timer).

---

## File yang Dibuat

| File | Peran |
|---|---|
| `app/(main)/write/[questionId]/page.tsx` | Server Component — ambil soal dari DB, render split layout |
| `components/write/write-form.tsx` | Client Component — textarea, word count, timer, auto-save, konfirmasi |
| `actions/write/submit.ts` | Server Action — buat record Submission di DB, redirect ke review |

---

## Arsitektur URL

```
/write/[questionId]?mode=PRACTICE   ← dari tombol "Mode Latihan" di halaman soal
/write/[questionId]?mode=EXAM       ← dari tombol "Mode Ujian" di halaman soal
```

URL menggunakan `questionId` (bukan `submissionId`) karena field `content` di model `Submission` wajib diisi — submission hanya bisa dibuat setelah user menulis jawaban, bukan saat memilih mode.

---

## Penjelasan Kode Penting

### `components/write/write-form.tsx` — Kenapa `'use client'`?

Komponen ini butuh akses ke browser API:
- `localStorage` — untuk auto-save dan restore draft
- `setTimeout` / `setInterval` — untuk timer countdown  
- `useRef` — untuk mengakses DOM element langsung (form, input tersembunyi)
- State React yang berubah setiap detik — tidak bisa dijalankan di server

### Auto-save ke localStorage

```typescript
// Debounce 2 detik — tunggu user berhenti mengetik sebelum simpan
function handleContentChange(value: string) {
  setContent(value)
  clearTimeout(autoSaveRef.current)
  autoSaveRef.current = setTimeout(() => {
    localStorage.setItem(`jalin-draft-${questionId}`, value)
  }, 2000)
}

// Restore saat pertama load — draft muncul kembali jika browser refresh
useEffect(() => {
  const draft = localStorage.getItem(`jalin-draft-${questionId}`)
  if (draft) setContent(draft)
}, [questionId])
```

Kenapa localStorage? Karena data draft bersifat sementara dan tidak perlu disimpan di database sampai user benar-benar submit. localStorage tidak butuh autentikasi dan langsung tersedia.

### Timer Auto-submit

```typescript
useEffect(() => {
  if (timeLeft <= 0) {
    formRef.current?.requestSubmit() // submit langsung tanpa konfirmasi
    return
  }
  const timer = setTimeout(() => {
    setTimeLeft(prev => prev - 1)
  }, 1000)
  return () => clearTimeout(timer)
}, [timeLeft, mode])
```

Menggunakan `setTimeout` yang direkursi (bukan `setInterval`) agar lebih mudah di-cleanup dan tidak ada memory leak. `requestSubmit()` memicu event `submit` pada form, yang menjalankan `onSubmit` handler (catat durasi) lalu Server Action.

### Kenapa `onSubmit` di form, bukan di tombol?

```typescript
function handleFormSubmit() {
  // Catat durasi tepat saat form disubmit
  durationInputRef.current.value = elapsed.toString()
  localStorage.removeItem(`jalin-draft-${questionId}`)
}

<form onSubmit={handleFormSubmit} action={action}>
```

Durasi harus dicatat TEPAT saat submit — bukan saat tombol diklik (delay dari dialog konfirmasi) atau saat komponen render (bisa stale). `onSubmit` dipanggil terakhir sebelum FormData dikumpulkan dan Server Action dipanggil.

### `actions/write/submit.ts` — Kenapa `redirect()` di luar `try/catch`?

```typescript
let submissionId: string
try {
  const submission = await prisma.submission.create(...)
  submissionId = submission.id
} catch {
  return { error: 'Gagal menyimpan jawaban...' }
}

redirect(`/review/${submissionId}`) // di luar try/catch
```

Di Next.js, `redirect()` bekerja dengan cara melempar error khusus secara internal. Jika berada di dalam `catch`, error redirect akan tertangkap dan redirect tidak terjadi. Solusinya: simpan `submissionId` dulu di dalam try, lalu panggil `redirect()` di luar.

---

## Diagram Alur Data

```
User klik "Mode Latihan/Ujian" di questions/[id]/page.tsx
  ↓ Link ke /write/[questionId]?mode=PRACTICE|EXAM

write/[questionId]/page.tsx (Server Component)
  ├── getQuestion(questionId) → ambil soal dari DB
  ├── isChartData(question.chartData) → validasi JSON
  ├── Render panel soal (kiri/atas) + ChartRenderer
  └── Render <WriteForm> (kanan/bawah) — client component

WriteForm (Client Component)
  ├── localStorage → restore draft
  ├── useEffect timer → countdown (EXAM mode)
  ├── handleContentChange → update state + auto-save debounce
  ├── "Kirim Jawaban" → showConfirm = true
  ├── "Ya, Kirim" (type="submit") → onSubmit → catat durasi → Server Action
  └── Timer habis → formRef.requestSubmit() → onSubmit → Server Action

actions/write/submit.ts (Server Action)
  ├── auth() → cek session
  ├── Zod validate → questionId, content, mode, durationSeconds
  ├── prisma.submission.create() → simpan ke DB
  └── redirect('/review/[submissionId]') → (dibangun di Step 8)
```

---

## Cara Memverifikasi Step Ini Berhasil

1. Login → buka `/questions` → klik soal → klik "Mode Latihan"
2. Halaman write terbuka dengan soal di kiri (grafik untuk Part 1)
3. Ketik beberapa kata → word count berubah real-time
4. Refresh halaman → teks kembali (dari localStorage)
5. Klik "Kirim Jawaban" → panel konfirmasi muncul
6. Klik "Ya, Kirim" → Submission tersimpan di DB → redirect ke `/review/[id]` (404 sampai Step 8)
7. Buka Prisma Studio → tabel `Submission` → record baru tersimpan dengan content, mode, dan durationSeconds

Untuk Mode Ujian:
- Timer tampil di kanan atas, hitung mundur dalam format MM:SS
- Saat < 5 menit tersisa, timer berubah merah dengan ikon ⚠
