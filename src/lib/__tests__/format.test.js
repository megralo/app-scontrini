import { describe, it, expect } from 'vitest'
import { formatEur, formatDate, monthLabel, monthPrefix } from '../format.js'

describe('formatDate', () => {
  it('"2024-03-15" → "15/03/2024"', () => {
    expect(formatDate('2024-03-15')).toBe('15/03/2024')
  })

  it('"2024-ab-cd" → "—" (parti non numeriche)', () => {
    expect(formatDate('2024-ab-cd')).toBe('—')
  })

  it('stringa vuota → "—"', () => {
    expect(formatDate('')).toBe('—')
  })

  it('stringa senza "-" → "—"', () => {
    expect(formatDate('nodashstring')).toBe('—')
  })

  it('undefined → "—"', () => {
    expect(formatDate(undefined)).toBe('—')
  })

  it('null → "—"', () => {
    expect(formatDate(null)).toBe('—')
  })
})

describe('formatEur', () => {
  it('0 → "0,00 €" (simbolo € alla fine)', () => {
    // NB: il codice produce "0,00 €" (€ in coda), non "€ 0,00"
    expect(formatEur(0)).toBe('0,00 €')
  })

  it('1234.5 → "1234,50 €" (comportamento reale in Node.js: nessun separatore migliaia)', () => {
    // TODO: in browser con ICU completo l'output atteso sarebbe "1.234,50 €"
    expect(formatEur(1234.5)).toBe('1234,50 €')
  })

  it('NaN non causa crash → restituisce "0,00 €"', () => {
    expect(formatEur(NaN)).toBe('0,00 €')
  })

  it('undefined non causa crash → restituisce "0,00 €"', () => {
    expect(formatEur(undefined)).toBe('0,00 €')
  })
})

describe('monthLabel', () => {
  it('"2024-03" contiene "marzo" e "2024"', () => {
    const result = monthLabel('2024-03')
    expect(result).toContain('marzo')
    expect(result).toContain('2024')
  })

  it('"2024-01" contiene "gennaio" e "2024"', () => {
    const result = monthLabel('2024-01')
    expect(result).toContain('gennaio')
    expect(result).toContain('2024')
  })
})

describe('monthPrefix', () => {
  it('estrae "YYYY-MM" da un oggetto Date', () => {
    expect(monthPrefix(new Date(2024, 2, 15))).toBe('2024-03')
  })

  it('gestisce gennaio (mese 0) con zero-padding', () => {
    expect(monthPrefix(new Date(2024, 0, 1))).toBe('2024-01')
  })

  it('gestisce dicembre (mese 11)', () => {
    expect(monthPrefix(new Date(2024, 11, 31))).toBe('2024-12')
  })
})
