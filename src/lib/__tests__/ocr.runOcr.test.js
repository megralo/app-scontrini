// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ── Percorso successo (Tesseract mockato) ──────────────────────────────────────

describe('runOcr — successo con Tesseract mock', () => {
  let runOcr

  beforeEach(async () => {
    vi.resetModules()
    // URL API: richiesta da preprocessImage per creare/revocare blob URL
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:mock'), revokeObjectURL: vi.fn() })
    // Image mock: jsdom non carica immagini → simula onerror in modo asincrono
    // → preprocessImage rigetta → runOcr usa il fallback (file originale)
    vi.stubGlobal('Image', function () {
      const img = {}
      setTimeout(() => { img.onerror?.() }, 0)
      return img
    })
    // Tesseract mock: bypassa il caricamento CDN (loadTesseractCDN controlla window.Tesseract)
    vi.stubGlobal('Tesseract', {
      recognize: vi.fn().mockResolvedValue({
        data: { text: 'Supermercato Roma\nTotale € 12,50\n15/03/2024' },
      }),
    })
    ;({ runOcr } = await import('../ocr.js'))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('restituisce merchant, total e date estratti dal testo OCR', async () => {
    const file = new File([''], 'scontrino.jpg', { type: 'image/jpeg' })
    const result = await runOcr(file)
    expect(result.merchant).toBe('Supermercato Roma')
    expect(result.total).toBe(12.5)
    expect(result.date).toBe('2024-03-15')
    expect(result.dateIsGuessed).toBe(false)
    expect(result.text).toContain('Totale')
  })

  it('invoca onProgress almeno una volta durante l\'elaborazione', async () => {
    const file = new File([''], 'scontrino.jpg', { type: 'image/jpeg' })
    const onProgress = vi.fn()
    await runOcr(file, onProgress)
    expect(onProgress).toHaveBeenCalled()
    // La prima chiamata avviene prima del preprocessing: progress ≥ 0
    const [, pct] = onProgress.mock.calls[0]
    expect(typeof pct).toBe('number')
    expect(pct).toBeGreaterThanOrEqual(0)
  })
})

// ── Percorso errore CDN ───────────────────────────────────────────────────────

describe('runOcr — errore CDN', () => {
  let runOcr

  beforeEach(async () => {
    vi.resetModules()
    // Nessun window.Tesseract → il codice tenta il caricamento CDN
    // vi.resetModules garantisce che _tesseractReady sia null nel modulo fresco
    delete globalThis.Tesseract
    // Intercetta l'append dello script CDN e scatena onerror nel prossimo microtask
    vi.spyOn(document.head, 'appendChild').mockImplementation((el) => {
      if (el.tagName === 'SCRIPT') {
        Promise.resolve().then(() => el.onerror?.())
      }
      return el
    })
    ;({ runOcr } = await import('../ocr.js'))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('lancia errore human-readable se il CDN non risponde', async () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
    await expect(runOcr(file)).rejects.toThrow(
      'Impossibile caricare il motore OCR'
    )
  })
})

// ── Percorso errore Tesseract.recognize ──────────────────────────────────────

describe('runOcr — errore Tesseract.recognize', () => {
  let runOcr

  beforeEach(async () => {
    vi.resetModules()
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:mock'), revokeObjectURL: vi.fn() })
    vi.stubGlobal('Image', function () {
      const img = {}
      setTimeout(() => { img.onerror?.() }, 0)
      return img
    })
    // Tesseract presente ma recognize lancia un'eccezione
    vi.stubGlobal('Tesseract', {
      recognize: vi.fn().mockRejectedValue(new Error('Worker crash simulato')),
    })
    ;({ runOcr } = await import('../ocr.js'))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('lancia errore human-readable se Tesseract.recognize fallisce', async () => {
    const file = new File([''], 'scontrino.jpg', { type: 'image/jpeg' })
    await expect(runOcr(file)).rejects.toThrow(
      'Impossibile caricare il motore OCR'
    )
  })
})