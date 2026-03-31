import { describe, it, expect } from 'vitest'
import { extractDate, extractTotal, extractMerchant } from '../ocr.js'

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

  it('anno 2100 fuori range → fallback data odierna', () => {
    const result = extractDate('15/01/2100')
    // 2100 > 2099: il guard scarta la data e restituisce oggi in formato YYYY-MM-DD
    expect(result.isGuessed).toBe(true)
    expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(result.date).not.toBe('2100-01-15')
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

  it('"A PAGARE 7,50" → 7.5', () => {
    expect(extractTotal('A PAGARE 7,50')).toBe(7.5)
  })

  it('"NETTO 3,20" → 3.2', () => {
    expect(extractTotal('NETTO 3,20')).toBe(3.2)
  })
})

// ── extractMerchant ──────────────────────────────────────────────────────────

describe('extractMerchant', () => {
  it('restituisce la prima riga significativa come merchant', () => {
    expect(extractMerchant('Esselunga\nVia Roma 12\nTotale 5,00')).toBe('Esselunga')
  })

  it('salta righe di lunghezza < 3 caratteri', () => {
    expect(extractMerchant('AB\nBar Roma')).toBe('Bar Roma')
  })

  it('salta righe composte solo da numeri (es. codice prodotto)', () => {
    expect(extractMerchant('12345\nFarmacia Centrale')).toBe('Farmacia Centrale')
  })

  it('salta righe che iniziano con formato data (DD/MM...)', () => {
    expect(extractMerchant('15/03/2024\nGalilero S.r.l.')).toBe('Galilero S.r.l.')
  })

  it('salta intestazioni fiscali (P.IVA)', () => {
    expect(extractMerchant('P.IVA 12345678901\nRistorante Al Mare')).toBe('Ristorante Al Mare')
  })

  it('salta intestazioni fiscali (www, tel)', () => {
    expect(extractMerchant('www.esercente.it\nTel 02 1234567\nSuperstore SPA')).toBe('Superstore SPA')
  })

  it('stringa vuota → stringa vuota', () => {
    expect(extractMerchant('')).toBe('')
  })

  it('tutte le righe filtrate → stringa vuota', () => {
    expect(extractMerchant('12345\n67890')).toBe('')
  })

  it('salta righe con molte parole brevi (rumore da logo grafico)', () => {
    expect(extractMerchant('n e I n i O OR i I i 8E a\nRistorante Roma')).toBe('Ristorante Roma')
  })
})
