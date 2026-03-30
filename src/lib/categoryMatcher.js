import { DEFAULT_CATEGORIES, FALLBACK_CATEGORY } from '../data/categories.js'

// Precompila i pattern con word boundary al caricamento del modulo.
// \b non gestisce caratteri accentati, quindi usiamo lookbehind/lookahead su \w (ASCII).

/**
 * Compila una keyword in una RegExp con pseudo-word-boundary ASCII.
 * Usa lookbehind/lookahead negativi su `\w` invece di `\b` per gestire
 * correttamente keyword con caratteri accentati (es. "università").
 *
 * @param {string} kw - Keyword da compilare (può contenere caratteri speciali regex).
 * @returns {RegExp} Pattern case-insensitive pronto per il test.
 */
function buildPattern(kw) {
  const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?<![\\w])${escaped}(?![\\w])`, 'i')
}

const COMPILED_CATEGORIES = DEFAULT_CATEGORIES
  .filter((cat) => cat.name !== FALLBACK_CATEGORY)
  .map((cat) => ({
    name: cat.name,
    patterns: cat.keywords.map(buildPattern),
  }))

/**
 * Assegna una categoria in base al testo del merchant e/o del testo OCR grezzo.
 * Il match avviene solo sulle categorie predefinite (le categorie custom non hanno keywords).
 * Fallback: 'Altro'.
 *
 * @param {string} text - testo da matchare (merchant + eventuale testo OCR)
 * @returns {string} nome della categoria
 */
export function matchCategory(text = '') {
  for (const cat of COMPILED_CATEGORIES) {
    for (const pattern of cat.patterns) {
      if (pattern.test(text)) {
        return cat.name
      }
    }
  }

  return FALLBACK_CATEGORY
}