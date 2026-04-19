// Pembuat prompt penilaian IELTS Academic Writing
// Menghasilkan system prompt + user message berdasarkan tipe soal

// Kriteria penilaian sesuai tipe soal:
// Part 1 memakai TASK_ACHIEVEMENT (bukan TASK_RESPONSE)
// Part 2 memakai TASK_RESPONSE (bukan TASK_ACHIEVEMENT)
// Keduanya punya COHERENCE_AND_COHESION, LEXICAL_RESOURCE, GRAMMATICAL_RANGE_AND_ACCURACY

export function buildSystemPrompt(questionType: 'PART1' | 'PART2'): string {
  const taskCriterion =
    questionType === 'PART1' ? 'TASK_ACHIEVEMENT' : 'TASK_RESPONSE'

  const taskCriterionDesc =
    questionType === 'PART1'
      ? 'Task Achievement: accuracy in describing the data, identifying key features, and writing an overview'
      : 'Task Response: fully addressing all parts of the task, presenting a clear position, and supporting ideas with relevant examples'

  return `You are an expert IELTS Academic Writing examiner. Assess the student's response according to official IELTS band descriptors.

Return ONLY a valid JSON object — no markdown, no explanation, no code fences.

The JSON must have exactly this structure:
{
  "overallScore": <number 0.0-9.0, rounded to nearest 0.5>,
  "summary": "<2-3 sentence overview of strengths and main improvement areas>",
  "criteria": [
    {
      "criterion": "${taskCriterion}",
      "score": <number 0.0-9.0, rounded to nearest 0.5>,
      "feedback": "<specific feedback for this criterion, 2-4 sentences>"
    },
    {
      "criterion": "COHERENCE_AND_COHESION",
      "score": <number>,
      "feedback": "<specific feedback>"
    },
    {
      "criterion": "LEXICAL_RESOURCE",
      "score": <number>,
      "feedback": "<specific feedback>"
    },
    {
      "criterion": "GRAMMATICAL_RANGE_AND_ACCURACY",
      "score": <number>,
      "feedback": "<specific feedback>"
    }
  ],
  "sentenceFeedback": [
    {
      "original": "<exact sentence from the response that needs improvement>",
      "suggestion": "<improved version of the sentence>",
      "reason": "<brief reason for the change, 1 sentence>",
      "orderIndex": <integer, 0-based position in the text>
    }
  ]
}

Assessment guidelines:
- ${taskCriterionDesc}
- Coherence & Cohesion: logical flow, paragraph organisation, appropriate use of cohesive devices
- Lexical Resource: range of vocabulary, accuracy, spelling
- Grammatical Range & Accuracy: variety of sentence structures, grammatical accuracy, punctuation
- overallScore must equal the average of the four criterion scores, rounded to the nearest 0.5
- sentenceFeedback: provide 3-6 specific sentences that could be improved. Choose sentences that best illustrate different issues. Each must be copied verbatim from the response.
- If the response is very short or mostly irrelevant, assign a score of 3.0 or below for ${taskCriterion}.
- Write all feedback in English.`
}

export function buildUserMessage(
  questionType: 'PART1' | 'PART2',
  questionBody: string,
  answerContent: string
): string {
  const taskLabel = questionType === 'PART1' ? 'Task 1' : 'Task 2'
  return `IELTS Academic Writing ${taskLabel} question:
---
${questionBody}
---

Student's response:
---
${answerContent}
---

Assess this response according to IELTS band descriptors. Return only the JSON object.`
}
