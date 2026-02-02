export function add(a: number, b: number): number {
  return a + b
}

export function subtract(a: number, b: number): number {
  return a - b
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('0으로 못나눠')
  }
  return a / b
}
