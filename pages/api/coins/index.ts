import type { NextApiHandler } from 'next'
import fetch from 'node-fetch'
import { getSession } from 'next-auth/react'
import HttpStatus from 'http-status'
import { cors, runMiddleware, statusRes } from '../_api_helpers'
import { PaidEntry } from '../../../global'
import { paidEntries } from './_paid_entries'

const getPrices = async (...names: string[]): Promise<number[]> => {
  return await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${names.join(',')}`, {
    headers: {
      'X-CMC_PRO_API_KEY': 'deb827df-a1a6-4ceb-940c-3114e9adca4d'
    }
  }).then(async res => {
    const { data } = await res.json() as any

    return Object.values(data).map((val: any) => val.quote.USD.price as number)
  })
}

export type CoinStats = {
  prices: Record<string, number>
  usdPrice: number
  totalHave: number
  totalSpent: number
  paids: Record<string, PaidEntry[]>
}
const handler: NextApiHandler<CoinStats> = async (req, res) => {
  try {
    await runMiddleware(req, res, cors)

    const session = await getSession({ req })

    if (!session) {
      return statusRes(res, HttpStatus.UNAUTHORIZED)
    }

    const allEntries = Object.values(paidEntries).flat(1)
    const totalSpent = allEntries.reduce((sum, entry) => entry.amountUsd + sum, 0)
    const cryptoSymbols = Object.getOwnPropertyNames(paidEntries).sort()

    const [
      cryptoPrices,
      [[usdPrice]]
    ] = await Promise.all([
      getPrices(...cryptoSymbols),
      // ! FIXME: Get USD price somewhere else
      [[22_710]]
    ])

    const priceReducer = (price: number) => (prev: number, val: PaidEntry) => val.amount * price + prev
    const totalHave = cryptoSymbols.reduce((prev, val, i) => {
      const cryptoTotal = paidEntries[val].reduce(priceReducer(cryptoPrices[i]), 0)

      return prev + cryptoTotal
    }, 0)

    const prices = cryptoSymbols.reduce((prev: any, val, i) => {
      prev[val] = cryptoPrices[i]
      return prev
    }, {})

    const resBody: CoinStats = {
      prices,
      totalHave,
      totalSpent,
      paids: paidEntries,
      usdPrice
    }

    res.status(200).json(resBody)
  } catch (error) {
    console.error(error)
  }
}

export default handler
