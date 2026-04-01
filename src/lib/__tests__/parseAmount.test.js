import { describe, it, expect } from 'vitest'
import { parseAmount } from '../parseAmount.js'

describe('parseAmount', () => {
  it('parses formato italiano con separatore migliaia: "1.234,56" → 1234.56', () => {
    expect(parseAmount('1.234,56')).toBe(1234.56)
  })

  it('parses decimale italiano: "12,50" → 12.5', () => {
    expect(parseAmount('12,50')).toBe(12.5)
  })

  it('parses formato internazionale: "1234.56" → 1234.56', () => {
    expect(parseAmount('1234.56')).toBe(1234.56)
  })

  it('parses formato internazionale con separatore migliaia: "1,234.56" → 1234.56', () => {
    expect(parseAmount('1,234.56')).toBe(1234.56)
  })

  it('parses "0,99" → 0.99', () => {
    expect(parseAmount('0,99')).toBe(0.99)
  })

  it('restituisce NaN per stringa vuota', () => {
    expect(parseAmount('')).toBeNaN()
  })

  it('restituisce NaN per stringa non numerica', () => {
    expect(parseAmount('abc')).toBeNaN()
  })

  it('restituisce NaN per null', () => {
    expect(parseAmount(null)).toBeNaN()
  })

  it('restituisce NaN per undefined', () => {
    expect(parseAmount(undefined)).toBeNaN()
  })

  it('"-12,50" → -12.5 (negativo preservato — scartato poi da extractTotal)', () => {
    // parseAmount restituisce -12.5; extractTotal lo scarta con il guard amount > 0
    expect(parseAmount('-12,50')).toBe(-12.5)
  })
})
