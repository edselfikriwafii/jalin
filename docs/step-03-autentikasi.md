# Step 03 — Autentikasi (Register, Verifikasi Email, Login)

## Deskripsi
Sistem autentikasi lengkap: user bisa mendaftar, menerima email verifikasi, lalu login. Akun yang belum diverifikasi tidak bisa login. Halaman yang butuh login otomatis terlindungi oleh middleware.

---

## File yang Dibuat

| File | Peran |
|---|---|
| `auth.config.ts` | Konfigurasi NextAuth yang aman untuk Edge Runtime (tanpa Prisma) |
| `auth.ts` | Konfigurasi NextAuth lengkap: credentials provider + Prisma + bcrypt |
| `middleware.ts` | Proteksi route otomatis — berjalan di Edge sebelum halaman dirender |
| `app/api/auth/[...nextauth]/route.ts` | Handler API untuk semua endpoint NextAuth (/api/auth/*) |
| `lib/password.ts` | Fungsi hashPassword dan comparePassword menggunakan bcryptjs |
| `lib/email/send-verification.ts` | Kirim email verifikasi via Resend (fallback ke console di dev) |
| `actions/auth/register.ts` | Server Action: validasi → simpan user → kirim email verifikasi |
| `actions/auth/login.ts` | Server Action: panggil NextAuth signIn → redirect ke dashboard |
| `actions/auth/verify-email.ts` | Server Action: validasi token → aktifkan akun → hapus token |
| `app/(auth)/layout.tsx` | Layout card terpusat untuk halaman register/login/verify-email |
| `app/(auth)/register/page.tsx` | Halaman daftar akun |
| `app/(auth)/register/_components/register-form.tsx` | Form register (client component) |
| `app/(auth)/login/page.tsx` | Halaman login |
| `app/(auth)/login/_components/login-form.tsx` | Form login (client component) |
| `app/(auth)/verify-email/page.tsx` | Halaman verifikasi email (auto-verifikasi saat dibuka) |
| `app/(main)/layout.tsx` | Layout utama: navbar dengan link soal & tombol logout |
| `app/(main)/dashboard/page.tsx` | Dashboard placeholder (statistik lengkap di Step 9) |

---

## Penjelasan Kode Penting

### Kenapa ada dua file auth? (`auth.config.ts` dan `auth.ts`)

```
Masalah:
  Next.js middleware berjalan di "Edge Runtime" — lingkungan yang sangat ringan
  Edge Runtime TIDAK bisa menggunakan Node.js APIs (file system, native modules)
  Prisma Client dan bcryptjs keduanya menggunakan Node.js APIs

Solusi (pola resmi NextAuth v5):
  auth.config.ts  → hanya logika yang aman untuk Edge (tidak ada Prisma/bcrypt)
                    diimport oleh middleware.ts
  auth.ts         → logika lengkap dengan Prisma & bcrypt
                    diimport oleh Server Components dan Server Actions

Analogi:
  auth.config.ts = aturan satpam yang bisa ditulis di papan pengumuman (publik, sederhana)
  auth.ts         = sistem keamanan lengkap di ruang server (butuh akses khusus)
```

### Alur Registrasi

```
User isi form → register-form.tsx (client)
    ↓ useActionState memanggil Server Action
actions/auth/register.ts
    ↓ validasi Zod
    ↓ cek email belum terdaftar
    ↓ hashPassword(password) → simpan ke DB
    ↓ buat VerificationToken (expired 24 jam)
    ↓ sendVerificationEmail(name, email, token)
    ↓ return { success: "..." }
register-form.tsx menampilkan pesan sukses
```

### Alur Verifikasi Email

```
User klik link di email → /verify-email?token=xxxxx
    ↓ Next.js render verify-email/page.tsx (Server Component)
    ↓ panggil verifyEmail(token) (Server Action)
        ↓ cari token di DB
        ↓ cek tidak expired
        ↓ update user.emailVerified = new Date()
        ↓ hapus token (tidak bisa dipakai ulang)
    ↓ redirect ke /login?verified=true
login/page.tsx menampilkan pesan "Email berhasil diverifikasi!"
```

### Alur Login

```
User isi form → login-form.tsx (client)
    ↓ useActionState memanggil loginUser (Server Action)
actions/auth/login.ts
    ↓ panggil NextAuth signIn('credentials', {...})
        auth.ts authorize():
            ↓ validasi Zod
            ↓ cari user di DB
            ↓ cek emailVerified != null
            ↓ comparePassword(password, passwordHash)
            ↓ return user data
        ↓ NextAuth buat JWT token
        ↓ throw NEXT_REDIRECT ke /dashboard
```

---

## Diagram Hubungan Antar File

```
middleware.ts
    ← auth.config.ts (Edge-safe, redirect logic)

auth.ts
    ← auth.config.ts (base config)
    ← lib/prisma.ts (database queries)
    ← lib/password.ts (bcrypt)

actions/auth/register.ts
    ← lib/prisma.ts
    ← lib/password.ts
    ← lib/email/send-verification.ts

actions/auth/login.ts
    ← auth.ts (signIn)

actions/auth/verify-email.ts
    ← lib/prisma.ts

app/(auth)/register/_components/register-form.tsx
    ← actions/auth/register.ts

app/(auth)/login/_components/login-form.tsx
    ← actions/auth/login.ts

app/(main)/layout.tsx
    ← auth.ts (auth, signOut)
```

---

## Cara Memverifikasi Step Ini Berhasil

### Setup yang diperlukan:
Jika ingin email verifikasi benar-benar terkirim, isi `RESEND_API_KEY` di `.env`.
Tanpa itu, link verifikasi akan muncul di terminal saat menjalankan `npm run dev`.

### Langkah pengujian:

1. **Test Registrasi:**
   - Buka `http://localhost:3000/register`
   - Isi form dengan email baru → Submit
   - Lihat terminal: link verifikasi muncul di console

2. **Test Verifikasi Email:**
   - Salin link dari console → buka di browser
   - Halaman berubah → redirect ke `/login?verified=true`

3. **Test Login:**
   - Login dengan email & password yang baru didaftar
   - Redirect ke `/dashboard` → terlihat sambutan

4. **Test Proteksi Route:**
   - Buka `http://localhost:3000/dashboard` tanpa login → redirect ke `/login`
   - Setelah login, coba buka `/register` → redirect ke `/dashboard`

5. **Test Logout:**
   - Di navbar, klik tombol "Keluar"
   - Redirect ke `/login`
