export const getPriceY = (price: number, currency_id: number): number => {
  const rate = 14.7

  if (currency_id == 2) return price
  else return Number((price / rate).toFixed(0))
}
