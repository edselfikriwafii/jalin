'use server'

// Server Action untuk menyimpan jawaban dan membuat record Submission di database
// Dipanggil dari WriteForm saat user submit jawaban (baik via tombol maupun auto-submit timer)

import { redirect } from 'next/navigation'
import { z } from 'zod/v4'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { generateReview } from '@/actions/review/generate'

const SubmitSchema = z.object({
  questionId: z.string().min(1),
  content: z.string().min(1, 'Jawaban tidak boleh kosong.'),
  mode: z.enum(['PRACTICE', 'EXAM']),
  durationSeconds: z.coerce.number().int().nonnegative().optional(),
})

type SubmitState = { error: string } | null

export async function submitAnswer(
  _prevState: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: 'Sesi tidak valid, silakan login ulang.' }
  }

  const parsed = SubmitSchema.safeParse({
    questionId: formData.get('questionId'),
    content: formData.get('content'),
    mode: formData.get('mode'),
    durationSeconds: formData.get('durationSeconds') || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { questionId, content, mode, durationSeconds } = parsed.data

  // Simpan jawaban ke database — redirect dilakukan di luar try/catch
  // agar error Next.js redirect tidak tertangkap sebagai error biasa
  let submissionId: string
  try {
    const submission = await prisma.submission.create({
      data: {
        userId: session.user.id,
        questionId,
        content,
        mode,
        durationSeconds: durationSeconds ?? null,
      },
      select: { id: true },
    })
    submissionId = submission.id
  } catch {
    return { error: 'Gagal menyimpan jawaban. Periksa koneksi dan coba lagi.' }
  }

  // Panggil AI untuk menilai jawaban — jika gagal, submission tetap tersimpan
  // User tidak perlu tahu jika AI gagal; halaman review akan menampilkan state "sedang dinilai"
  try {
    await generateReview(submissionId)
  } catch (err) {
    console.error('[submitAnswer] generateReview gagal:', err)
    // Lanjutkan ke redirect meskipun AI gagal
  }

  // Redirect ke halaman review — halaman ini dibangun di Step 8
  redirect(`/review/${submissionId}`)
}
