import { describe, it, expect } from 'vitest'
import { add, subtract, divide } from './calculator'

describe('계산기 테스트', () => {
  describe('add', () => {
    it('두 숫자를 더해야 한다', () => {
      expect(add(2, 3)).toBe(5)
      expect(add(-1, 1)).toBe(0)
    })
  })
  describe('subtract', () => {
    it('두 숫자를 빼야 한다', () => {
      expect(subtract(5, 3)).toBe(2)
      expect(subtract(2, 4)).toBe(-2)
    })
  })
  describe('divide', () => {
    it('두 숫자를 나눠야 한다', () => {
      expect(divide(6, 3)).toBe(2)
      expect(divide(5, 2)).toBe(2.5)
    })

    it('0으로 나누면 에러가 나와야 한다', () => {
      expect(() => divide(5, 0)).toThrow('0으로 못나눠')
    })
  })
})
