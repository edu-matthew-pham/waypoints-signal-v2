import { describe, it, expect } from 'vitest'
import {
  pct,
  pctColor,
  mcBars,
  confidenceBars,
  rowsForQuestion,
  questionResponses,
  type AggregateRow,
} from './aggregate'

const OPTIONS = [
  { label: 'A', text: '5 bytes' },
  { label: 'B', text: '7 bytes' },
  { label: 'C', text: '8 bytes' },
]

const MC_ROW: AggregateRow = {
  questionIdx: 0,
  subIdx: 0,
  type: 'mc',
  responses: 10,
  counts: { A: 2, B: 7, C: 1 },
}

// Moved from results.test.ts, which mirrored these rather than importing them.
describe('pct', () => {
  it('returns the rounded percentage', () => {
    expect(pct(7, 10)).toBe(70)
    expect(pct(1, 3)).toBe(33)
    expect(pct(1, 6)).toBe(17)
  })

  it('returns 0 rather than NaN when nothing has been answered', () => {
    expect(pct(0, 0)).toBe(0)
    expect(pct(5, 0)).toBe(0)
  })

  it('returns 100 when everyone agrees', () => {
    expect(pct(10, 10)).toBe(100)
  })
})

describe('pctColor', () => {
  it('is green at 70 or above', () => {
    expect(pctColor(70, 0)).toBe('text-green')
    expect(pctColor(100, 0)).toBe('text-green')
  })

  it('is red when not-yet reaches 40 and green has not', () => {
    expect(pctColor(50, 40)).toBe('text-red')
    expect(pctColor(0, 100)).toBe('text-red')
  })

  it('is yellow otherwise', () => {
    expect(pctColor(50, 30)).toBe('text-yellow')
    expect(pctColor(69, 39)).toBe('text-yellow')
  })

  it('lets green win over red', () => {
    expect(pctColor(70, 40)).toBe('text-green')
  })
})

describe('mcBars', () => {
  it('produces one bar per authored option', () => {
    expect(mcBars(MC_ROW, OPTIONS)).toHaveLength(3)
  })

  it('carries counts and percentages', () => {
    const bars = mcBars(MC_ROW, OPTIONS)
    expect(bars[1]).toMatchObject({ value: 'B', count: 7, pct: 70 })
  })

  // A distribution missing its unchosen options is a different distribution.
  it('keeps an option nobody chose', () => {
    const row = { ...MC_ROW, responses: 9, counts: { A: 2, B: 7 } }
    const bars = mcBars(row, OPTIONS)
    expect(bars[2]).toMatchObject({ value: 'C', count: 0, pct: 0 })
  })

  it('marks the correct option when a key is supplied', () => {
    expect(mcBars(MC_ROW, OPTIONS, 'B').map((b) => b.correct)).toEqual([false, true, false])
  })

  // A missing ?k= means "don't highlight", whatever the reason — unresolved
  // answer, drifted deck, or a type with no answer at all.
  it('marks nothing when no key is supplied', () => {
    expect(mcBars(MC_ROW, OPTIONS).some((b) => b.correct)).toBe(false)
  })

  it('marks nothing when the key matches no option', () => {
    expect(mcBars(MC_ROW, OPTIONS, 'Z').some((b) => b.correct)).toBe(false)
  })

  it('renders an unanswered question as empty bars', () => {
    const row = { ...MC_ROW, responses: 0, counts: {} }
    expect(mcBars(row, OPTIONS).map((b) => b.pct)).toEqual([0, 0, 0])
  })
})

describe('confidenceBars', () => {
  const row: AggregateRow = {
    questionIdx: 2, subIdx: 0, type: 'confidence',
    responses: 4, counts: { green: 3, red: 1 },
  }

  // The shape of a traffic light is the information — a missing colour would
  // read as a different question rather than as nobody choosing it.
  it('always produces three bars in fixed order', () => {
    expect(confidenceBars(row).map((b) => b.value)).toEqual(['green', 'yellow', 'red'])
  })

  it('zeroes a signal nobody picked', () => {
    expect(confidenceBars(row)[1]).toMatchObject({ value: 'yellow', count: 0, pct: 0 })
  })

  it('uses the student-facing labels', () => {
    expect(confidenceBars(row).map((b) => b.label)).toEqual(['Got it', 'Getting there', 'Not yet'])
  })

  it('never marks a signal correct', () => {
    expect(confidenceBars(row).some((b) => b.correct)).toBe(false)
  })
})

describe('rowsForQuestion', () => {
  const rows: AggregateRow[] = [
    { questionIdx: 2, subIdx: 1, type: 'confidence', responses: 3, counts: {} },
    { questionIdx: 0, subIdx: 0, type: 'mc', responses: 5, counts: {} },
    { questionIdx: 2, subIdx: 0, type: 'confidence', responses: 4, counts: {} },
  ]

  it('selects only the named question', () => {
    expect(rowsForQuestion(rows, 0)).toHaveLength(1)
  })

  it('orders criteria by sub index', () => {
    expect(rowsForQuestion(rows, 2).map((r) => r.subIdx)).toEqual([0, 1])
  })

  it('returns nothing for a question with no rows', () => {
    expect(rowsForQuestion(rows, 9)).toEqual([])
  })
})

describe('questionResponses', () => {
  // Criteria counts can differ — a student may have signalled two of three.
  it('takes the highest across criteria', () => {
    const rows: AggregateRow[] = [
      { questionIdx: 2, subIdx: 0, type: 'confidence', responses: 4, counts: {} },
      { questionIdx: 2, subIdx: 1, type: 'confidence', responses: 2, counts: {} },
    ]
    expect(questionResponses(rows)).toBe(4)
  })

  it('is zero for nothing', () => {
    expect(questionResponses([])).toBe(0)
  })
})
