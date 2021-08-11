export const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 4,
    minimumFractionDigits: 4
  }).format(amount)
}
export const formatUsd = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 4,
    minimumFractionDigits: 4
  }).format(amount)
}
export const formatVnd = (amount: number) => {
  return `${Math.floor(amount).toLocaleString()} VND`
}

export const { API_ROOT = 'http://0.0.0.0:3000/api' } = process.env
