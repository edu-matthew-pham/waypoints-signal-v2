// src/lib/aggregate.ts
// Reading and shaping response aggregates.
//
// One source for both consumers: the compact embed on a slide, and the wide
// results view in the dashboard. They differ in size and chrome, not in what
// they compute.
//
// NEVER READS `correct`. The embed highlights from the ?k= parameter Prepare
// puts in the URL; the database projects the answer key out of every anonymous
// path. A component that fetched the right answer would reopen the leak the
// two-projection design closes.

import { db } from './supabase'

export type QuestionType = 'mc' | 'text' | 'confidence'

/** One row as get_session_aggregate returns it. */
export interface AggregateRow {
  questionIdx: number
  subIdx: number
  type: QuestionType
  responses: number
  /** answer value → count. Empty for text questions, by design. */
  counts: Record<string, number>
}

/** A single bar in a rendered distribution. */
export interface Bar {
  /** The stored answer value — an option label, or a traffic-light value. */
  value: string
  label: string
  count: number
  pct: number
  /** Only ever set from the URL's ?k=, never from the database. */
  correct: boolean
}

export const SIGNAL_LABELS: Record<string, string> = {
  green: 'Got it',
  yellow: 'Getting there',
  red: 'Not yet',
}

export const SIGNAL_ORDER = ['green', 'yellow', 'red'] as const

/** Percentage of a total, rounded. Zero total reads as zero, not NaN. */
export function pct(n: number, total: number): number {
  return total === 0 ? 0 : Math.round((n / total) * 100)
}

/**
 * Colour for a confidence summary figure.
 *
 * Confidence semantics only — green ≥70 is good, red ≥40 is a problem. Does NOT
 * transfer to multiple choice, whose axis is correct/incorrect per option rather
 * than a three-point scale.
 */
export function pctColor(greenPct: number, redPct: number): string {
  if (greenPct >= 70) return 'text-green'
  if (redPct >= 40) return 'text-red'
  return 'text-yellow'
}

export async function loadAggregate(
  code: string,
  questionIdx?: number,
): Promise<AggregateRow[]> {
  const { data, error } = await db.rpc('get_session_aggregate', {
    code,
    ...(questionIdx === undefined ? {} : { idx: questionIdx }),
  })
  if (error) throw error

  return (data ?? []).map((r) => ({
    questionIdx: r.question_idx,
    subIdx: r.sub_idx,
    type: r.type as QuestionType,
    responses: Number(r.responses),
    counts: (r.counts as unknown as Record<string, number> | null) ?? {},
  }))
}

/**
 * Bars for a multiple-choice question.
 *
 * Driven by the authored options, not by the answers, so an option nobody chose
 * still renders as an empty bar. A distribution missing its unchosen options is
 * a different distribution.
 */
export function mcBars(
  row: AggregateRow,
  options: { label: string; text: string }[],
  correctLabel?: string,
): Bar[] {
  return options.map((o) => {
    const count = row.counts[o.label] ?? 0
    return {
      value: o.label,
      label: o.text,
      count,
      pct: pct(count, row.responses),
      correct: correctLabel !== undefined && o.label === correctLabel,
    }
  })
}

/**
 * Bars for one confidence criterion.
 *
 * Always three, in fixed order, whether or not anyone picked them — the shape of
 * a traffic light is the information, and a missing colour would read as a
 * different question rather than as nobody choosing it.
 */
export function confidenceBars(row: AggregateRow): Bar[] {
  return SIGNAL_ORDER.map((value) => {
    const count = row.counts[value] ?? 0
    return {
      value,
      label: SIGNAL_LABELS[value],
      count,
      pct: pct(count, row.responses),
      correct: false,
    }
  })
}

/** Rows belonging to one question, in criterion order. */
export function rowsForQuestion(rows: AggregateRow[], questionIdx: number): AggregateRow[] {
  return rows
    .filter((r) => r.questionIdx === questionIdx)
    .sort((a, b) => a.subIdx - b.subIdx)
}

/**
 * How many students have answered anything in this question.
 *
 * For confidence, each criterion carries its own count and they can differ — a
 * student may have signalled two of three. The question-level figure is the
 * highest, which is the number who have engaged with it at all.
 */
export function questionResponses(rows: AggregateRow[]): number {
  return rows.reduce((max, r) => Math.max(max, r.responses), 0)
}
