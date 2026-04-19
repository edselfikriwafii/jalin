// Route handler untuk NextAuth v5
// Semua request ke /api/auth/* (login, logout, session) ditangani di sini
import { handlers } from '@/auth'

export const { GET, POST } = handlers
