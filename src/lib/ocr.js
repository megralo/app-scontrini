import { matchCategory } from './categoryMatcher.js'
import { parseAmount } from './parseAmount.js'

// ── Regex per estrazione campi ─────────────────────────────────────────────

const TOTAL_PATTERNS = [
  /(?:totale\s*(?:eur[o]?|€)?\s*[:=]?\s*)(\d{1,3}(?:[.,]\d{3})+[.,]\d{2}|\d{1,5}[.,]\d{2})/i,
  /(?:total[e]?\s*[:=]?\s*)(\d{1,3}(?:[.,]\d{3})+[.,]\d{2}|\d{1,5}[.,]\d{2})/i,
  /(?:tot\.?\s*[:=]?\s*)(\d{1,3}(?:[.,]\d{3})+[.,]\d{2}|\d{1,5}[.,]\d{2})/i,
  /(?:importo\s+\S+\s*[:=]?\s*)(\d{1,3}(?:[.,]\d{3})+[.,]\d{2}|\d{1,5}[.,]\d{2})/i,
  /(?:importo\s*[:=]?\s*)(\d{1,3}(?:[.,]\d{3})+[.,]\d{2}|\d{1,5}[.,]\d{2})/i,
  /(?:da\s+pagare\s*[:=]?\s*)(\d{1,3}(?:[.,]\d{3})+[.,]\d{2}|\d{1,5}[.,]\d{2})/i,
  /(?:pagamento\s+\S+\s*)(\d{1,3}(?:[.,]\d{3})+[.,]\d{2}|\d{1,5}[.,]\d{2})/i,
  /(?:€\s*)(\d{1,3}(?:[.,]\d{3})+[.,]\d{2}|\d{1,5}[.,]\d{2})/,
]

/**
 * Estrae l'importo totale da un testo OCR usando una serie di pattern regex.
 *
 * @param {string} text - Testo grezzo prodotto dall'OCR.
 * @returns {number|null} Importo numerico positivo, o `null` se non trovato.
 */
export function extractTotal(text) {
  for (const pattern of TOTAL_PATTERNS) {
    const match = text.match(pattern)
    if (match) {
      const amount = parseAmount(match[1])
      if (!isNaN(amount) && amount > 0 && amount < 99999) return amount
    }
  }
  return null
}

/**
 * Estrae la data dello scontrino da un testo OCR.
 * Supporta i formati GG/MM/AAAA, GG.MM.AAAA, GG-MM-AAAA (anno a 4 o 2 cifre).
 * Fallback: data odierna in formato ISO (YYYY-MM-DD).
 *
 * @param {string} text - Testo grezzo prodotto dall'OCR.
 * @returns {string} Data in formato ISO `YYYY-MM-DD`.
 */
