import { describe, it, expect } from 'vitest'
import { generateSessionCode } from './session'

describe('generateSessionCode', () => {
  it('returns a string in XXXX-0000 format', () => {
    const code = generateSessionCode()
    expect(code).toMatch(/^[A-Z]{4}-\d{4}$/)
  })

  it('never contains I or O', () => {
    // Run many times to catch probabilistic failures
    for (let i = 0; i < 200; i++) {
      const code = generateSessionCode()
      expect(code).not.toMatch(/[IO]/)
    }
  })

  it('letters section is exactly 4 characters', () => {
    const code = generateSessionCode()
    const letters = code.split('-')[0]
    expect(letters).toHaveLength(4)
  })

  it('digits section is exactly 4 characters', () => {
    const code = generateSessionCode()
    const digits = code.split('-')[1]
    expect(digits).toHaveLength(4)
  })

  it('generates unique codes across multiple calls', () => {
    const codes = new Set(Array.from({ length: 100 }, () => generateSessionCode()))
    // With ~4.5M combinations, 100 codes should all be unique
    expect(codes.size).toBe(100)
  })
})
