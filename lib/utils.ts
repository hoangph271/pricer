export const getColor = (colored: boolean | string, usdAmount: number, compareTo = 0) => {
  if (typeof colored === 'string') return colored

  if (colored) {
    return usdAmount < compareTo ? 'red' : 'green'
  }

  return ''
}

export const queryCoinNameOrDefault = (coinNames: string[]) => {
  const searchParams = new URLSearchParams(location.search)
  const coinName = searchParams.get('coinName') ?? ''

  return coinNames.includes(coinName)
    ? coinName
    : coinNames.at(0)
}
