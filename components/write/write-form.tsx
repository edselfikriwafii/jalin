'use client'

// Komponen utama halaman menulis — dijalankan di sisi klien karena:
// 1. Textarea state (controlled input)
// 2. Timer countdown (setTimeout)
// 3. Auto-save ke localStorage (debounce)
// 4. Word count real-time

import { useState, useEffect, useRef } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { submitAnswer } from '@/actions/write/submit'

interface WriteFormProps {
  questionId: string
  questionType: 'PART1' | 'PART2'
  mode: 'PRACTICE' | 'EXAM'
}

// Jumlah kata minimum sesuai standar IELTS Academic Writing
const MIN_WORDS = { PART1: 150, PART2: 250 } as const

// Durasi mode ujian dalam detik (PART1: 60 menit, PART2: 40 menit)
const EXAM_DURATION: Record<string, number> = { PART1: 3600, PART2: 2400 }

// Tombol submit — menampilkan loading state saat action sedang berjalan
function ConfirmButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-1.5 bg-primary text-surface text-sm font-medium rounded border border-primary-hover shadow-retro-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? 'Mengirim...' : 'Ya, Kirim'}
    </button>
  )
}

// Format detik ke MM:SS untuk tampilan timer
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function WriteForm({ questionId, questionType, mode }: WriteFormProps) {
  const [content, setContent] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(
    mode === 'EXAM' ? EXAM_DURATION[questionType] : null
  )

  const formRef = useRef<HTMLFormElement>(null)
  const durationInputRef = useRef<HTMLInputElement>(null)
  const startTimeRef = useRef(Date.now())
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const [state, action] = useActionState(submitAnswer, null)

  const wordCount = content.trim() === '' ? 0 : content.trim().split(/\s+/).length
  const minWords = MIN_WORDS[questionType]
  const isUnderMinimum = wordCount > 0 && wordCount < minWords

  // Restore draft dari localStorage saat pertama kali load
  useEffect(() => {
    const draft = localStorage.getItem(`jalin-draft-${questionId}`)
    if (draft) setContent(draft)
  }, [questionId])

  // Timer countdown — hanya aktif di mode ujian
  useEffect(() => {
    if (mode !== 'EXAM' || timeLeft === null) return

    // Waktu habis → auto-submit langsung tanpa konfirmasi
    if (timeLeft <= 0) {
      formRef.current?.requestSubmit()
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null))
    }, 1000)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, mode])

  // Auto-save ke localStorage saat user mengetik (debounce 2 detik)
  function handleContentChange(value: string) {
    setContent(value)
    clearTimeout(autoSaveRef.current)
    autoSaveRef.current = setTimeout(() => {
      localStorage.setItem(`jalin-draft-${questionId}`, value)
    }, 2000)
  }

  // Dipanggil tepat sebelum form disubmit — catat durasi dan bersihkan draft
  function handleFormSubmit() {
    if (durationInputRef.current) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      durationInputRef.current.value = elapsed.toString()
    }
    localStorage.removeItem(`jalin-draft-${questionId}`)
  }

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={handleFormSubmit}
      className="flex-1 flex flex-col overflow-hidden min-h-0"
    >
      {/* Input tersembunyi — dikirim bersama jawaban ke server */}
      <input type="hidden" name="questionId" value={questionId} />
      <input type="hidden" name="mode" value={mode} />
      <input ref={durationInputRef} type="hidden" name="durationSeconds" defaultValue="0" />

      {/* Bar atas: word count + timer */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface shrink-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm tabular-nums ${isUnderMinimum ? 'text-warning font-medium' : 'text-text-secondary'}`}>
            {wordCount} kata
          </span>
          {isUnderMinimum && (
            <span className="text-warning text-xs">
              (min. {minWords} — kurang {minWords - wordCount})
            </span>
          )}
          {wordCount >= minWords && wordCount > 0 && (
            <span className="text-success text-xs">✓ memenuhi minimum</span>
          )}
        </div>

        {/* Timer — hanya tampil di mode ujian */}
        {mode === 'EXAM' && timeLeft !== null && (
          <span className={`font-mono text-sm font-medium tabular-nums ${
            timeLeft < 300 ? 'text-error font-bold' : 'text-text-secondary'
          }`}>
            {timeLeft < 300 ? '⚠ ' : ''}⏱ {formatTime(timeLeft)}
          </span>
        )}
      </div>

      {/* Area menulis — flex-1 mengisi sisa tinggi panel */}
      <textarea
        name="content"
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        placeholder={`Tulis jawaban kamu di sini...\n\nMinimum ${minWords} kata untuk ${questionType === 'PART1' ? 'Part 1' : 'Part 2'}.`}
        className="flex-1 resize-none bg-background p-5 text-text-primary text-sm leading-7 outline-none focus:bg-surface transition-colors font-sans"
      />

      {/* Bar bawah: error + tombol submit */}
      <div className="border-t border-border bg-surface px-4 py-3 flex items-center gap-4 shrink-0">
        {state?.error && (
          <p className="text-error text-sm">{state.error}</p>
        )}

        <div className="ml-auto flex items-center gap-3">
          {!showConfirm ? (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="px-5 py-2 bg-primary text-surface text-sm font-medium rounded border border-primary-hover shadow-retro-primary hover:bg-primary-hover transition-colors"
            >
              Kirim Jawaban
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">Yakin ingin mengirim?</span>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1.5 text-sm border border-border rounded hover:bg-background transition-colors text-text-secondary"
              >
                Batal
              </button>
              <ConfirmButton />
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
