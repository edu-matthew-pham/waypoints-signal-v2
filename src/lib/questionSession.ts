// src/lib/questionSession.ts
// Loading and answering a question-set session.
//
// Kept out of the component so it can be tested. The component holds the UI
// state; everything about what a session *is* lives here.
//
// WHY A FUNCTION AND NOT A TABLE QUERY. session_questions has no anon policy at
// all — get_session_questions projects `correct` out, and that projection is the
// entire gate. There is no client-side path to the answer key, deliberately.

import { db } from './supabase'

export type QuestionType = 'mc' | 'text' | 'confidence'

export interface QuestionOption {
  label: string
  text: string
}

/** A question as a student receives it. Note the absence of `correct`. */
export interface StudentQuestion {
  idx: number
  type: QuestionType
  stem: string
  options?: QuestionOption[]
  criteria?: string[]
}

/**
 * One thing a student can answer.
 *
 * A confidence question carries several criteria, each needing its own signal,
 * so one question can produce several items. `sub_idx` is the position within
 * the question — 0 for mc and text, which have one answer each.
 */
export interface AnswerSlot {
  questionIdx: number
  subIdx: number
  type: QuestionType
  /** Heading text. Repeated across the criteria of one confidence question. */
  stem: string
  /** For confidence: the criterion. Absent for mc and text. */
  criterion?: string
  options?: QuestionOption[]
  /** True when this is the first slot of its question — the heading renders here. */
  first: boolean
}

export const SIGNALS = [
  { value: 'green', label: 'Got it' },
  { value: 'yellow', label: 'Getting there' },
  { value: 'red', label: 'Not yet' },
] as const

export type Signal = (typeof SIGNALS)[number]['value']

/**
 * Fetch a question set, or null when the code belongs to something else.
 *
 * Null rather than an error: the student page tries this first and falls back to
 * the node-driven check-in, so "no rows" is a routing answer, not a failure.
 */
export async function loadQuestionSet(code: string): Promise<StudentQuestion[] | null> {
  const { data, error } = await db.rpc('get_session_questions', { code })
  if (error) throw error
  if (!data || data.length === 0) return null

  // `options` and `criteria` are jsonb columns, so they arrive typed as Json,
  // and `type` as plain string — the check constraint doesn't carry through to
  // the generated types. Their shape is guaranteed upstream, by parsePayload and
  // by create_question_session, not by anything here. This is the boundary where
  // that guarantee is asserted rather than checked: a malformed question cannot
  // get into the table in the first place.
  return data.map((q) => ({
    idx: q.idx,
    type: q.type as QuestionType,
    stem: q.stem,
    options: (q.options as unknown as QuestionOption[] | null) ?? undefined,
    criteria: (q.criteria as unknown as string[] | null) ?? undefined,
  }))
}

/**
 * Flatten questions into the list a student actually works through.
 *
 * A confidence question with three criteria becomes three slots; everything else
 * becomes one. This is the only place the one-item-to-author,
 * several-items-to-answer distinction is handled.
 */
export function toSlots(questions: StudentQuestion[]): AnswerSlot[] {
  const slots: AnswerSlot[] = []

  for (const q of questions) {
    if (q.type === 'confidence') {
      const criteria = q.criteria ?? []
      // A confidence question with no criteria is rejected at export, but a
      // hand-authored session could still carry one. Emit nothing rather than
      // an unanswerable heading.
      criteria.forEach((criterion, i) => {
        slots.push({
          questionIdx: q.idx,
          subIdx: i,
          type: 'confidence',
          stem: q.stem,
          criterion,
          first: i === 0,
        })
      })
      continue
    }

    slots.push({
      questionIdx: q.idx,
      subIdx: 0,
      type: q.type,
      stem: q.stem,
      options: q.options,
      first: true,
    })
  }

  return slots
}

/** Stable key for an answer slot. */
export function slotKey(slot: Pick<AnswerSlot, 'questionIdx' | 'subIdx'>): string {
  return `${slot.questionIdx}:${slot.subIdx}`
}

/**
 * Anonymous student id, in localStorage.
 *
 * NOT sessionStorage, which is what the confidence check-in uses. That is
 * per-tab, so a student who closes the tab mid-set returns as a new person —
 * double-counted, and their earlier answers orphaned. Invisible in a 30-second
 * check-in; not in a set spread across a lesson.
 *
 * Still anonymous: a random id, no name, nothing linking it to a person. No
 * friendly label either — a label is only useful if someone sees it, and the
 * only someone is the teacher, which is individual tracking in a costume.
 */
export function getOrCreateStudentId(): string {
  const KEY = 'wp_student_id'
  try {
    let id = localStorage.getItem(KEY)
    if (!id) {
      id = 'anon_' + Math.random().toString(36).slice(2, 10)
      localStorage.setItem(KEY, id)
    }
    return id
  } catch {
    // Private browsing with storage disabled. The student can still answer;
    // they just become a new person if they reload.
    return 'anon_' + Math.random().toString(36).slice(2, 10)
  }
}

/** Record one answer. Overwrites any previous answer to the same slot. */
export async function submitAnswer(
  code: string,
  studentId: string,
  slot: Pick<AnswerSlot, 'questionIdx' | 'subIdx'>,
  answer: string,
): Promise<void> {
  const { error } = await db.rpc('submit_answer', {
    code,
    student_id: studentId,
    question_idx: slot.questionIdx,
    sub_idx: slot.subIdx,
    answer,
  })
  if (error) throw error
}