import { describe, it, expect } from 'vitest'
import { extractDate, extractTotal } from '../ocr.js'

// ── extractDate ──────────────────────────────────────────────────────────────

describe('extractDate', () => {
  it('"15/03/2024" → { date: "2024-03-15", isGuessed: false }', () => {
    expect(extractDate('15/03/2024')).toEqual({ date: '2024-03-15', isGuessed: false })
  })

  it('"15.03.2024" (separatore punto) → { date: "2024-03-15", isGuessed: false }', () => {
    expect(extractDate('15.03.2024')).toEqual({ date: '2024-03-15', isGuessed: false })
  })

  it('"15-03-2024" (separatore trattino) → { date: "2024-03-15", isGuessed: false }', () => {
    expect(extractDate('15-03-2024')).toEqual({ date: '2024-03-15', isGuessed: false })
  })

  it('anno a 2 cifre "15/03/25" → { date: "2025-03-15", isGuessed: false }', () => {
    expect(extractDate('15/03/25')).toEqual({ date: '2025-03-15', isGuessed: false })
  })

  it('data invalida "30/02/2024" (feb ha max 28/29 gg) → { isGuessed: true }', () => {
    const result = extractDate('30/02/2024')
    expect(result.isGuessed).toBe(true)
    expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('data invalida "31/04/2024" (aprile ha 30 gg) → { isGuessed: true }', () => {
    const result = extractDate('31/04/2024')
    expect(result.isGuessed).toBe(true)
    expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('nessuna data nel testo → fallback con data odierna, { isGuessed: true }', () => {
    const result = extractDate('nessuna data qui')
    expect(result.isGuessed).toBe(true)
    expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('stringa vuota → fallback, { isGuessed: true }', () => {
    const result = extractDate('')
    expect(result.isGuessed).toBe(true)
  })
})

// ── extractTotal ─────────────────────────────────────────────────────────────

describe('extractTotal', () => {
  it('"Totale € 12,50" → 12.5', () => {
    expect(extractTotal('Totale € 12,50')).toBe(12.5)
  })

  it('"Tot. 8,00" → 8', () => {
    expect(extractTotal('Tot. 8,00')).toBe(8)
  })

  it('"TOTALE 99,99" → 99.99', () => {
    expect(extractTotal('TOTALE 99,99')).toBe(99.99)
  })

  it('"TOTALE EUR 1.234,56" → 1234.56 (formato italiano con separatore migliaia)', () => {
    expect(extractTotal('TOTALE EUR 1.234,56')).toBe(1234.56)
  })

  it('testo senza importo riconoscibile → null', () => {
    expect(extractTotal('nessun importo qui')).toBeNull()
  })

  it('importo zero o negativo → null (< 0 o == 0 non passa il guard amount > 0)', () => {
    expect(extractTotal('Totale € 0,00')).toBeNull()
  })
})
