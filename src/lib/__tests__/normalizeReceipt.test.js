import { describe, it, expect, vi, beforeEach } from 'vitest'
import { normalizeReceipt } from '../normalizeReceipt.js'

describe('normalizeReceipt', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-11T10:00:00Z'))
  })

  it('mantiene id se presente, altrimenti ne genera uno', () => {
    expect(normalizeReceipt({ id: 'abc' }).id).toBe('abc')
    expect(normalizeReceipt({}).id).toMatch(/.+/)
  })

  it('accetta date ISO YYYY-MM-DD valida', () => {
    expect(normalizeReceipt({ date: '2025-03-15' }).date).toBe('2025-03-15')
  })

  it('fallback a data odierna se date mancante o malformata', () => {
    expect(normalizeReceipt({}).date).toBe('2026-04-11')
    expect(normalizeReceipt({ date: '15/03/2025' }).date).toBe('2026-04-11')
    expect(normalizeReceipt({ date: 123 }).date).toBe('2026-04-11')
    expect(normalizeReceipt({ date: null }).date).toBe('2026-04-11')
  })

  it('converte merchant, category, notes in stringa con default vuoto/Altro', () => {
    const out = normalizeReceipt({})
    expect(out.merchant).toBe('')
    expect(out.category).toBe('Altro')
    expect(out.notes).toBe('')
  })

  it('merchant non stringa viene coerced a stringa', () => {
    expect(normalizeReceipt({ merchant: 42 }).merchant).toBe('42')
  })

  it('total numerico valido mantenuto', () => {
    expect(normalizeReceipt({ total: 12.5 }).total).toBe(12.5)
  })

  it('total stringa numerica convertito', () => {
    expect(normalizeReceipt({ total: '12.5' }).total).toBe(12.5)
  })

  it('total non parseable → 0', () => {
    expect(normalizeReceipt({ total: 'abc' }).total).toBe(0)
    expect(normalizeReceipt({ total: null }).total).toBe(0)
    expect(normalizeReceipt({ total: undefined }).total).toBe(0)
  })

  it('createdAt preservato se presente, altrimenti impostato a now', () => {
    expect(normalizeReceipt({ createdAt: '2020-01-01T00:00:00.000Z' }).createdAt)
      .toBe('2020-01-01T00:00:00.000Z')
    expect(normalizeReceipt({}).createdAt).toBe('2026-04-11T10:00:00.000Z')
  })
})
