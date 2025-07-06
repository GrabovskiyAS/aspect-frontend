export const getPriceY = (price: number, currency_id: number, rate_rub_cny: number): number => {
  if (currency_id == 2) return price
  else return Number((price / rate_rub_cny).toFixed(0))
}
