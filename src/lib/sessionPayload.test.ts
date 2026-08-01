import { describe, it, expect } from 'vitest'
import { extractJson, parsePayload, summarise, frontmatterBlock } from './sessionPayload'

const VALID = {
  version: 1,
  title: 'Digital Systems & Data',
  fingerprint: 'a1b2c3d4',
  questions: [
    {
      idx: 0,
      type: 'mc',
      stem: 'How many bytes for "Digital"?',
      options: [
        { label: 'A', text: '5 bytes' },
        { label: 'B', text: '7 bytes' },
      ],
      correct: 'B',
    },
    { idx: 1, type: 'text', stem: 'Why does compression lose quality?' },
    {
      idx: 2,
      type: 'confidence',
      stem: 'How are we going?',
      criteria: ['I can convert decimal to binary'],
    },
  ],
}

const json = JSON.stringify(VALID)

describe('extractJson', () => {
  it('returns bare JSON unchanged', () => {
    expect(extractJson(json)).toBe(json)
  })

  it('pulls JSON out of a fenced code block', () => {
    expect(extractJson('```json\n' + json + '\n```')).toBe(json)
  })

  it('pulls JSON out of surrounding prose', () => {
    expect(extractJson(`Here you go:\n\n${json}\n\nLet me know.`)).toBe(json)
  })

  // Brace counting rather than a regex: a lazy match would stop at the first
  // closing brace inside the payload.
  it('does not truncate at a nested object', () => {
    const out = extractJson(`prose ${json} more prose`)
    expect(JSON.parse(out!).questions).toHaveLength(3)
  })

  // The reason string literals are tracked.
  it('ignores braces inside string values', () => {
    const tricky = JSON.stringify({ version: 1, title: 'a { brace', fingerprint: 'aaaaaaaa', questions: [] })
    expect(extractJson(`x ${tricky} y`)).toBe(tricky)
  })

  it('handles escaped quotes in string values', () => {
    const q = JSON.stringify({ version: 1, title: 'say \\"hi\\"', fingerprint: 'aaaaaaaa', questions: [] })
    expect(extractJson(q)).toBe(q)
  })

  it('returns null when there is no JSON', () => {
    expect(extractJson('nothing here')).toBeNull()
  })

  it('returns null on an unclosed object', () => {
    expect(extractJson('{"version": 1')).toBeNull()
  })
})

describe('parsePayload', () => {
  it('accepts a clean payload', () => {
    const r = parsePayload(json)
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.payload.questions).toHaveLength(3)
  })

  it('accepts a payload pasted with fences', () => {
    expect(parsePayload('```json\n' + json + '\n```').ok).toBe(true)
  })

  it('rejects an empty paste', () => {
    expect(parsePayload('   ')).toEqual({ ok: false, error: 'Nothing pasted yet.' })
  })

  it('rejects non-JSON', () => {
    const r = parsePayload('just some words')
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatch(/find any JSON/)
  })

  // The realistic failure: a partial copy out of the clipboard. The braces are
  // unbalanced, so extraction finds nothing — but saying "no JSON here" to
  // someone looking at a screen full of it is useless.
  it('names truncation when the paste is cut off', () => {
    const r = parsePayload(json.slice(0, json.length - 20))
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatch(/cut off/)
  })

  // Balanced braces but broken contents — a different failure, different message.
  it('rejects malformed JSON that does parse as a block', () => {
    const r = parsePayload('{ "version": 1, oops }')
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatch(/valid JSON/)
  })

  it('rejects the wrong version', () => {
    const r = parsePayload(JSON.stringify({ ...VALID, version: 2 }))
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatch(/version/)
  })

  it('rejects a malformed fingerprint', () => {
    const r = parsePayload(JSON.stringify({ ...VALID, fingerprint: 'nope' }))
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatch(/check value/)
  })

  it('rejects an empty question set', () => {
    const r = parsePayload(JSON.stringify({ ...VALID, questions: [] }))
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatch(/no questions/)
  })

  it('rejects an unrecognised question type', () => {
    const bad = { ...VALID, questions: [{ idx: 0, type: 'poll', stem: 'x' }] }
    const r = parsePayload(JSON.stringify(bad))
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatch(/unrecognised type/)
  })

  // A deck can legitimately be confidence-only — the existing check-in covers
  // that job, but rejecting it would push teachers around for no reason.
  it('accepts a confidence-only payload', () => {
    const only = { ...VALID, questions: [VALID.questions[2]] }
    expect(parsePayload(JSON.stringify(only)).ok).toBe(true)
  })

  // An unresolvable answer is reported at export and still posts. It must not
  // block creation here either.
  it('accepts an MC question with no correct answer', () => {
    const q = { ...VALID.questions[0], correct: undefined }
    const r = parsePayload(JSON.stringify({ ...VALID, questions: [q] }))
    expect(r.ok).toBe(true)
  })
})

describe('summarise', () => {
  it('counts by type', () => {
    const s = summarise(VALID as never)
    expect(s).toMatchObject({ total: 3, mc: 1, text: 1, confidence: 1 })
  })

  it('uses a fallback title', () => {
    expect(summarise({ ...VALID, title: '' } as never).title).toBe('Untitled deck')
  })

  it('reports MC questions with no answer, by position', () => {
    const qs = [{ idx: 0, type: 'mc', stem: 'x', options: [] }, VALID.questions[1]]
    expect(summarise({ ...VALID, questions: qs } as never).missingAnswers).toEqual([0])
  })

  it('does not count text or confidence as missing answers', () => {
    expect(summarise(VALID as never).missingAnswers).toEqual([])
  })
})

describe('frontmatterBlock', () => {
  // Both lines, always. Without signal_check the drift guard has nothing to
  // compare against and silently stops running.
  it('emits the code and the check value', () => {
    expect(frontmatterBlock('XKQT-4821', 'a1b2c3d4')).toBe(
      'signal_session: XKQT-4821\nsignal_check: a1b2c3d4'
    )
  })
})