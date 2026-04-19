// Utilitas untuk hashing dan verifikasi password menggunakan bcryptjs
// bcrypt adalah algoritma hashing yang dirancang lambat — secara sengaja!
// Tujuannya: membuat brute-force attack butuh waktu lama bahkan jika database bocor

import bcrypt from 'bcryptjs'

// Angka 12 = "salt rounds" — semakin tinggi, semakin aman tapi semakin lambat
// 12 adalah keseimbangan yang baik antara keamanan dan performa (< 100ms)
const SALT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function comparePassword(
  plaintext: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plaintext, hash)
}