export function extractDate(text) {
  // Pattern: GG/MM/AAAA o GG.MM.AAAA o GG-MM-AAAA (anno a 4 o 2 cifre)
  const pattern4 = /(\d{2})[/.\-](\d{2})[/.\-](\d{4})/
  const pattern2 = /(\d{2})[/.\-](\d{2})[/.\-](\d{2})(?!\d)/

  for (const pattern of [pattern4, pattern2]) {
    const match = text.match(pattern)
    if (match) {
      let [, dd, mm, yy] = match
      // Anni a 2 cifre (es. "25") → interpretati come 20XX.
      // Il range y >= 2000 && y <= 2099 garantisce la coerenza con questa assunzione.
      if (yy.length === 2) yy = '20' + yy
      const d = parseInt(dd), m = parseInt(mm), y = parseInt(yy)
      if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 2000 && y <= 2099) {
        const isoDate = `${yy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
        const candidate = new Date(isoDate)
        if (candidate.getDate() !== d || candidate.getMonth() + 1 !== m) continue
        return { date: isoDate, isGuessed: false }
      }
    }
  }

  // Fallback: data odierna
  return { date: new Date().toISOString().slice(0, 10), isGuessed: true }
}

/**
 * Estrae il nome del commerciante dalla prima riga significativa del testo OCR.
 * Salta righe numeriche, date, e intestazioni fiscali comuni (P.IVA, C.F., ecc.).
 *
 * @param {string} text - Testo grezzo prodotto dall'OCR.
 * @returns {string} Nome del commerciante, o stringa vuota se non individuato.
 */
export function extractMerchant(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  for (const line of lines) {
    if (line.length < 3) continue
    if (/^\d+([.,]\d+)?$/.test(line)) continue          // solo numeri
    if (/^\d{2}[/.\-]\d{2}/.test(line)) continue        // inizia con data
    if (/^(tel|fax|p\.?\s*iva|c\.?\s*f|cod\.|www|http|sdi|rea)/i.test(line)) continue
    return line
  }
  return ''
}

// ── Caricamento CDN Tesseract (bypassa bundling Vite) ──────────────────────

let _tesseractReady = null

/**
 * Carica la libreria Tesseract.js dalla CDN jsdelivr in modo lazy (singleton).
 * Successive chiamate restituiscono la stessa Promise già risolta.
 *
 * @returns {Promise<typeof Tesseract>} Oggetto Tesseract pronto all'uso.
 * @throws {Error} Se lo script CDN non può essere caricato (offline, blocco rete).
 */
function loadTesseractCDN() {
  if (_tesseractReady) return _tesseractReady
  _tesseractReady = new Promise((resolve, reject) => {
    if (window.Tesseract) { resolve(window.Tesseract); return }
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4.1.4/dist/tesseract.min.js'
    script.integrity = 'sha384-+56qagDlzJ3YYkDcyAXRdhrP7/+ai8qJcS6HpjACl2idDoCyCqRf5VVi7E/XkGae'
    script.crossOrigin = 'anonymous'
    script.onload = () => resolve(window.Tesseract)
    script.onerror = () => {
      _tesseractReady = null
      reject(new Error('Impossibile caricare Tesseract.js dalla CDN'))
    }
    document.head.appendChild(script)
  })
  return _tesseractReady
}

// ── Worker OCR ─────────────────────────────────────────────────────────────

/**
 * Esegue OCR su un File immagine.
 *
 * @param {File}   imageFile
 * @param {(message: string, progress: number) => void} onProgress  0-100
 * @returns {Promise<{ text: string, merchant: string, total: number|null, date: string, category: string }>}
 */
export async function runOcr(imageFile, onProgress = () => {}) {
  let Tesseract
  try {
    Tesseract = await loadTesseractCDN()
  } catch (err) {
    console.error('[ocr] Errore caricamento CDN:', err)
    throw new Error(
      'Impossibile caricare il motore OCR. Verifica la connessione o inserisci i dati manualmente.'
    )
  }

  let text
  try {
    const { data } = await Tesseract.recognize(imageFile, 'ita', {
      langPath: 'https://cdn.jsdelivr.net/gh/naptha/tessdata@gh-pages/4.0.0',
      logger: (m) => {
        if (m.status === 'loading tesseract core') {
          onProgress('Caricamento motore OCR…', Math.floor(m.progress * 25))
        } else if (m.status === 'loading language traineddata') {
          onProgress('Download pacchetto italiano…', 25 + Math.floor(m.progress * 35))
        } else if (m.status === 'initializing api') {
          onProgress('Inizializzazione…', 60 + Math.floor(m.progress * 10))
        } else if (m.status === 'recognizing text') {
          onProgress('Analisi testo in corso…', 70 + Math.floor(m.progress * 30))
        }
      },
    })
    text = data.text
  } catch (err) {
    console.error('[ocr] Errore inizializzazione worker:', err)
    throw new Error(
      'Impossibile caricare il motore OCR. Verifica la connessione o inserisci i dati manualmente.'
    )
  }

  const merchant = extractMerchant(text)
  const total    = extractTotal(text)
  const { date, isGuessed: dateIsGuessed } = extractDate(text)
  const category = matchCategory(merchant + ' ' + text)

  return { text, merchant, total, date, category, dateIsGuessed }
}
