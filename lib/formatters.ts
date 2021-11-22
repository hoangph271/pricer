export const formatMoney = (amount: number, maybeDigits?: number) => {
  const needsMoreZero = amount < 0.0001
  let digits = maybeDigits

  if (typeof maybeDigits !== 'number') {
    digits = needsMoreZero
      ? 6
      : 4
  }

  const formatOptions = amount >= 1000 ? {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  } : {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }

  const formatted = new Intl.NumberFormat('en-US', formatOptions).format(amount)

  return needsMoreZero
    ? formatted.slice(1)
    : formatted
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
export const str2Date = (date: string) => {
  // ? Replace all `-` in the date string by `/`
  // * Because Safari is good at SUCKING
  // * And its handling of date string in YYYY-MM-DD format SUCKS, as expected
  const escapedDate = date.replace(/-/g, '/')
  return new Date(escapedDate)
}
export const formatDate = (date: string) => {
  const _date = str2Date(date)

  return [
    _date.getDate().toString().padStart(2, '0'),
    (_date.getMonth() + 1).toString().padStart(2, '0')
  ].join('/')
}
