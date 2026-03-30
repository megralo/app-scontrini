import { describe, it, expect } from 'vitest'
import { matchCategory } from '../categoryMatcher.js'
import { FALLBACK_CATEGORY } from '../../data/categories.js'

describe('matchCategory', () => {
  it('riconosce "esselunga" → "Spesa alimentare"', () => {
    expect(matchCategory('Esselunga di via Roma')).toBe('Spesa alimentare')
  })

  it('riconosce "supermercato" → "Spesa alimentare"', () => {
    expect(matchCategory('supermercato conad')).toBe('Spesa alimentare')
  })

  it('riconosce "ristorante" → "Ristorante / Bar"', () => {
    expect(matchCategory('ristorante al centro')).toBe('Ristorante / Bar')
  })

  it('riconosce "farmacia" come parola intera → "Salute / Farmacia"', () => {
    expect(matchCategory('farmacia comunale')).toBe('Salute / Farmacia')
  })

  it('word boundary: "afarmaciar" non matcha la keyword "farmacia"', () => {
    // "farmacia" è preceduta da "a" (\w) → lookbehind blocca il match
    expect(matchCategory('afarmaciar')).toBe(FALLBACK_CATEGORY)
  })

  it('word boundary: "ristorante" embedded in word non matcha', () => {
    // "ilristorantediMario": "ristorante" preceduta da "l" (\w) → no match
    expect(matchCategory('ilristorantediMario')).toBe(FALLBACK_CATEGORY)
  })

  it('testo senza keyword → FALLBACK_CATEGORY ("Altro")', () => {
    expect(matchCategory('testo qualunque senza keyword')).toBe(FALLBACK_CATEGORY)
  })

  it('testo vuoto → FALLBACK_CATEGORY', () => {
    expect(matchCategory('')).toBe(FALLBACK_CATEGORY)
  })

  it('chiamata senza argomenti → FALLBACK_CATEGORY (default parameter "")', () => {
    expect(matchCategory()).toBe(FALLBACK_CATEGORY)
  })

  it('riconosce "farmacia" case-insensitive: "FARMACIA"', () => {
    expect(matchCategory('FARMACIA CENTRALE')).toBe('Salute / Farmacia')
  })

  it('riconosce "decathlon" → "Sport"', () => {
    expect(matchCategory('decathlon sport')).toBe('Sport')
  })
})
