import { useState, useCallback, useMemo } from 'react'
import { loadSettings, saveSettings } from '../lib/storage.js'
import { DEFAULT_CATEGORIES } from '../data/categories.js'

/**
 * Custom hook per la gestione delle impostazioni dell'app.
 * Espone le categorie (predefinite + custom) e le operazioni di modifica,
 * mantenendo lo stato React sincronizzato con il localStorage.
 *
 * @returns {{
 *   settings:              { customCategories: Array<{ name: string, color: string }> },
 *   allCategories:         Array<{ name: string, color: string, keywords: string[] }>,
 *   addCustomCategory:     (name: string, color: string) => void,
 *   removeCustomCategory:  (name: string) => void,
 *   replaceSettings:       (incoming: Object) => void,
 * }}
 */
export function useSettings() {
  const [settings, setSettings] = useState(() => loadSettings())

  const persist = useCallback((next) => {
    saveSettings(next)
    setSettings(next)
  }, [])

  /**
   * Lista unificata di categorie: predefinite (con keywords) seguite dalle custom
   * (con array `keywords` vuoto). Ricalcolata solo al cambio di `customCategories`.
   *
   * @type {Array<{ name: string, color: string, keywords: string[] }>}
   */
  const allCategories = useMemo(() => [
    ...DEFAULT_CATEGORIES,
    ...settings.customCategories.map((c) => ({ ...c, keywords: [] })),
  ], [settings.customCategories])

  /**
   * Aggiunge una nuova categoria personalizzata alle impostazioni.
   *
   * @param {string} name  - Nome della categoria (deve essere univoco).
   * @param {string} color - Colore esadecimale della categoria (es. `"#84cc16"`).
   */
  const addCustomCategory = useCallback((name, color) => {
    const next = {
      ...settings,
      customCategories: [...settings.customCategories, { name, color }],
    }
    saveSettings(next)
    setSettings(next)
  }, [settings])

  /**
   * Rimuove una categoria personalizzata dalle impostazioni.
   *
   * @param {string} name - Nome della categoria da rimuovere.
   */
  const removeCustomCategory = useCallback((name) => {
    const next = {
      ...settings,
      customCategories: settings.customCategories.filter((c) => c.name !== name),
    }
    saveSettings(next)
    setSettings(next)
  }, [settings])

  /**
   * Sostituisce completamente le impostazioni con quelle fornite e le persiste.
   * Tipicamente usato durante l'importazione di un backup JSON.
   *
   * @param {Object} incoming - Nuove impostazioni che sostituiranno quelle attuali.
   */
  const replaceSettings = useCallback((incoming) => {
    persist(incoming)
  }, [persist])

  return {
    settings,
    allCategories,
    addCustomCategory,
    removeCustomCategory,
    replaceSettings,
  }
}