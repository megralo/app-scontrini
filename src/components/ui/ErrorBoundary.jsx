import { Component } from 'react'

/**
 * Componente React che cattura le eccezioni non gestite generate durante il
 * render, nei lifecycle methods o nei costruttori dell'albero figlio.
 *
 * Quando si verifica un errore, sostituisce l'albero figlio con un messaggio
 * di errore e un pulsante "Ricarica" che esegue `window.location.reload()`.
 *
 * @extends {Component<{ children: import('react').ReactNode }>}
 *
 * @prop {import('react').ReactNode} children - Albero React da proteggere.
 *
 * Nota: i class component error boundary NON intercettano errori originati
 * negli event handler (es. onClick). Quelli devono essere gestiti con
 * try/catch all'interno dell'handler stesso.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <p className="text-lg font-semibold text-gray-800 mb-2">Qualcosa è andato storto</p>
          <p className="text-sm text-gray-500 mb-6">
            {this.state.error?.message ?? 'Errore sconosciuto'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow active:bg-blue-700"
          >
            Ricarica
          </button>
        </div>
      )
    }
    return this.props.children
  }
}