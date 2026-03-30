# App Scontrini

> Web app React per digitalizzare scontrini tramite OCR client-side, categorizzare le spese e visualizzare statistiche mensili — tutto nel browser, senza backend.

---

## Indice

- [App Scontrini](#app-scontrini)
  - [Indice](#indice)
  - [Panoramica](#panoramica)
  - [Funzionalità](#funzionalità)
  - [Stack tecnologico](#stack-tecnologico)
  - [Prerequisiti](#prerequisiti)
  - [Installazione](#installazione)
  - [Utilizzo](#utilizzo)
  - [Test](#test)
  - [Struttura del progetto](#struttura-del-progetto)
  - [Limitazioni note](#limitazioni-note)
  - [Roadmap](#roadmap)

---

## Panoramica

App Scontrini è una **progressive web app mobile-first** che permette di fotografare uno scontrino, estrarne automaticamente i dati (importo, esercente, data) tramite OCR in italiano, e tenerli organizzati in categorie di spesa.

Tutto il processing avviene **nel browser** tramite [Tesseract.js](https://github.com/naptha/tesseract.js): nessun dato viene inviato a server esterni, nessun account richiesto.

---

## Funzionalità

- **Scansione OCR** — carica una foto di uno scontrino (JPG, PNG, WEBP) e ottieni automaticamente importo, esercente e data
- **Form di correzione** — modifica manualmente i dati riconosciuti prima di salvarli
- **Categorie di spesa** — 10 categorie predefinite con assegnazione automatica via keyword matching; possibilità di aggiungerne di custom
- **Storico scontrini** — lista ordinata per data con filtri per categoria, intervallo di date e ricerca testuale
- **Dashboard mensile** — totale speso nel mese corrente, confronto col mese precedente, grafico a torta per categoria e top 5 esercenti
- **Export / Import** — esportazione in CSV (compatibile Excel) e JSON; importazione JSON con modalità merge o sostituzione completa
- **Persistenza locale** — i dati vengono salvati in `localStorage`: rimangono disponibili tra le sessioni senza necessità di account

---

## Stack tecnologico

| Componente | Tecnologia | Versione |
|---|---|---|
| Framework UI | React | 18.3 |
| Routing | React Router | 6.28 |
| Styling | Tailwind CSS | 3.4 |
| Build tool | Vite | 6.0 |
| OCR | Tesseract.js | 4.1 |
| Grafici | Recharts | 2.13 |
| Icone | Lucide React | 0.460 |
| Test | Vitest | 2.0 |

---

## Prerequisiti

- **Node.js** ≥ 18
- **npm** ≥ 9

---

## Installazione

```bash
# Clona il repository
git clone https://github.com/megralo/app-scontrini.git
cd app-scontrini

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`.

Per creare la build di produzione:

```bash
npm run build
npm run preview   # anteprima locale della build
```

L'output si trova nella cartella `dist/` e può essere servito da qualsiasi hosting statico (Netlify, Vercel, GitHub Pages, ecc.).

> **Nota:** al primo utilizzo, Tesseract.js scarica il pacchetto linguistico italiano (~4 MB dalla CDN jsDelivr). Le sessioni successive usano la cache del browser.

---

## Utilizzo

| Pagina | Percorso | Descrizione |
|---|---|---|
| Dashboard | `/` | Statistiche e grafici del mese corrente |
| Scansione | `/scan` | Carica uno scontrino e avvia l'OCR |
| Storico | `/history` | Lista degli scontrini salvati con filtri |
| Impostazioni | `/settings` | Gestione categorie custom, export e import |

---

## Test

Il progetto include una suite di unit test per i moduli in `src/lib/`.

```bash
# Esegui i test
npm test

# Modalità watch
npm run test:watch

# Report di copertura
npm run test:coverage
```

Soglie di copertura configurate (su `src/lib/**`):

| Metrica | Soglia |
|---|---|
| Statements | 80% |
| Functions | 80% |
| Lines | 80% |
| Branches | 70% |

---

## Struttura del progetto

```
src/
├── pages/            # Dashboard, Scan, History, Settings
├── components/
│   ├── dashboard/    # MonthSummary, CategoryPieChart, TopMerchants
│   ├── history/      # ReceiptCard, FilterPanel, SearchBar, dialogs
│   ├── scan/         # FileUploader, OcrProgress, ReceiptForm
│   ├── settings/     # CategoryList, ExportSection, ImportSection
│   ├── layout/       # Layout, BottomNav
│   └── ui/           # Badge, Modal, SectionCard, EmptyState, ErrorBoundary
├── context/          # AppContext + hook useApp()
├── hooks/            # useReceipts, useSettings, useColorMap
├── lib/              # Logica pura testata (ocr, parseAmount, format, storage, …)
└── data/             # Categorie predefinite con keyword e colori
```

---

## Limitazioni note

- La qualità dell'OCR dipende dalla nitidezza della foto e dalla leggibilità del carattere termico; su scontrini rovinati o sbiaditi i dati estratti potrebbero essere imprecisi
- Il riconoscimento dell'esercente si basa sulla prima riga significativa del testo: in alcuni layout potrebbe non corrispondere al nome del negozio
- I dati sono salvati in `localStorage`: la capacità è limitata a circa 5–10 MB (sufficiente per migliaia di scontrini in formato testo); svuotare la cache del browser comporta la perdita dei dati non esportati
- Al momento non è prevista la sincronizzazione cloud né il supporto multi-dispositivo

---

## Roadmap

Le seguenti funzionalità sono escluse dalla versione 1 e valutate per iterazioni future:

- Sincronizzazione cloud / multi-dispositivo
- Supporto lingue aggiuntive per l'OCR
- Autenticazione e profili utente
- Budget mensile per categoria con notifiche
- Grafico dell'andamento spese nel tempo