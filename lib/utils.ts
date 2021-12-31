export const getColor = (colored: boolean | string, usdAmount: number) => {
  if (typeof colored === 'string') return colored

  if (colored) {
    return usdAmount < 0 ? 'red' : 'green'
  }

  return ''
}

export const queryCoinNameOrDefault = (coinNames: string[]) => {
  const searchParams = new URLSearchParams(location.search)
  const coinName = searchParams.get('coinName') ?? ''

  return coinNames.includes(coinName)
    ? coinName
    : null
}
