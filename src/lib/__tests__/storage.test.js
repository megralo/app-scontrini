import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  loadReceipts,
  saveReceipts,
  loadSettings,
  saveSettings,
  dumpAll,
  restoreAll,
  StorageQuotaError,
  deleteReceipt,
  updateReceipt,
} from '../storage.js'

function makeMockStorage() {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = value }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear() { store = {} },
  }
}

let mock

describe('storage', () => {
  beforeEach(() => {
    mock = makeMockStorage()
    vi.stubGlobal('localStorage', mock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // loadReceipts
  it('loadReceipts() restituisce [] quando localStorage è vuoto', () => {
    expect(loadReceipts()).toEqual([])
  })

  it('loadReceipts() restituisce [] su JSON corrotto (graceful degradation)', () => {
    mock.getItem.mockReturnValueOnce('not-valid-json{{{')
    expect(loadReceipts()).toEqual([])
  })

  it('loadReceipts() restituisce [] se il valore salvato non è un array', () => {
    mock.getItem.mockReturnValueOnce(JSON.stringify({ foo: 'bar' }))
    expect(loadReceipts()).toEqual([])
  })

  // saveReceipts / round-trip
  it('saveReceipts e loadReceipts sono round-trip coerenti', () => {
    const receipts = [{ id: '1', date: '2024-01-15', total: 12.5 }]
    saveReceipts(receipts)
    expect(loadReceipts()).toEqual(receipts)
  })

  it('saveReceipts lancia StorageQuotaError se setItem fallisce', () => {
    mock.setItem.mockImplementationOnce(() => {
      const err = new Error('QuotaExceededError')
      err.name = 'QuotaExceededError'
      throw err
    })
    expect(() => saveReceipts([])).toThrow(StorageQuotaError)
  })

  it('StorageQuotaError ha name === "StorageQuotaError"', () => {
    const err = new StorageQuotaError()
    expect(err.name).toBe('StorageQuotaError')
    expect(err.message).toBeTruthy()
  })

  // loadSettings
  it('loadSettings() restituisce DEFAULT_SETTINGS quando localStorage è vuoto', () => {
    const s = loadSettings()
    expect(s).toHaveProperty('customCategories')
    expect(Array.isArray(s.customCategories)).toBe(true)
  })

  it('loadSettings() fonde i dati salvati con i DEFAULT_SETTINGS', () => {
    mock.getItem.mockReturnValueOnce(JSON.stringify({ customCategories: [{ name: 'Test', color: '#fff' }] }))
    const s = loadSettings()
    expect(s.customCategories).toHaveLength(1)
    expect(s.customCategories[0].name).toBe('Test')
  })

  // deleteReceipt
  it('deleteReceipt rimuove lo scontrino con l\'id specificato', () => {
    saveReceipts([{ id: 'a' }, { id: 'b' }])
    deleteReceipt('a')
    expect(loadReceipts()).toEqual([{ id: 'b' }])
  })

  // updateReceipt
  it('updateReceipt aggiorna i campi dello scontrino mantenendo l\'id', () => {
    saveReceipts([{ id: 'x', total: 10, merchant: 'Old' }])
    updateReceipt('x', { merchant: 'New', total: 20 })
    expect(loadReceipts()).toEqual([{ id: 'x', total: 20, merchant: 'New' }])
  })

  // saveSettings
  it('saveSettings persiste le impostazioni (round-trip con loadSettings)', () => {
    saveSettings({ customCategories: [{ name: 'Food', color: '#f00' }] })
    const s = loadSettings()
    expect(s.customCategories).toHaveLength(1)
    expect(s.customCategories[0].name).toBe('Food')
  })

  it('saveSettings lancia StorageQuotaError se setItem fallisce', () => {
    mock.setItem.mockImplementationOnce(() => {
      const err = new Error('QuotaExceededError')
      err.name = 'QuotaExceededError'
      throw err
    })
    expect(() => saveSettings({ customCategories: [] })).toThrow(StorageQuotaError)
  })

  // dumpAll
  it('dumpAll restituisce { receipts, settings } con i dati persistiti', () => {
    saveReceipts([{ id: 'z', date: '2024-05-01', total: 9.9 }])
    const dump = dumpAll()
    expect(dump).toHaveProperty('receipts')
    expect(dump).toHaveProperty('settings')
    expect(Array.isArray(dump.receipts)).toBe(true)
    expect(dump.receipts[0].id).toBe('z')
  })

  // restoreAll
  it('restoreAll ripristina receipts e settings da un dump', () => {
    restoreAll({
      receipts: [{ id: 'r1', date: '2024-01-01', total: 5 }],
      settings: { customCategories: [{ name: 'Test', color: '#000' }] },
    })
    expect(loadReceipts()[0].id).toBe('r1')
    expect(loadSettings().customCategories[0].name).toBe('Test')
  })

  it('restoreAll ignora receipts se non è un array', () => {
    saveReceipts([{ id: 'existing' }])
    restoreAll({ receipts: null, settings: null })
    expect(loadReceipts()).toEqual([{ id: 'existing' }])
  })
})