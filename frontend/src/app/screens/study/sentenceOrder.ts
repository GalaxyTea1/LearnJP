export function appendToken(order: number[], index: number, count: number): number[] {
  return Number.isInteger(index) && index >= 0 && index < count && !order.includes(index)
    ? [...order, index] : order;
}
export function sentenceText(options: string[], order: number[]): string {
  return order.map(index => options[index] ?? '').join('');
}
