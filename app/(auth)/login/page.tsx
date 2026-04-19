import type { Metadata } from 'next'
import { LoginForm } from './_components/login-form'

export const metadata: Metadata = {
  title: 'Masuk — Jalin',
}

// searchParams adalah Promise di Next.js 15
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string }>
}) {
  const { verified } = await searchParams

  return <LoginForm verified={verified === 'true'} />
}
