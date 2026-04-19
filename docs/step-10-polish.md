# Step 10 — Polish & Error Handling

## Deskripsi

Pass terakhir: menambahkan error boundary, halaman 404, dan loading skeleton di semua halaman utama. Tujuannya agar tidak ada halaman yang membiarkan user melihat layar putih kosong atau error mentah dari server.

---

## Daftar File yang Dibuat

| File | Peran |
|---|---|
| `app/not-found.tsx` | Halaman 404 global — muncul untuk URL yang tidak ada dan saat `notFound()` dipanggil |
| `app/error.tsx` | Error boundary global — menangkap error yang tidak tertangkap di mana pun |
| `app/loading.tsx` | Loading state global — ditampilkan saat navigasi berlangsung |
| `app/(main)/error.tsx` | Error boundary khusus route `(main)` — navbar tetap terlihat saat error |
| `app/(main)/questions/loading.tsx` | Skeleton untuk halaman daftar soal |
| `app/(main)/review/[submissionId]/loading.tsx` | Skeleton untuk halaman hasil review |
| `app/(main)/dashboard/loading.tsx` | Skeleton untuk halaman dashboard |

---

## Penjelasan Konsep Penting

### Dua Level Error Boundary

Next.js App Router mendukung `error.tsx` per-segment. Dengan dua level:

```
app/error.tsx              ← menangkap error di luar layout utama
app/(main)/error.tsx       ← menangkap error di dalam layout utama
```

`app/(main)/error.tsx` lebih berguna karena error tetap ditampilkan di dalam layout dengan navbar — user tidak kehilangan konteks navigasi.

### `'use client'` pada Error Boundary

Error boundary (`error.tsx`) wajib `'use client'` karena:
1. Menggunakan `useEffect` untuk logging
2. Menerima prop `reset` (fungsi) dari React — tidak bisa di-serialize untuk Server Component

### Loading Skeleton vs Spinner

Skeleton (blok abu-abu dengan animasi pulse) lebih baik dari spinner tunggal karena:
- Menunjukkan layout halaman yang akan muncul → mengurangi "layout shift"
- Terasa lebih cepat secara persepsi meskipun waktu loading sama

---

## Cara Verifikasi

1. Buka URL yang tidak ada (mis. `/halaman-yang-tidak-ada`) → lihat halaman 404 yang rapi
2. Navigasi ke `/dashboard`, `/questions`, `/review/[id]` — sekilas terlihat skeleton sebelum data muncul (tergantung kecepatan koneksi)
3. Untuk test error boundary: tambahkan `throw new Error('test')` sementara di salah satu Server Component, refresh → lihat halaman error dengan tombol "Coba Lagi"
