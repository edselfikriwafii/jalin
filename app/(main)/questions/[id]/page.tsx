// Halaman ini tidak lagi digunakan dalam alur utama sejak perubahan flow:
// Mode dipilih dulu → pilih soal → (practice: langsung write) / (exam: rules page)
// Redirect ke /questions agar tidak ada halaman buntu

import { redirect } from 'next/navigation'

export default function QuestionDetailPage() {
  redirect('/questions')
}
