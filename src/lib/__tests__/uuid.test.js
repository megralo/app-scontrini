import { describe, it, expect, vi, afterEach } from 'vitest'
import { generateId } from '../uuid.js'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('generateId', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('restituisce una stringa in formato UUID v4 (via crypto.randomUUID)', () => {
    const id = generateId()
    expect(typeof id).toBe('string')
    expect(id).toMatch(UUID_PATTERN)
  })

  it('genera ID univoci in 100 chiamate consecutive', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })

  it('fallback Math.random quando crypto.randomUUID non è disponibile', () => {
    const { randomUUID: _, ...cryptoWithout } = globalThis.crypto
    vi.stubGlobal('crypto', cryptoWithout)
    const id = generateId()
    expect(id).toMatch(UUID_PATTERN)
  })

  it('fallback genera ID univoci (50 chiamate)', () => {
    const { randomUUID: _, ...cryptoWithout } = globalThis.crypto
    vi.stubGlobal('crypto', cryptoWithout)
    const ids = new Set(Array.from({ length: 50 }, () => generateId()))
    expect(ids.size).toBe(50)
  })
})