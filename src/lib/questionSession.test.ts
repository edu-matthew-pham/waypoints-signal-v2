import { describe, it, expect } from 'vitest'
import { toSlots, slotKey, type StudentQuestion } from './questionSession'

const MC: StudentQuestion = {
  idx: 0,
  type: 'mc',
  stem: 'How many bytes for "Digital"?',
  options: [
    { label: 'A', text: '5 bytes' },
    { label: 'B', text: '7 bytes' },
  ],
}

const TEXT: StudentQuestion = {
  idx: 1,
  type: 'text',
  stem: 'Why does compression lose quality?',
}

const CONFIDENCE: StudentQuestion = {
  idx: 2,
  type: 'confidence',
  stem: 'How are we going?',
  criteria: [
    'I can explain why binary uses base 2',
    'I can convert a decimal number to binary',
  ],
}

describe('toSlots', () => {
  it('gives mc a single slot', () => {
    const slots = toSlots([MC])
    expect(slots).toHaveLength(1)
    expect(slots[0]).toMatchObject({ questionIdx: 0, subIdx: 0, type: 'mc', first: true })
    expect(slots[0].options).toHaveLength(2)
  })

  it('gives text a single slot', () => {
    expect(toSlots([TEXT])).toHaveLength(1)
  })

  // The distinction the sub_idx column exists for: one item to author, several
  // items to answer.
  it('gives confidence one slot per criterion', () => {
    const slots = toSlots([CONFIDENCE])
    expect(slots).toHaveLength(2)
    expect(slots.map((s) => s.subIdx)).toEqual([0, 1])
    expect(slots[0].criterion).toBe('I can explain why binary uses base 2')
  })

  it('marks only the first criterion as heading-bearing', () => {
    expect(toSlots([CONFIDENCE]).map((s) => s.first)).toEqual([true, false])
  })

  it('repeats the stem across a confidence question’s slots', () => {
    const slots = toSlots([CONFIDENCE])
    expect(slots[0].stem).toBe(slots[1].stem)
  })

  // Rejected at export, but a hand-authored session could carry one. An
  // unanswerable heading is worse than nothing.
  it('emits nothing for a confidence question with no criteria', () => {
    expect(toSlots([{ ...CONFIDENCE, criteria: [] }])).toHaveLength(0)
    expect(toSlots([{ ...CONFIDENCE, criteria: undefined }])).toHaveLength(0)
  })

  it('keeps deck order across mixed types', () => {
    const slots = toSlots([MC, TEXT, CONFIDENCE])
    expect(slots.map((s) => `${s.questionIdx}:${s.subIdx}`)).toEqual([
      '0:0', '1:0', '2:0', '2:1',
    ])
  })

  it('preserves question idx rather than reindexing', () => {
    const slots = toSlots([{ ...MC, idx: 7 }])
    expect(slots[0].questionIdx).toBe(7)
  })

  it('returns nothing for an empty set', () => {
    expect(toSlots([])).toEqual([])
  })
})

describe('slotKey', () => {
  it('is unique per question and sub position', () => {
    const keys = toSlots([MC, TEXT, CONFIDENCE]).map(slotKey)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('does not collide across questions with the same sub index', () => {
    expect(slotKey({ questionIdx: 1, subIdx: 0 })).not.toBe(
      slotKey({ questionIdx: 0, subIdx: 1 }),
    )
  })
})
