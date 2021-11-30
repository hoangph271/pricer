import { PaidEntry } from '../global'

export const getColor = (colored: boolean | string, usdAmount: number) => {
  if (typeof colored === 'string') return colored

  if (colored) {
    return usdAmount < 0 ? 'red' : 'green'
  }

  return ''
}

export const queryCoinNameOrDefault = (paids: Record<string, PaidEntry[]>, defaultCoinName: string) => {
  const searchParams = new URLSearchParams(location.search)
  const coinName = searchParams.get('coinName')

  if (coinName !== null) {
    if (paids[coinName]) {
      return coinName
    }
  }

  return defaultCoinName
}
