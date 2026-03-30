import { useMemo } from 'react'

/**
 * Deriva una mappa nome categoria → colore da `allCategories`.
 *
 * @param {Array<{name: string, color: string}>} allCategories
 * @returns {Object} mappa { [name]: color }
 */
export function useColorMap(allCategories) {
  return useMemo(() => {
    const map = {}
    allCategories.forEach((c) => { map[c.name] = c.color })
    return map
  }, [allCategories])
}