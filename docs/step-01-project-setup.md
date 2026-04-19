# Step 01 — Project Setup & Struktur Folder

## Deskripsi
Membuat fondasi proyek Next.js 15 lengkap dengan semua library yang dibutuhkan. Semua step selanjutnya bergantung pada step ini.

---

## File yang Dibuat / Diubah

| File | Peran |
|---|---|
| `package.json` | Daftar semua dependency project |
| `tsconfig.json` | Konfigurasi TypeScript (strict mode aktif) |
| `next.config.ts` | Konfigurasi Next.js |
| `postcss.config.mjs` | Konfigurasi PostCSS untuk Tailwind CSS |
| `tailwind.config.ts` | Token warna, font, dan shadow dari THEME.md |
| `.eslintrc.json` | Aturan ESLint untuk Next.js + TypeScript |
| `app/globals.css` | Directive Tailwind + background color krem |
| `app/layout.tsx` | Layout global dengan font DM Serif Display + DM Sans |
| `app/page.tsx` | Halaman beranda placeholder |
| `docs/architecture.md` | Diagram arsitektur aplikasi (Mermaid) |
| `docs/step-01-project-setup.md` | File ini |

---

## Packages yang Terinstall

### Dependencies (dibutuhkan di production)
| Package | Versi | Kegunaan |
|---|---|---|
| `next` | ^15 | Framework utama |
| `react`, `react-dom` | ^19 | Library UI |
| `next-auth` | ^5.0.0-beta | Autentikasi (Step 3) |
| `@auth/prisma-adapter` | ^2 | Adapter Prisma untuk NextAuth |
| `@prisma/client` | ^6 | ORM untuk query database (Step 2) |
| `resend` | ^4 | Kirim email verifikasi (Step 3) |
| `zod` | ^4 | Validasi schema form dan API |
| `@anthropic-ai/sdk` | ^0.40 | Penilaian AI dengan Claude (Step 7) |
| `@google/generative-ai` | ^0.24 | Penilaian AI dengan Gemini — fallback (Step 7) |
| `@base-ui/react` | ^1.4 | Komponen UI headless (aksesibel) |

### DevDependencies (hanya saat development)
| Package | Kegunaan |
|---|---|
| `prisma` | CLI untuk migrasi schema (Step 2) |
| `typescript` | Bahasa pemrograman |
| `tailwindcss` | Utility CSS |
| `postcss`, `autoprefixer` | Prosesor CSS untuk Tailwind |
| `eslint`, `eslint-config-next` | Linting kode |

---

## Penjelasan Kode Penting

### `tailwind.config.ts` — Token Warna & Shadow
```ts
// Semua warna diambil dari THEME.md
// Nama seperti "primary", "background", "surface" bisa dipakai langsung di className
// Contoh: className="bg-background text-text-primary border border-border"

boxShadow: {
  // Shadow retro flat — kuncinya adalah solid color, bukan blur
  // Bayangkan stempel yang digeser 3px ke kanan-bawah
  retro: '3px 3px 0px #C9BC9E',
}
```

### `app/layout.tsx` — CSS Variables untuk Font
```tsx
// Variable CSS --font-serif dan --font-sans ditetapkan di sini
// lalu Tailwind menggunakannya via konfigurasi fontFamily di tailwind.config.ts
// Sehingga: className="font-serif" → DM Serif Display
//           className="font-sans"  → DM Sans
```

---

## Diagram Hubungan Antar File

```
tailwind.config.ts
    ↓ mendefinisikan token warna & font
app/globals.css (import Tailwind + set background color)
    ↓ diimport oleh
app/layout.tsx (setup font, metadata, wrapper HTML)
    ↓ membungkus
app/page.tsx (konten halaman beranda)
```

---

## Cara Memverifikasi Step Ini Berhasil

1. Jalankan `npm run dev`
2. Buka `http://localhost:3000`
3. Halaman beranda muncul dengan:
   - Background warna krem (`#F5F0E4`) — bukan putih
   - Judul "Jalin" dengan font serif (DM Serif Display)
   - Deskripsi dengan font sans (DM Sans)
   - Dua tombol: "Mulai Latihan" (merah) dan "Masuk" (outline)
   - Tombol punya shadow retro (offset 3px kanan-bawah)
4. Tidak ada error di terminal
