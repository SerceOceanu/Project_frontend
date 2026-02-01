export function multiply(a: number, b: number): number {
  return Math.round(a * b * 100) / 100;
}

export function add(a: number, b: number): number {
  return Math.round((a + b) * 100) / 100;
}

export function sum(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const total = numbers.reduce((acc, num) => acc + num, 0);
  return Math.round(total * 100) / 100;
}

export function formatCurrency(num: number): string {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export function calculateItemTotal(price: number, quantity: number): number {
  return Math.round(price * quantity * 100) / 100;
}
