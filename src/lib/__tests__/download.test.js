import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { downloadFile } from '../download.js'

describe('downloadFile', () => {
  let mockAnchor, createElementSpy, appendChildSpy, removeChildSpy,
      createObjectURLSpy, revokeObjectURLSpy

  beforeEach(() => {
    mockAnchor = { href: '', download: '', click: vi.fn() }
    appendChildSpy = vi.fn()
    removeChildSpy = vi.fn()
    createElementSpy = vi.fn().mockReturnValue(mockAnchor)
    vi.stubGlobal('document', {
      createElement: createElementSpy,
      body: { appendChild: appendChildSpy, removeChild: removeChildSpy },
    })
    createObjectURLSpy = vi.fn().mockReturnValue('blob:mock-url')
    revokeObjectURLSpy = vi.fn()
    vi.stubGlobal('URL', { createObjectURL: createObjectURLSpy, revokeObjectURL: revokeObjectURLSpy })
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('crea un link con href e download corretti, poi lo clicca', () => {
    downloadFile('contenuto,csv', 'test.csv', 'text/csv;charset=utf-8;')
    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(mockAnchor.href).toBe('blob:mock-url')
    expect(mockAnchor.download).toBe('test.csv')
    expect(appendChildSpy).toHaveBeenCalledWith(mockAnchor)
    expect(mockAnchor.click).toHaveBeenCalledTimes(1)
    expect(removeChildSpy).toHaveBeenCalledWith(mockAnchor)
  })

  it('revoca l\'URL oggetto dopo 100ms (Safari iOS: revokeObjectURL differito)', () => {
    downloadFile('{}', 'backup.json', 'application/json')
    expect(revokeObjectURLSpy).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url')
  })

  it('passa il MIME type corretto a Blob', () => {
    const BlobSpy = vi.fn().mockImplementation(() => ({}))
    vi.stubGlobal('Blob', BlobSpy)
    downloadFile('a,b,c', 'file.csv', 'text/csv;charset=utf-8;')
    expect(BlobSpy).toHaveBeenCalledWith(['a,b,c'], { type: 'text/csv;charset=utf-8;' })
  })
})
