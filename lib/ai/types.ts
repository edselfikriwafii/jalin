// Tipe data untuk hasil penilaian AI
// Digunakan oleh assess.ts (parser) dan generate.ts (penyimpan ke DB)

// Satu kriteria penilaian IELTS beserta skor dan penjelasannya
export interface CriterionResult {
  criterion:
    | 'TASK_ACHIEVEMENT'
    | 'TASK_RESPONSE'
    | 'COHERENCE_AND_COHESION'
    | 'LEXICAL_RESOURCE'
    | 'GRAMMATICAL_RANGE_AND_ACCURACY'
  score: number // 0.0 – 9.0, step 0.5
  feedback: string // penjelasan kelebihan & kekurangan spesifik
}

// Satu kalimat yang disarankan untuk diperbaiki
export interface SentenceFeedbackItem {
  original: string // kalimat asli dari jawaban user
  suggestion: string // kalimat revisi yang disarankan
  reason: string // alasan singkat mengapa perlu diubah
  orderIndex: number // urutan kemunculan dalam teks (0-based)
}

// Hasil lengkap penilaian satu jawaban
export interface AssessmentResult {
  overallScore: number // rata-rata band score: 0.0 – 9.0
  summary: string // ringkasan kekuatan utama dan area perbaikan
  criteria: CriterionResult[]
  sentenceFeedback: SentenceFeedbackItem[]
}
