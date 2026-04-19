import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Izinkan gambar dari domain eksternal jika dibutuhkan untuk soal Part 1
  images: {
    remotePatterns: [],
  },
}

export default nextConfig
