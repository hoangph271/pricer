export const getColor = (usdAmount: number, compareTo = 0) => {
  return usdAmount < compareTo ? 'red' : 'green'
}

export const queryCoinNameOrDefault = (coinNames: string[]) => {
  const searchParams = new URLSearchParams(location.search)
  const coinName = searchParams.get('coinName') ?? ''

  return coinNames.includes(coinName)
    ? coinName
    : coinNames[0]
}
