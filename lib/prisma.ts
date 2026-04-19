// Singleton Prisma Client untuk Next.js
//
// Masalah yang diselesaikan:
// Next.js di mode development sering me-reload module karena fitur Hot Reload.
// Tanpa pola ini, setiap reload akan membuat koneksi database baru, hingga
// bisa mencapai batas koneksi PostgreSQL.
//
// Solusinya: simpan instance Prisma di `globalThis` — objek yang TIDAK di-reload
// oleh Hot Reload, sehingga koneksi tetap satu walaupun kode berubah.

// Prisma 6 menggunakan client.ts sebagai entry point utama (bukan index.ts)
import { PrismaClient } from '@prisma/client'

// Tambahkan tipe 'prisma' ke globalThis agar TypeScript tidak complain
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Gunakan instance yang sudah ada (jika ada), atau buat yang baru
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Simpan ke globalThis hanya di development (production selalu buat instance baru per request)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
