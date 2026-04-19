import type { Metadata } from 'next'
import { RegisterForm } from './_components/register-form'

export const metadata: Metadata = {
  title: 'Daftar Akun — Jalin',
}

// Halaman register adalah Server Component — hanya merender form client component
export default function RegisterPage() {
  return <RegisterForm />
}
