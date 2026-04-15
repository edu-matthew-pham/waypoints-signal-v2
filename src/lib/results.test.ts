import { describe, it, expect } from 'vitest'

// Extracted helpers — mirror what's in ResultsTab.svelte
function pct(n: number, total: number): number {
  return total === 0 ? 0 : Math.round(n / total * 100)
}

function pctColor(greenPct: number, redPct: number): string {
  if (greenPct >= 70) return 'text-green'
  if (redPct >= 40) return 'text-red'
  return 'text-yellow'
}

describe('pct', () => {
  it('returns correct percentage', () => {
    expect(pct(7, 10)).toBe(70)
    expect(pct(1, 3)).toBe(33)
    expect(pct(0, 10)).toBe(0)
  })

  it('returns 0 when total is 0', () => {
    expect(pct(0, 0)).toBe(0)
    expect(pct(5, 0)).toBe(0)
  })

  it('returns 100 when all responses are positive', () => {
    expect(pct(10, 10)).toBe(100)
  })

  it('rounds correctly', () => {
    expect(pct(1, 6)).toBe(17) // 16.67 rounds to 17
    expect(pct(2, 6)).toBe(33) // 33.33 rounds to 33
  })
})

describe('pctColor', () => {
  it('returns text-green when green >= 70%', () => {
    expect(pctColor(70, 0)).toBe('text-green')
    expect(pctColor(100, 0)).toBe('text-green')
    expect(pctColor(71, 5)).toBe('text-green')
  })

  it('returns text-red when red >= 40% and green < 70%', () => {
    expect(pctColor(50, 40)).toBe('text-red')
    expect(pctColor(0, 100)).toBe('text-red')
    expect(pctColor(60, 40)).toBe('text-red')
  })

  it('returns text-yellow otherwise', () => {
    expect(pctColor(50, 30)).toBe('text-yellow')
    expect(pctColor(0, 0)).toBe('text-yellow')
    expect(pctColor(69, 39)).toBe('text-yellow')
  })

  it('green takes priority over red', () => {
    // green >= 70 should win even if red is also high
    expect(pctColor(70, 40)).toBe('text-green')
  })
})
