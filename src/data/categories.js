/**
 * Categorie predefinite per la classificazione degli scontrini.
 *
 * Struttura di ogni categoria:
 *   { name: string, color: string, keywords: string[] }
 *   - name:     etichetta visibile all'utente
 *   - color:    colore esadecimale usato nel dot indicatore e nei grafici
 *   - keywords: elenco di parole chiave per il matching automatico del testo OCR
 *
 * Criterio di matching (vedi categoryMatcher.js):
 *   Il testo viene confrontato in modo case-insensitive con word-boundary matching
 *   (la keyword deve comparire come parola intera, non come sottostringa).
 *   Viene restituita la prima categoria la cui keywords[] contiene un match.
 *
 * FALLBACK_CATEGORY:
 *   Nome della categoria di fallback ('Altro') restituita quando nessuna keyword
 *   corrisponde. La voce 'Altro' in DEFAULT_CATEGORIES ha keywords: [] ed è
 *   presente solo per consentire la visualizzazione coerente del colore.
 *   Non va rimossa o rinominata senza aggiornare FALLBACK_CATEGORY.
 *
 * Per aggiungere una nuova categoria: inserire un nuovo oggetto nell'array
 * DEFAULT_CATEGORIES (prima di 'Altro') con name, color e una lista di keywords
 * significative per quel dominio.
 */
// Categorie predefinite — non eliminabili dall'utente
export const DEFAULT_CATEGORIES = [
  {
    name: 'Spesa alimentare',
    color: '#22c55e',
    keywords: [
      'supermercato', 'esselunga', 'coop', 'conad', 'lidl', 'aldi', 'carrefour',
      'pam', 'ipercoop', 'crai', 'despar', 'alimentari', 'fruttivendolo',
      'panetteria', 'macelleria', 'pescheria', 'salumeria',
    ],
  },
  {
    name: 'Ristorante / Bar',
    color: '#f97316',
    keywords: [
      'ristorante', 'trattoria', 'osteria', 'pizzeria', 'caffè', 'caffe',
      'caffetteria', 'pasticceria', 'pub', 'birreria', 'sushi', 'kebab',
      'mcdonald', 'burger', 'starbucks',
    ],
  },
  {
    name: 'Salute / Farmacia',
    color: '#ef4444',
    keywords: [
      'farmacia', 'parafarmacia', 'clinica', 'laboratorio', 'ottica', 'dentista',
    ],
  },
  {
    name: 'Trasporti / Carburante',
    color: '#3b82f6',
    keywords: [
      'eni', 'q8', 'tamoil', 'shell', 'agip', 'benzina', 'gasolio',
      'autostrada', 'telepass', 'parcheggio', 'taxi', 'uber', 'trenitalia',
      'italo', 'atm', 'autobus', 'metro',
    ],
  },
  {
    name: 'Abbigliamento',
    color: '#a855f7',
    keywords: [
      'zara', 'h&m', 'primark', 'mango', 'benetton', 'calzedonia', 'intimissimi',
      'nike', 'adidas', 'scarpe', 'abbigliamento',
    ],
  },
  {
    name: 'Casa / Elettrodomestici',
    color: '#f59e0b',
    keywords: [
      'ikea', 'leroy merlin', 'brico', 'obi', 'bricocenter', 'castorama',
      'elettrodomestici',
    ],
  },
  {
    name: 'Elettronica / Tech',
    color: '#6366f1',
    keywords: [
      'apple', 'mediaworld', 'unieuro', 'euronics', 'expert', 'trony',
      'elettronica', 'informatica',
    ],
  },
  {
    name: 'Intrattenimento',
    color: '#ec4899',
    keywords: [
      'cinema', 'teatro', 'concerti', 'spotify', 'netflix', 'ticketmaster',
      'ticketone', 'libreria', 'feltrinelli', 'mondadori',
    ],
  },
  {
    name: 'Sport',
    color: '#14b8a6',
    keywords: ['decathlon', 'cisalfa', 'sportler', 'palestra', 'piscina'],
  },
  {
    name: 'Altro',
    color: '#6b7280',
    keywords: [], // fallback
  },
]

export const FALLBACK_CATEGORY = 'Altro'