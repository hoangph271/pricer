export const formatMoney = (amount: number, digits = 4) => {
  const formatOptions = amount >= 1000 ? {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  } : {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }
  return new Intl.NumberFormat('en-US', formatOptions).format(amount)
}
export const formatUsd = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(amount)
}
export const formatVnd = (amount: number) => {
  return `${Math.floor(amount).toLocaleString()} VND`
}
export const formatDate = (date: string) => {
  // ? Replace all `-` in the date string by `/`
  // * Because Safari is good at SUCKING
  // * And its handling of date string in YYYY-MM-DD format SUCKS, as expected
  const escapedDate = date.replace(/-/g, '/')
  const _date = new Date(escapedDate)

  return [
    _date.getDate().toString().padStart(2, '0'),
    _date.getMonth().toString().padStart(2, '0')
  ].join('/')
}
