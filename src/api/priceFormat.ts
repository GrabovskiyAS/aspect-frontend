export function priceFormat<String>(price: String) {
  return Number(price)
    .toFixed()
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function getDiscountPrice(price: number, discount: number): number {
  return Number(((price * (100 - discount)) / 100).toFixed(0))
}
